import React from 'react';
import { useSync } from '../../hooks/useSync';

/**
 * Props for SyncStatusIndicator component
 */
interface SyncStatusIndicatorProps {
  showLastSync?: boolean;
  showPendingChanges?: boolean;
  showConflicts?: boolean;
  onSyncClick?: () => void;
  onConflictsClick?: () => void;
  className?: string;
}

/**
 * Component for displaying sync status
 */
export const SyncStatusIndicator: React.FC<SyncStatusIndicatorProps> = ({
  showLastSync = true,
  showPendingChanges = true,
  showConflicts = true,
  onSyncClick,
  onConflictsClick,
  className = ''
}) => {
  const {
    isSyncing,
    lastSyncTime,
    pendingChanges,
    conflicts,
    isOnline,
    syncNow
  } = useSync();

  /**
   * Format date for display
   */
  const formatDate = (date: Date | null): string => {
    if (!date) return 'Never';
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    
    if (diffSec < 60) {
      return 'Just now';
    } else if (diffMin < 60) {
      return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`;
    } else if (diffHour < 24) {
      return `${diffHour} hour${diffHour !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleString();
    }
  };

  /**
   * Handle sync button click
   */
  const handleSyncClick = async () => {
    if (onSyncClick) {
      onSyncClick();
    } else {
      await syncNow();
    }
  };

  /**
   * Handle conflicts button click
   */
  const handleConflictsClick = () => {
    if (onConflictsClick) {
      onConflictsClick();
    }
  };

  return (
    <div className={`sync-status-indicator ${className}`}>
      <div className="sync-status-icon">
        {isSyncing ? (
          <div className="sync-spinner" title="Syncing...">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <circle
                className="sync-spinner-circle"
                cx="12"
                cy="12"
                r="10"
                fill="none"
                strokeWidth="2"
              />
            </svg>
          </div>
        ) : (
          <button
            className={`sync-button ${!isOnline ? 'offline' : ''}`}
            onClick={handleSyncClick}
            disabled={!isOnline}
            title={isOnline ? 'Sync now' : 'Offline'}
          >
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path
                d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"
                fill="currentColor"
              />
            </svg>
          </button>
        )}
      </div>

      {showLastSync && (
        <div className="sync-last-time" title="Last synchronized">
          <span className="sync-label">Last sync:</span>
          <span className="sync-value">{formatDate(lastSyncTime)}</span>
        </div>
      )}

      {showPendingChanges && pendingChanges > 0 && (
        <div className="sync-pending" title="Changes pending to be synced">
          <span className="sync-label">Pending:</span>
          <span className="sync-value">{pendingChanges}</span>
        </div>
      )}

      {showConflicts && conflicts.length > 0 && (
        <div className="sync-conflicts" title="Conflicts need resolution">
          <button
            className="conflicts-button"
            onClick={handleConflictsClick}
          >
            <span className="sync-label">Conflicts:</span>
            <span className="sync-value conflicts">{conflicts.length}</span>
          </button>
        </div>
      )}

      {!isOnline && (
        <div className="sync-offline-indicator" title="Working offline">
          Offline
        </div>
      )}

      <style jsx>{`
        .sync-status-indicator {
          display: flex;
          align-items: center;
          font-size: 0.875rem;
          color: #555;
          padding: 4px 8px;
          border-radius: 4px;
          background-color: ${isOnline ? '#f5f5f5' : '#fff3e0'};
        }

        .sync-status-icon {
          margin-right: 8px;
        }

        .sync-spinner {
          animation: rotate 2s linear infinite;
          width: 24px;
          height: 24px;
        }

        .sync-spinner-circle {
          stroke: #1976d2;
          stroke-linecap: round;
          animation: dash 1.5s ease-in-out infinite;
        }

        .sync-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          color: #1976d2;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sync-button:hover {
          color: #0d47a1;
        }

        .sync-button.offline {
          color: #9e9e9e;
          cursor: not-allowed;
        }

        .sync-last-time,
        .sync-pending,
        .sync-conflicts {
          margin-right: 16px;
          display: flex;
          align-items: center;
        }

        .sync-label {
          margin-right: 4px;
          font-weight: 500;
        }

        .sync-value {
          color: #333;
        }

        .sync-value.conflicts {
          color: #d32f2f;
          font-weight: bold;
        }

        .conflicts-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
          font-size: inherit;
          color: inherit;
        }

        .conflicts-button:hover .sync-value.conflicts {
          text-decoration: underline;
        }

        .sync-offline-indicator {
          background-color: #ffcc80;
          color: #e65100;
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 500;
          font-size: 0.75rem;
        }

        @keyframes rotate {
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes dash {
          0% {
            stroke-dasharray: 1, 150;
            stroke-dashoffset: 0;
          }
          50% {
            stroke-dasharray: 90, 150;
            stroke-dashoffset: -35;
          }
          100% {
            stroke-dasharray: 90, 150;
            stroke-dashoffset: -124;
          }
        }
      `}</style>
    </div>
  );
};