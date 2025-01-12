import { 
  PluginConfigSchema, 
  PluginConfig, 
  ConfigValidationResult, 
  ConfigMiddleware, 
  ConfigEncryption,
  ConfigValidationError 
} from './types';
import { logger } from '../../utils/logger';
import { EventBus } from '../../events/EventBus';

export class ConfigManager {
  private static instance: ConfigManager;
  private configs: Map<string, PluginConfig>;
  private schemas: Map<string, PluginConfigSchema>;
  private middlewares: ConfigMiddleware[] = [];
  private encryption?: ConfigEncryption;
  private eventBus: EventBus;

  private constructor() {
    this.configs = new Map();
    this.schemas = new Map();
    this.eventBus = EventBus.getInstance();
    this.initializeEventBus();
  }

  private async initializeEventBus() {
    await this.eventBus.start();
    this.eventBus.registerChannel('config');
  }

  public addMiddleware(middleware: ConfigMiddleware): void {
    this.middlewares.push(middleware);
  }

  public setEncryption(encryption: ConfigEncryption): void {
    this.encryption = encryption;
  }

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  registerSchema(pluginName: string, schema: PluginConfigSchema): void {
    if (this.schemas.has(pluginName)) {
      throw new Error(`Configuration schema already registered for plugin: ${pluginName}`);
    }
    this.schemas.set(pluginName, schema);
    logger.debug(`Registered config schema for plugin: ${pluginName}`);
  }

  async setConfig(pluginName: string, config: PluginConfig): Promise<ConfigValidationResult> {
    const schema = this.schemas.get(pluginName);
    if (!schema) {
      throw new Error(`No configuration schema registered for plugin: ${pluginName}`);
    }

    const validationResult = this.validateConfig(config, schema);
    if (!validationResult.isValid) {
      return validationResult;
    }

    try {
      let processedConfig = { ...config };
      
      // Apply middleware chain
      for (const middleware of this.middlewares) {
        await middleware(processedConfig, async (updatedConfig) => {
          processedConfig = updatedConfig;
        });
      }

      // Handle encryption of sensitive fields
      if (this.encryption) {
        for (const [key, def] of Object.entries(schema)) {
          if (def.sensitive && key in processedConfig) {
            processedConfig[key] = await this.encryption.encrypt(processedConfig[key]);
          }
        }
      }

      const finalConfig = this.mergeWithDefaults(processedConfig, schema);
      this.configs.set(pluginName, finalConfig);
      
      this.eventBus.publish('config', {
        type: 'config:config:changed',
        source: 'config-manager',
        payload: {
          pluginName,
          config: finalConfig
        },
        timestamp: Date.now()
      });
      
      logger.info(`Configuration set for plugin: ${pluginName}`, { config: finalConfig });
      return { isValid: true, errors: [] };
    } catch (error) {
      this.eventBus.publish('config', {
        type: 'config:config:validation-failed',
        source: 'config-manager',
        payload: {
          pluginName,
          error
        },
        timestamp: Date.now()
      });
      throw error;
    }
  }

  getConfig<T extends PluginConfig>(pluginName: string): T {
    const config = this.configs.get(pluginName);
    if (!config) {
      throw new Error(`No configuration found for plugin: ${pluginName}`);
    }
    return config as T;
  }

  private validateConfig(config: PluginConfig, schema: PluginConfigSchema): ConfigValidationResult {
    const errors: ConfigValidationError[] = [];

    for (const [key, def] of Object.entries(schema)) {
      if (def.required && !(key in config)) {
        errors.push({
          key,
          message: `Missing required configuration key: ${key}`
        });
        continue;
      }

      if (key in config) {
        const value = config[key];

        if (typeof value !== def.type && def.type !== 'array') {
          errors.push({
            key,
            message: `Invalid type for ${key}: expected ${def.type}, got ${typeof value}`
          });
        }

        if (def.type === 'array' && !Array.isArray(value)) {
          errors.push({
            key,
            message: `Invalid type for ${key}: expected array, got ${typeof value}`
          });
        }

        if (def.validate && !def.validate(value)) {
          errors.push({
            key,
            message: `Validation failed for ${key}`
          });
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private mergeWithDefaults(config: PluginConfig, schema: PluginConfigSchema): PluginConfig {
    const result = { ...config };

    for (const [key, def] of Object.entries(schema)) {
      if (!(key in result) && 'default' in def) {
        result[key] = def.default;
      }
    }

    return result;
  }

  clearConfig(pluginName: string): void {
    this.configs.delete(pluginName);
    logger.debug(`Cleared configuration for plugin: ${pluginName}`);
  }

  clearAll(): void {
    this.configs.clear();
    this.schemas.clear();
    logger.debug('Cleared all plugin configurations');
  }
}
