import { ConfigValue } from '../types';

export interface ConfigStorage {
  load(pluginName: string): Promise<ConfigValue | null>;
  save(pluginName: string, config: ConfigValue): Promise<void>;
  delete(pluginName: string): Promise<void>;
  exists(pluginName: string): Promise<boolean>;
}
