import { EventBus } from '../../events/EventBus';
import { PluginConfig } from '../types';
import { ValidationMiddleware } from './middleware/validation';
import { createValidationMiddleware } from './middleware/validation';
import { FileConfigStorage } from './storage/FileConfigStorage';
import { ConfigStorage } from './storage/types';

export class ConfigManager {
  private static instance: ConfigManager;
  private eventBus: EventBus;
  private storage: ConfigStorage;
  private middlewares: Array<(config: any, next: () => Promise<void>) => Promise<void>>;
  private readonly source = 'config-manager';
  private schemas: Map<string, any>;
  private encryption?: ConfigEncryption;
  private configs: Map<string, any>;

  private constructor() {
    this.middlewares = [];
    this.configs = new Map();
    this.eventBus = EventBus.getInstance();
    this.storage = new FileConfigStorage();
    this.middleware = createValidationMiddleware(null, null);
    this.schemas = new Map();
  }

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  public registerSchema(pluginName: string, schema: any): void {
    this.schemas.set(pluginName, schema);
  }

  public setEncryption(encryption: ConfigEncryption): void {
    this.encryption = encryption;
  }

  public async init(): Promise<void> {
    await this.eventBus.start();
    this.eventBus.registerChannel('config');
  }

  public addMiddleware(middleware: (config: any, next: () => Promise<void>) => Promise<void>): void {
    this.middlewares.push(middleware);
  }

  public async getConfig(pluginName: string): Promise<any> {
    return this.configs.get(pluginName);
  }

  public async setConfig(pluginName: string, config: any): Promise<void> {
    let currentConfig = config;
    
    // Chain middlewares
    const executeMiddleware = async (index: number): Promise<void> => {
      if (index >= this.middlewares.length) {
        // All middleware executed, save config
        this.configs.set(pluginName, currentConfig);
        await this.eventBus.emit({
          id: `config-changed-${Date.now()}`,
          type: 'CONFIG_CHANGED',
          channel: 'config',
          source: this.source,
          timestamp: Date.now(),
          data: {
            pluginName,
            config: currentConfig
          }
        });
        return;
      }

      await this.middlewares[index](currentConfig, () => executeMiddleware(index + 1));
    };

    await executeMiddleware(0);
  }

  public async loadConfig(pluginName: string): Promise<PluginConfig | null> {
    try {
      const config = await this.storage.load(pluginName);
      if (!config) {
        return null;
      }

      const validationResult = await this.middleware.validate(config);
      if (!validationResult.isValid) {
        await this.eventBus.emit({
          id: `config-validation-failed-${Date.now()}`,
          type: 'CONFIG_VALIDATION_FAILED',
          channel: 'config',
          source: this.source,
          timestamp: Date.now(),
          data: {
            pluginName,
            error: validationResult.errors[0]?.message || 'Unknown validation error'
          }
        });
        return null;
      }

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

  public async saveConfig(pluginName: string, config: PluginConfig): Promise<boolean> {
    try {
      const validationResult = await this.middleware.validate(config);
      if (!validationResult.isValid) {
        await this.eventBus.emit({
          id: `config-validation-failed-${Date.now()}`,
          type: 'config:validation-failed',
          channel: 'config',
          source: this.source,
          timestamp: Date.now(),
          data: {
            pluginName,
            error: validationResult.errors[0]?.message || 'Unknown validation error'
          }
        });
        return false;
      }

      await this.storage.save(pluginName, config);
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
