import { Route } from '../routing/RouteRegistry';
import { ReactElement } from 'react';
import { Logger } from '../logging/Logger';

export type PluginState = 'registered' | 'active' | 'error' | 'inactive';

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
  status: 'active' | 'inactive' | 'error';
  config: PluginConfig;
  state: PluginState;
  permissions?: string[];
  defaultLayout?: string;
  routes?: PluginRoute[];
  initialize?: <T = any>(context?: PluginContext<T>) => Promise<void>;
  onInit?: () => Promise<void>;
  onUnload?: () => Promise<void>;
  teardown?: () => Promise<void>;
  getHealth?: () => Promise<PluginHealthCheck>;
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
