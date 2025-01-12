import type { ReactNode } from 'react';
import type { BaseConfig, BaseState } from '../../types/base';
import type { Plugin } from '../../types/plugin';

export type { Plugin };

export interface PluginConfiguration extends BaseConfig {
  metadata: {
    name: string;
    description?: string;
    version: string;
    author?: string;
    dependencies?: string[];
  };
  routes?: RouteConfig[];
  permissions?: PermissionConfig[];
}

export interface PluginStatus extends BaseState {
  isEnabled: boolean;
  isInitialized: boolean;
}

export interface PluginHealthCheck {
  status: 'healthy' | 'unhealthy';
  message?: string;
  timestamp: number;
}

export interface RouteConfig {
  path: string;
  component: React.ComponentType;
  exact?: boolean;
  layout?: string;
}

export interface PermissionConfig {
  name: string;
  description?: string;
  roles?: string[];
}

export interface PluginContext {
  config: PluginConfiguration;
  state: PluginStatus;
  children?: ReactNode;
}
