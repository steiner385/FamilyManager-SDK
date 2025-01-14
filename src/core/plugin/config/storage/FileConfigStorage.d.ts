import { ConfigStorage } from './types';
import { PluginConfig } from '../../types';
export declare class FileConfigStorage implements ConfigStorage {
    private configDir;
    constructor(configDir?: string);
    private ensureConfigDir;
    private getConfigPath;
    save(pluginName: string, config: PluginConfig): Promise<void>;
    load(pluginName: string): Promise<PluginConfig | null>;
    delete(pluginName: string): Promise<void>;
    clear(): Promise<void>;
}
//# sourceMappingURL=FileConfigStorage.d.ts.map