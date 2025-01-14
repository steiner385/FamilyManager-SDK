import { promises as fs } from 'fs';
import path from 'path';
import { logger } from '../../../../utils/logger';
export class FileConfigStorage {
    constructor(configDir = 'config') {
        this.configDir = path.resolve(process.cwd(), configDir);
    }
    async ensureConfigDir() {
        try {
            await fs.mkdir(this.configDir, { recursive: true });
        }
        catch (error) {
            logger.error('Failed to create config directory:', error);
            throw error;
        }
    }
    getConfigPath(pluginName) {
        return path.join(this.configDir, `${pluginName}.json`);
    }
    async save(pluginName, config) {
        try {
            await this.ensureConfigDir();
            const configPath = this.getConfigPath(pluginName);
            await fs.writeFile(configPath, JSON.stringify(config, null, 2));
            logger.debug(`Saved configuration for plugin ${pluginName}`);
        }
        catch (error) {
            logger.error(`Failed to save configuration for plugin ${pluginName}:`, error);
            throw error;
        }
    }
    async load(pluginName) {
        try {
            const configPath = this.getConfigPath(pluginName);
            const data = await fs.readFile(configPath, 'utf8');
            const config = JSON.parse(data);
            return config;
        }
        catch (error) {
            if (error.code === 'ENOENT') {
                return null;
            }
            logger.error(`Failed to load configuration for plugin ${pluginName}:`, error);
            throw error;
        }
    }
    async delete(pluginName) {
        try {
            const configPath = this.getConfigPath(pluginName);
            await fs.unlink(configPath);
            logger.debug(`Deleted configuration for plugin ${pluginName}`);
        }
        catch (error) {
            if (error.code !== 'ENOENT') {
                logger.error(`Failed to delete configuration for plugin ${pluginName}:`, error);
                throw error;
            }
        }
    }
    async clear() {
        try {
            await fs.rm(this.configDir, { recursive: true, force: true });
            await this.ensureConfigDir();
            logger.debug('Cleared all plugin configurations');
        }
        catch (error) {
            logger.error('Failed to clear configurations:', error);
            throw error;
        }
    }
}
//# sourceMappingURL=FileConfigStorage.js.map