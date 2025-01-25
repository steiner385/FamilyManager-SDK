import { type ComponentType } from 'react';
import { Logger } from '../logging/Logger';
import { EventBus } from '../events/EventBus';
import { Calendar, Event } from '../../contexts/CalendarContext';

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
  type?: 'calendar' | 'default';  // Added to identify plugin types
}

export interface PluginDependencies {
  required?: Record<string, string>;
  optional?: Record<string, string>;
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
  components?: Record<string, ComponentType>;
  dependencies?: PluginDependencies;
  theme?: unknown;
  initialize?: (context: PluginContext) => Promise<void>;
  onInit?: () => Promise<void>;
  start?: () => Promise<void>;
  stop?: () => Promise<void>;
  onEnable?: () => Promise<void>;
  onDisable?: () => Promise<void>;
  teardown?: () => Promise<void>;
  getPluginMetrics?: (pluginName: string, timeRange?: string) => Promise<PluginMetrics>;
}

// Calendar-specific plugin interface
export interface CalendarPlugin extends Plugin {
  getCalendars: () => Promise<Calendar[]>;
  getEvents: () => Promise<Event[]>;
  saveEvent: (event: Event) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
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
  plugins: {
    hasPlugin: (id: string) => boolean;
    getPlugin: (id: string) => Plugin | undefined;
    getPluginState: (id: string) => PluginStatus | undefined;
  };
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
