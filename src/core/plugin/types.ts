import { Route } from '../routing/RouteRegistry';
import { ReactElement } from 'react';

export interface PluginRoute extends Route {
  component: ReactElement;
}

export interface Plugin {
  id: string;
  name: string;
  version: string;
  description?: string;
  author?: string;
  dependencies?: string[];
  optionalDependencies?: string[];
  routes?: PluginRoute[];
  status: PluginState;
  config: PluginConfig;
  state: any;
  initialize?: <T = any>(context?: PluginContext<T>) => Promise<void>;
  onInit?: () => Promise<void>;
  teardown?: () => Promise<void>;
}

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
  dependencies?: string[];
  optionalDependencies?: string[];
}

export interface PluginConfig {
  [key: string]: any;
}

export interface PluginContext<T = any> {
  config: PluginConfig;
  metadata: PluginMetadata;
  state: T;
  app?: any;
}
