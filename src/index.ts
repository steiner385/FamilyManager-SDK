// Export types
export * from './types/base';
export * from './types/layout';
export type { 
  Message,
  PluginMetadata,
  PluginConfig,
  PluginState,
  PluginHealthCheck,
  PluginLayout,
  PluginPreference,
  PluginMetrics 
} from './types/plugin';

// Export core functionality
export * from './core/BasePlugin';
export { EventBus, eventBus } from './core/events/EventBus';
export type { RouteConfig, RouteProps, RouterState, RouterContext, NavigateOptions, RouteMatch } from './core/routing/types';
export * from './core/plugin/PluginManager';
export * from './core/plugin/PluginMessageBus';
export * from './core/layout/LayoutManager';
export * from './core/routing/PluginRouter';
export * from './core/routing/PluginRouteManager';
export * from './core/registry/ComponentRegistry';
export * from './core/ui/UIComponentRegistry';

// Export components
export * from './components/DynamicComponent';
export * from './components/PluginCard';
export * from './components/PluginContainer';
export * from './components/PluginSettings';
export * from './components/PluginProvider';
export * from './components/common';

// Export hooks
export * from './hooks/useUIComponent';
export * from './hooks/usePlugin';
export * from './hooks/usePluginPermissions';
export * from './hooks/usePluginMessages';
export * from './hooks/usePluginNavigation';
export * from './hooks/usePluginRoutes';
export * from './hooks/useRegistry';
export * from './hooks/useLayout';
export * from './hooks/useTheme';
export * from './hooks/useForm';
export * from './hooks/useComponentState';
export * from './hooks/useErrorBoundary';
export * from './hooks/useAccessibility';
export * from './hooks/usePerformance';
export * from './hooks/usePersistentState';
