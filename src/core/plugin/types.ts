import { Route } from '../routing/RouteRegistry';
import { ComponentType } from 'react';
import { Logger } from '../logging/Logger';
import { BaseEvent, EventDeliveryStatus, EventBus } from '../events/types';

export interface PluginMetrics {
  memory: {
    current: number;
    trend: number;
    history: Array<{ timestamp: number; value: number }>;
  };
  cpu: {
    current: number;
    trend: number;
    history: Array<{ timestamp: number; value: number }>;
  };
  responseTime: {
    current: number;
    trend: number;
    history: Array<{ timestamp: number; value: number }>;
  };
}

export interface PluginHealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy';
  message: string;
  timestamp: number;
  metrics?: PluginMetrics;
}

export type PluginStatus = 'active' | 'inactive' | 'error' | 'registered' | 'started';

export interface PluginState {
  isEnabled: boolean;
  status: PluginStatus;
  isInitialized: boolean;
  error: Error | null;
}

export interface PluginMetadata {
  id: string;
  name: string;
  version: string;
  description?: string;
  author?: string;
  dependencies?: PluginDependencyConfig;
  optionalDependencies?: Record<string, string>;
  layouts?: PluginLayout[];
  preferences?: PluginPreference[];
}

export class PluginDependencyConfig {
  private deps: Map<string, string>;

  constructor(required: Record<string, string>, optional?: Record<string, string>) {
    this.deps = new Map(Object.entries(required));
    if (optional) {
      Object.entries(optional).forEach(([key, value]) => this.deps.set(key, value));
    }
  }

  get required(): Record<string, string> {
    return Object.fromEntries([...this.deps.entries()]);
  }

  get optional(): Record<string, string> | undefined {
    return undefined;
  }

  includes(key: string): boolean {
    return this.deps.has(key);
  }

  [Symbol.iterator](): Iterator<[string, string]> {
    return this.deps.entries();
  }
}

export interface Plugin {
  id: string;
  name: string;
  version: string;
  status: PluginStatus;
  config: PluginConfig;
  state: PluginState;
  metadata: PluginMetadata;
  permissions?: string[];
  defaultLayout?: string;
  routes?: PluginRoute[];
  dependencies?: PluginDependencyConfig;
  initialize?: <T = any>(context?: PluginContext<T>) => Promise<void>;
  onInit?: () => Promise<void>;
  onUnload?: () => Promise<void>;
  teardown?: () => Promise<void>;
  getHealth?: () => Promise<PluginHealthCheck>;
  getPluginMetrics?: (pluginName: string, timeRange?: string) => Promise<PluginMetrics>;
}

export interface PluginRoute extends Route {
  component: ComponentType<any>;
}

export interface PluginConfig {
  metadata: PluginMetadata;
  [key: string]: any;
}

export interface PluginRegistry {
  hasPlugin: (id: string) => boolean;
  [key: string]: any;
}

export interface PluginContext<T = any> {
  config: PluginConfig;
  metadata: PluginMetadata;
  state: T;
  logger: Logger;
  app?: any;
  plugins?: PluginRegistry;
  eventBus?: Pick<EventBus, 'publish' | 'emit' | 'subscribe'>;
}

export interface PluginLayout {
  id: string;
  name: string;
  template: string[];
}

export interface PluginPreference {
  key: string;
  type: 'boolean' | 'string' | 'number';
  label: string;
  defaultValue: any;
}
