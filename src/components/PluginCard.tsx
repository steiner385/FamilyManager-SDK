import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { PluginMetadata } from '../core/types';

interface PluginCardProps {
  metadata: PluginMetadata & {
    dependencies?: string[];  // Extending PluginMetadata to include optional dependencies
  };
  isEnabled: boolean;
  isInstalled: boolean;
  onEnable: () => Promise<void>;
  onDisable: () => Promise<void>;
  onUninstall: () => Promise<void>;
  onConfigure: () => void;
}

export function PluginCard({
  metadata,
  isEnabled,
  isInstalled,
  onEnable,
  onDisable,
  onUninstall,
  onConfigure
}: PluginCardProps) {
  return (
    <Card>
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium">{metadata.name}</h3>
            <p className="text-sm text-gray-500">{metadata.description}</p>
          </div>
          <Badge variant={isEnabled ? 'success' : 'secondary'} size="small">
            {isEnabled ? 'Enabled' : 'Disabled'}
          </Badge>
        </div>

        <div className="text-sm text-gray-500">
          <div>Version: {metadata.version}</div>
          {metadata.author && <div>Author: {metadata.author}</div>}
        </div>

        {metadata.dependencies && metadata.dependencies.length > 0 && (
          <div className="text-sm">
            <span className="font-medium">Dependencies:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {metadata.dependencies.map((dep: string) => (
                <Badge key={dep} variant="info" size="small">{dep}</Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-4">
          {isInstalled ? (
            <>
              <Button
                variant="outline"
                size="small"
                onClick={isEnabled ? onDisable : onEnable}
              >
                {isEnabled ? 'Disable' : 'Enable'}
              </Button>
              <Button
                variant="outline"
                size="small"
                onClick={onConfigure}
              >
                Configure
              </Button>
              <Button
                variant="outline"
                size="small"
                className="text-error-500 border-error-500 hover:bg-error-50"
                onClick={onUninstall}
              >
                Uninstall
              </Button>
            </>
          ) : (
            <Button
              variant="primary"
              size="small"
              onClick={onEnable}
            >
              Install
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
