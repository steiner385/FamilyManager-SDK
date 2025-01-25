import { logger } from '../../utils/logger';

export interface PluginHealth {
  status: 'healthy' | 'degraded' | 'error';
  lastCheck: number;
  error?: string;
  metrics: {
    uptime: number;
    memoryUsage: number;
    eventCount: number;
  };
}

export class PluginHealthMonitor {
  private static instance: PluginHealthMonitor;
  private health: Map<string, PluginHealth> = new Map();
  
  private constructor() {
    // Private constructor for singleton
  }
  
  static getInstance(): PluginHealthMonitor {
    if (!this.instance) {
      this.instance = new PluginHealthMonitor();
    }
    return this.instance;
  }

  updateHealth(pluginName: string, status: Partial<PluginHealth>): void {
    const current = this.health.get(pluginName) || {
      status: 'healthy',
      lastCheck: Date.now(),
      metrics: { uptime: 0, memoryUsage: 0, eventCount: 0 }
    };
    
    this.health.set(pluginName, {
      ...current,
      ...status,
      lastCheck: Date.now()
    });

    logger.debug(`Updated health for plugin ${pluginName}`, status);
  }

  getHealth(pluginName: string): PluginHealth | undefined {
    return this.health.get(pluginName);
  }

  getAllHealth(): Map<string, PluginHealth> {
    return new Map(this.health);
  }

  clearHealth(pluginName: string): void {
    this.health.delete(pluginName);
  }
}
