import { type ComponentType } from 'react';
import { Logger } from '../logging/Logger';
import { EventBus } from '../events/EventBus';

export interface PluginConfig {
  name: string;
  version: string;
  description?: string;
  dependencies?: Record<string, string>;
  enabled?: boolean;
  settings?: Record<string, unknown>;
}

export interface PluginMetadata {
  id: string;
  name: string;
  version: string;
  description?: string;
  author?: string;
  homepage?: string;
  repository?: string;
  license?: string;
  dependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
  layouts?: PluginLayout[];
  preferences?: PluginPreference[];
}

export interface Plugin {
  id: string;
  name: string;
  version: string;
  description?: string;
  routes?: PluginRoute[];
  metadata: PluginMetadata;
  defaultLayout?: string;
  permissions?: string[];
  dependencies?: {
    required: Record<string, string>;
    optional?: Record<string, string>;
  };
  initialize?: (context: PluginContext) => Promise<void>;
  onInit?: () => Promise<void>;
  start?: () => Promise<void>;
  stop?: () => Promise<void>;
  onEnable?: () => Promise<void>;
  onDisable?: () => Promise<void>;
  teardown?: () => Promise<void>;
  getPluginMetrics?: (pluginName: string, timeRange?: string) => Promise<PluginMetrics>;
}

export interface PluginRoute {
  path: string;
  component: ComponentType;
  exact?: boolean;
  private?: boolean;
}

export interface PluginContext {
  id: string;
  name: string;
  version: string;
  config: PluginConfig;
  metadata: PluginMetadata;
  logger: Logger;
  events: EventBus;
}

export interface PluginMetrics {
  id: string;
  name: string;
  version: string;
  status: PluginStatus;
  uptime: number;
  memoryUsage: number;
  eventCount: number;
  errorCount: number;
  lastError?: string;
}

export interface PluginInstance {
  id: string;
  config: PluginConfig;
  metadata: PluginMetadata;
  enabled: boolean;
  status: PluginStatus;
}

export enum PluginStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ERROR = 'ERROR',
  DISABLED = 'DISABLED'
}

export interface PluginError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface PluginLayout {
  id: string;
  name: string;
  type: 'grid' | 'list' | 'table';
  columns?: number;
  spacing?: number;
}

export interface PluginPreference {
  id: string;
  key: string;
  label: string;
  type: 'boolean' | 'string' | 'number' | 'select';
  default?: unknown;
  defaultValue?: unknown;
  options?: Array<{ label: string; value: unknown }>;
}
