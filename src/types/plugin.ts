import type { BaseConfig, BaseState, BaseRouteConfig } from './base';
import type { PluginRoute, PluginContext } from '../core/plugin/types';

export interface Message {
  id: string;
  type: string;
  payload: any;
  timestamp: number;
}

export interface PluginMetadata {
  id: string;
  name: string;
  version: string;
  author: string;
  description: string;
  dependencies?: {
    required: Record<string, string>;
    optional?: Record<string, string>;
  };
  layouts?: PluginLayout[];
  preferences?: PluginPreference[];
}

export interface PluginConfig extends BaseConfig {
  metadata: PluginMetadata;
  routes?: BaseRouteConfig[];
  permissions?: string[];
  events?: {
    subscriptions: string[];
    publications: string[];
  };
  config?: any; // For Zod schema or other validation
}

export type PluginState = 'registered' | 'active' | 'error' | 'inactive';

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

export interface Plugin {
  id: string;
  name: string;
  version: string;
  status: 'active' | 'inactive' | 'error';
  config: PluginConfig;
  state: PluginState;
  permissions?: string[];
  defaultLayout?: string;
  routes?: PluginRoute[];
  initialize?: (context: PluginContext) => Promise<void>;
  onInit?: () => Promise<void>;
  onUnload?: () => Promise<void>;
  teardown?: () => Promise<void>;
  getHealth?: () => Promise<PluginHealthCheck>;
  getPluginMetrics?: (pluginName: string, timeRange?: string) => Promise<PluginMetrics>;
}
