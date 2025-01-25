import type {
  BaseConfig,
  BaseState,
  BaseRouteConfig,
  BaseLayoutConfig,
  BaseErrorBoundaryProps,
  Theme
} from '../types/base';
import type {
  Plugin,
  PluginConfig,
  PluginState,
  PluginMetadata,
  PluginHealthCheck,
  PluginLayout,
  PluginPreference
} from '../types/plugin';

// Re-export plugin types
export type {
  Plugin,
  PluginConfig,
  PluginState,
  PluginMetadata,
  PluginHealthCheck,
  PluginLayout,
  PluginPreference
};

// Core application types
export interface AppConfig extends BaseConfig {
  name: string;
  version: string;
  environment: 'development' | 'production' | 'test';
  debug?: boolean;
}

export interface AppState extends BaseState {
  theme: Theme;
}

// Core service types
export interface ServiceConfig extends BaseConfig {}

export interface ServiceState extends BaseState {
  isRunning: boolean;
}

// Core event types
export interface EventConfig {
  type: string;
  source: string;
  target?: string;
  priority?: number;
}

export interface EventData<T = unknown> {
  type: string;
  payload: T;
  timestamp: number;
  source: string;
  target?: string;
}

// Core plugin system types
export interface PluginSystemConfig extends BaseConfig {
  plugins: PluginConfig[];
  autoStart?: boolean;
  strictMode?: boolean;
}

export interface PluginSystemState extends BaseState {
  plugins: Map<string, PluginState>;
}

// Core routing types
export interface RouteConfig extends BaseRouteConfig {}

export interface RouterConfig {
  routes: BaseRouteConfig[];
  defaultRoute: string;
  notFoundRoute: string;
}

// Core UI types
export interface LayoutConfig extends BaseLayoutConfig {}

export interface UIConfig {
  layouts: BaseLayoutConfig[];
  defaultLayout: string;
  theme: Theme;
}

// Core error handling types
export interface CoreErrorBoundaryProps extends BaseErrorBoundaryProps {}

export interface ErrorHandlerConfig extends BaseConfig {
  captureUnhandledErrors?: boolean;
  logErrors?: boolean;
  errorBoundary?: React.ComponentType<CoreErrorBoundaryProps>;
}
