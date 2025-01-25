import fs from 'fs/promises';
import path from 'path';
import { ConfigStorage } from './types';
import { ConfigValue } from '../types';

export class FileConfigStorage implements ConfigStorage {
  private readonly configDir: string;

  constructor() {
    this.configDir = path.join(process.cwd(), 'config', 'plugins');
  }

  private getConfigPath(pluginName: string): string {
    return path.join(this.configDir, `${pluginName}.json`);
  }

  private async ensureConfigDir(): Promise<void> {
    try {
      await fs.access(this.configDir);
    } catch {
      await fs.mkdir(this.configDir, { recursive: true });
    }
  }

  async load(pluginName: string): Promise<ConfigValue | null> {
    try {
      const configPath = this.getConfigPath(pluginName);
      const content = await fs.readFile(configPath, 'utf-8');
      return JSON.parse(content) as ConfigValue;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return null;
      }
      throw error;
    }
  }

  async save(pluginName: string, config: ConfigValue): Promise<void> {
    await this.ensureConfigDir();
    const configPath = this.getConfigPath(pluginName);
    await fs.writeFile(configPath, JSON.stringify(config, null, 2));
  }

  async delete(pluginName: string): Promise<void> {
    try {
      const configPath = this.getConfigPath(pluginName);
      await fs.unlink(configPath);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error;
      }
    }
  }

  async exists(pluginName: string): Promise<boolean> {
    try {
      const configPath = this.getConfigPath(pluginName);
      await fs.access(configPath);
      return true;
    } catch {
      return false;
    }
  }
}
