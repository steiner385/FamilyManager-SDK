import React, { useState, useEffect } from 'react';
import { SyncOperation, SyncStatus } from '../../core/sync/SyncEngine';

interface ConflictResolutionDialogProps {
  conflict: SyncOperation<any>;
  onResolve: (resolution: 'local' | 'server' | 'merge', mergedData?: any) => void;
  onCancel: () => void;
  entityName?: string;
  showMergeOption?: boolean;
}

/**
 * Component for resolving sync conflicts
 */
export const ConflictResolutionDialog: React.FC<ConflictResolutionDialogProps> = ({
  conflict,
  onResolve,
  onCancel,
  entityName = 'item',
  showMergeOption = true
}) => {
  const [selectedOption, setSelectedOption] = useState<'local' | 'server' | 'merge'>('server');
  const [mergedData, setMergedData] = useState<any>(null);
  const [diffFields, setDiffFields] = useState<string[]>([]);

  // Determine which fields are different between local and server data
  useEffect(() => {
    if (conflict && conflict.data && conflict.conflictData) {
      const localData = conflict.data;
      const serverData = conflict.conflictData;
      const fields: string[] = [];

      // Find all fields in either object
      const allFields = new Set([
        ...Object.keys(localData),
        ...Object.keys(serverData)
      ]);

      // Check which fields have different values
      allFields.forEach(field => {
        if (JSON.stringify(localData[field]) !== JSON.stringify(serverData[field])) {
          fields.push(field);
        }
      });

      setDiffFields(fields);

      // Initialize merged data with server data
      setMergedData({ ...serverData });
    }
  }, [conflict]);

  // Handle field selection for merge
  const handleFieldSelection = (field: string, source: 'local' | 'server') => {
    if (selectedOption !== 'merge' || !conflict.data || !conflict.conflictData) {
      return;
    }

    setMergedData(prev => ({
      ...prev,
      [field]: source === 'local' ? conflict.data[field] : conflict.conflictData[field]
    }));
  };

  // Format date for display
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  // Get a human-readable name for the entity type
  const getEntityTypeName = () => {
    if (entityName) {
      return entityName;
    }

    const type = conflict.entityType;
    // Convert camelCase or snake_case to Title Case
    return type
      .replace(/([A-Z])/g, ' $1') // Insert a space before all capital letters
      .replace(/_/g, ' ') // Replace underscores with spaces
      .replace(/^\w/, c => c.toUpperCase()); // Capitalize the first letter
  };

  if (!conflict || !conflict.data || !conflict.conflictData) {
    return null;
  }

  return (
    <div className="conflict-resolution-dialog">
      <div className="conflict-header">
        <h2>Resolve Conflict</h2>
        <p>
          There is a conflict with this {getEntityTypeName()}. 
          Please choose which version you want to keep.
        </p>
      </div>

      <div className="conflict-options">
        <label>
          <input
            type="radio"
            name="resolution"
            value="local"
            checked={selectedOption === 'local'}
            onChange={() => setSelectedOption('local')}
          />
          Use your version (from {formatDate(conflict.metadata.timestamp)})
        </label>

        <label>
          <input
            type="radio"
            name="resolution"
            value="server"
            checked={selectedOption === 'server'}
            onChange={() => setSelectedOption('server')}
          />
          Use server version
          {conflict.conflictData.updatedAt && ` (from ${formatDate(new Date(conflict.conflictData.updatedAt).getTime())})`}
        </label>

        {showMergeOption && (
          <label>
            <input
              type="radio"
              name="resolution"
              value="merge"
              checked={selectedOption === 'merge'}
              onChange={() => setSelectedOption('merge')}
            />
            Merge changes
          </label>
        )}
      </div>

      {selectedOption === 'merge' && (
        <div className="merge-options">
          <h3>Select which version to use for each field:</h3>
          <table className="merge-table">
            <thead>
              <tr>
                <th>Field</th>
                <th>Your Version</th>
                <th>Server Version</th>
              </tr>
            </thead>
            <tbody>
              {diffFields.map(field => (
                <tr key={field}>
                  <td>{field}</td>
                  <td>
                    <label>
                      <input
                        type="radio"
                        name={`field-${field}`}
                        checked={JSON.stringify(mergedData[field]) === JSON.stringify(conflict.data[field])}
                        onChange={() => handleFieldSelection(field, 'local')}
                      />
                      {JSON.stringify(conflict.data[field])}
                    </label>
                  </td>
                  <td>
                    <label>
                      <input
                        type="radio"
                        name={`field-${field}`}
                        checked={JSON.stringify(mergedData[field]) === JSON.stringify(conflict.conflictData[field])}
                        onChange={() => handleFieldSelection(field, 'server')}
                      />
                      {JSON.stringify(conflict.conflictData[field])}
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="conflict-preview">
        <h3>Preview:</h3>
        <div className="preview-content">
          <pre>
            {JSON.stringify(
              selectedOption === 'local'
                ? conflict.data
                : selectedOption === 'server'
                ? conflict.conflictData
                : mergedData,
              null,
              2
            )}
          </pre>
        </div>
      </div>

      <div className="conflict-actions">
        <button onClick={onCancel}>Cancel</button>
        <button
          onClick={() => onResolve(
            selectedOption,
            selectedOption === 'merge' ? mergedData : undefined
          )}
          className="primary"
        >
          Resolve Conflict
        </button>
      </div>

      <style jsx>{`
        .conflict-resolution-dialog {
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          max-width: 800px;
          margin: 0 auto;
          padding: 24px;
        }

        .conflict-header h2 {
          margin-top: 0;
          color: #d32f2f;
        }

        .conflict-options {
          margin: 24px 0;
        }

        .conflict-options label {
          display: block;
          margin-bottom: 12px;
        }

        .merge-options {
          margin: 24px 0;
          border: 1px solid #e0e0e0;
          padding: 16px;
          border-radius: 4px;
        }

        .merge-table {
          width: 100%;
          border-collapse: collapse;
        }

        .merge-table th, .merge-table td {
          border: 1px solid #e0e0e0;
          padding: 8px;
          text-align: left;
        }

        .merge-table th {
          background-color: #f5f5f5;
        }

        .conflict-preview {
          margin: 24px 0;
          border: 1px solid #e0e0e0;
          padding: 16px;
          border-radius: 4px;
        }

        .preview-content {
          max-height: 300px;
          overflow-y: auto;
          background-color: #f5f5f5;
          padding: 12px;
          border-radius: 4px;
        }

        .conflict-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 24px;
        }

        button {
          padding: 8px 16px;
          border-radius: 4px;
          border: 1px solid #ccc;
          background-color: #f5f5f5;
          cursor: pointer;
        }

        button.primary {
          background-color: #1976d2;
          color: white;
          border-color: #1976d2;
        }
      `}</style>
    </div>
  );
};