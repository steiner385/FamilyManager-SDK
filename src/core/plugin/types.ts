import { Route } from '../routing/RouteRegistry';
import { ReactElement } from 'react';
import { Logger } from '../logging/Logger';

export interface PluginState {
  isInstalled: boolean;
  isActive: boolean;
  error?: Error;
}

export interface PluginMetadata {
  id: string;
  name: string;
  version: string;
  description?: string;
  author?: string;
  dependencies?: {
    required: Record<string, string>;
    optional?: Record<string, string>;
  };
  layouts?: PluginLayout[];
  preferences?: PluginPreference[];
}

export interface Plugin {
  id: string;
  name: string;
  version: string;
  description?: string;
  author?: string;
  status: PluginState;
  config: PluginConfig;
  state: any;
  routes?: PluginRoute[];
  permissions?: string[];
  initialize?: <T = any>(context?: PluginContext<T>) => Promise<void>;
  onInit?: () => Promise<void>;
  teardown?: () => Promise<void>;
}

export interface PluginRoute extends Route {
  component: ReactElement;
}

export interface PluginConfig {
  metadata: PluginMetadata;
  [key: string]: any;
}

export interface PluginContext<T = any> {
  config: PluginConfig;
  metadata: PluginMetadata;
  state: T;
  logger: Logger;
  app?: any;
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
