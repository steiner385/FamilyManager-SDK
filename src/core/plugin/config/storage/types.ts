export interface ConfigStorage {
  save(pluginName: string, config: PluginConfig): Promise<void>;
  load(pluginName: string): Promise<PluginConfig | null>;
  delete(pluginName: string): Promise<void>;
  clear(): Promise<void>;
}
