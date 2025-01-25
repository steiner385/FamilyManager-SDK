import { EventBus } from '../../events/EventBus';
import { Logger } from '../../logging/Logger';
import { createValidationMiddleware } from './middleware/validation';
import { FileConfigStorage } from './storage/FileConfigStorage';
import { ConfigStorage } from './storage/types';
import { 
  ConfigEncryption, 
  ConfigValue, 
  ConfigMiddleware, 
  ConfigSchema 
} from './types';

export class ConfigManager {
  private static instance: ConfigManager;
  private eventBus: EventBus;
  private storage: ConfigStorage;
  private middlewares: ConfigMiddleware[];
  private readonly source = 'config-manager';
  private schemas: Map<string, ConfigSchema>;
  private encryption?: ConfigEncryption;
  private configs: Map<string, ConfigValue>;
  private validationMiddleware: ReturnType<typeof createValidationMiddleware>;

  private logger = Logger.getInstance();

  private constructor() {
    this.middlewares = [];
    this.configs = new Map();
    this.eventBus = EventBus.getInstance();
    this.storage = new FileConfigStorage();
    this.validationMiddleware = createValidationMiddleware(null, null);
    this.schemas = new Map();
  }

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  public registerSchema(pluginName: string, schema: ConfigSchema): void {
    this.schemas.set(pluginName, schema);
  }

  public setEncryption(encryption: ConfigEncryption): void {
    this.encryption = encryption;
  }

  public async init(): Promise<void> {
    await this.eventBus.start();
    this.eventBus.registerChannel('config');
  }

  public addMiddleware(middleware: ConfigMiddleware): void {
    this.middlewares.push(middleware);
  }

  public async getConfig(pluginName: string): Promise<ConfigValue | undefined> {
    return this.configs.get(pluginName);
  }

  public async setConfig(pluginName: string, config: ConfigValue): Promise<void> {
    // Create a new config object to avoid mutations
    let currentConfig = { ...config };
    
    // Handle encryption of sensitive fields
    if (this.encryption && this.schemas.has(pluginName)) {
      const schema = this.schemas.get(pluginName);
      
      // Create new object to store encrypted values
      const encryptedConfig = { ...config };
      
      // Encrypt sensitive fields
      if (schema?.properties) {
        for (const [key, field] of Object.entries(schema.properties)) {
          if (field.sensitive && typeof config[key] === 'string') {
            try {
              encryptedConfig[key] = await this.encryption.encrypt(config[key]);
            } catch (error) {
              this.logger?.error(`Failed to encrypt field ${key}`, { error });
              throw error;
            }
          }
        }
      }
      
      // Update current config with encrypted values
      currentConfig = encryptedConfig;
    }
    
    // Chain middlewares
    const executeMiddleware = async (index: number, config: ConfigValue = currentConfig): Promise<void> => {
      if (index >= this.middlewares.length) {
        // All middleware executed, store final config and emit event
        this.configs.set(pluginName, config);
        await this.eventBus.emit({
          id: `config-changed-${Date.now()}`,
          type: 'CONFIG_CHANGED',
          channel: 'config',
          source: this.source,
          timestamp: Date.now(),
          data: {
            pluginName,
            config
          }
        });
        return;
      }

      try {
        await this.middlewares[index](config, async (nextConfig) => {
          await executeMiddleware(index + 1, nextConfig);
        });
      } catch (error) {
        await this.eventBus.emit({
          id: `config-validation-failed-${Date.now()}`,
          type: 'CONFIG_VALIDATION_FAILED',
          channel: 'config',
          source: this.source,
          timestamp: Date.now(),
          data: {
            pluginName,
            error: error instanceof Error ? error.message : 'Unknown error'
          }
        });
        throw error;
      }
    };

    await executeMiddleware(0);
  }

  public async loadConfig(pluginName: string): Promise<ConfigValue | null> {
    try {
      const config = await this.storage.load(pluginName);
      if (!config) {
        return null;
      }

      await this.validationMiddleware(config, async (validConfig) => {
        this.configs.set(pluginName, validConfig);
      });

      return config;
    } catch (error) {
      await this.eventBus.emit({
        id: `config-error-${Date.now()}`,
        type: 'config:error',
        channel: 'config',
        source: this.source,
        timestamp: Date.now(),
        data: {
          pluginName,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      });
      return null;
    }
  }

  public async saveConfig(pluginName: string, config: ConfigValue): Promise<boolean> {
    try {
      await this.validationMiddleware(config, async (validConfig) => {
        await this.storage.save(pluginName, validConfig);
        this.configs.set(pluginName, validConfig);
      });

      await this.eventBus.emit({
        id: `config-changed-${Date.now()}`,
        type: 'config:changed',
        channel: 'config',
        source: this.source,
        timestamp: Date.now(),
        data: {
          pluginName,
          config
        }
      });

      return true;
    } catch (error) {
      await this.eventBus.emit({
        id: `config-error-${Date.now()}`,
        type: 'config:error',
        channel: 'config',
        source: this.source,
        timestamp: Date.now(),
        data: {
          pluginName,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      });
      return false;
    }
  }
}
