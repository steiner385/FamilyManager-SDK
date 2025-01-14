import { promises as fs } from 'fs';
import path from 'path';
import { ConfigStorage } from './types';
import { PluginConfig } from '../../types';
import { logger } from '../../../../utils/logger';

export class FileConfigStorage implements ConfigStorage {
  private configDir: string;

  constructor(configDir: string = 'config') {
    this.configDir = path.resolve(process.cwd(), configDir);
  }

  private async ensureConfigDir(): Promise<void> {
    try {
      await fs.mkdir(this.configDir, { recursive: true });
    } catch (error) {
      logger.error('Failed to create config directory:', error);
      throw error;
    }
  }

  private getConfigPath(pluginName: string): string {
    return path.join(this.configDir, `${pluginName}.json`);
  }

  async save(pluginName: string, config: PluginConfig): Promise<void> {
    try {
      await this.ensureConfigDir();
      const configPath = this.getConfigPath(pluginName);
      await fs.writeFile(configPath, JSON.stringify(config, null, 2));
      logger.debug(`Saved configuration for plugin ${pluginName}`);
    } catch (error) {
      logger.error(`Failed to save configuration for plugin ${pluginName}:`, error);
      throw error;
    }
  }

  async load(pluginName: string): Promise<PluginConfig | null> {
    try {
      const configPath = this.getConfigPath(pluginName);
      const data = await fs.readFile(configPath, 'utf8');
      const config = JSON.parse(data) as PluginConfig;
      return config;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return null;
      }
      logger.error(`Failed to load configuration for plugin ${pluginName}:`, error);
      throw error;
    }
  }

  async delete(pluginName: string): Promise<void> {
    try {
      const configPath = this.getConfigPath(pluginName);
      await fs.unlink(configPath);
      logger.debug(`Deleted configuration for plugin ${pluginName}`);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        logger.error(`Failed to delete configuration for plugin ${pluginName}:`, error);
        throw error;
      }
    }
  }

  async clear(): Promise<void> {
    try {
      await fs.rm(this.configDir, { recursive: true, force: true });
      await this.ensureConfigDir();
      logger.debug('Cleared all plugin configurations');
    } catch (error) {
      logger.error('Failed to clear configurations:', error);
      throw error;
    }
  }
}
