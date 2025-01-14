import { logger } from '../../utils/logger';
import { EventBus } from '../../events/EventBus';
export class ConfigManager {
    constructor() {
        this.middlewares = [];
        this.configs = new Map();
        this.schemas = new Map();
        this.eventBus = EventBus.getInstance();
        this.initializeEventBus();
    }
    async initializeEventBus() {
        await this.eventBus.start();
        this.eventBus.registerChannel('config');
    }
    addMiddleware(middleware) {
        this.middlewares.push(middleware);
    }
    setEncryption(encryption) {
        this.encryption = encryption;
    }
    static getInstance() {
        if (!ConfigManager.instance) {
            ConfigManager.instance = new ConfigManager();
        }
        return ConfigManager.instance;
    }
    registerSchema(pluginName, schema) {
        if (this.schemas.has(pluginName)) {
            throw new Error(`Configuration schema already registered for plugin: ${pluginName}`);
        }
        this.schemas.set(pluginName, schema);
        logger.debug(`Registered config schema for plugin: ${pluginName}`);
    }
    async setConfig(pluginName, config) {
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
            await this.eventBus.emit({
                id: `config-changed-${Date.now()}`,
                type: 'CONFIG_CHANGED',
                channel: 'config',
                timestamp: Date.now(),
                data: {
                    pluginName,
                    config: finalConfig
                }
            });
            logger.info(`Configuration set for plugin: ${pluginName}`, { config: finalConfig });
            return { isValid: true, errors: [] };
        }
        catch (error) {
            await this.eventBus.emit({
                id: `config-validation-failed-${Date.now()}`,
                type: 'CONFIG_VALIDATION_FAILED',
                channel: 'config',
                timestamp: Date.now(),
                data: {
                    pluginName,
                    error: error instanceof Error ? error.message : String(error)
                }
            });
            throw error;
        }
    }
    getConfig(pluginName) {
        const config = this.configs.get(pluginName);
        if (!config) {
            throw new Error(`No configuration found for plugin: ${pluginName}`);
        }
        return config;
    }
    validateConfig(config, schema) {
        const errors = [];
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
    mergeWithDefaults(config, schema) {
        const result = { ...config };
        for (const [key, def] of Object.entries(schema)) {
            if (!(key in result) && 'default' in def) {
                result[key] = def.default;
            }
        }
        return result;
    }
    clearConfig(pluginName) {
        this.configs.delete(pluginName);
        logger.debug(`Cleared configuration for plugin: ${pluginName}`);
    }
    clearAll() {
        this.configs.clear();
        this.schemas.clear();
        logger.debug('Cleared all plugin configurations');
    }
}
//# sourceMappingURL=ConfigManager.js.map