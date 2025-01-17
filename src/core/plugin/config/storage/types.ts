import { PluginConfig } from '../../types';

export interface ConfigStorage {
  load(pluginName: string): Promise<PluginConfig | null>;
  save(pluginName: string, config: PluginConfig): Promise<void>;
  delete(pluginName: string): Promise<void>;
  exists(pluginName: string): Promise<boolean>;
}
