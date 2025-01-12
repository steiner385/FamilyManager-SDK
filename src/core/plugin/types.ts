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
  routes?: PluginRoute[];
  initialize?: (context?: any) => Promise<void>;
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
}

export interface PluginConfig {
  [key: string]: any;
}

export interface PluginContext {
  config: PluginConfig;
  metadata: PluginMetadata;
  state: PluginState;
}
