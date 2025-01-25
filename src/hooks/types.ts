import type { ReactNode } from 'react';
import type { Theme } from '../types/base';
import type { Message } from '../types/plugin';

// Accessibility hook types
export interface A11yConfig {
  role?: string;
  label?: string;
  description?: string;
  tabIndex?: number;
}

// State management hook types
export interface StateConfig {
  initialState?: any;
  persist?: boolean;
  scope?: 'local' | 'global';
}

// Error handling hook types
export interface ErrorConfig {
  fallback?: ReactNode;
  onError?: (error: Error) => void;
}

// Persistence hook types
export interface PersistenceConfig {
  key?: string;
  storage?: 'local' | 'session';
  serialize?: (value: any) => string;
  deserialize?: (value: string) => any;
}

// Theme hook types
export interface ThemeConfig {
  theme: Theme;
  onChange?: (theme: Theme) => void;
}

// Performance hook types
export interface PerformanceMetric {
  componentId: string;
  renderTime: number;
  timestamp: number;
}

// Plugin message hook types
export interface PluginMessageConfig {
  pluginId: string;
  callback: (message: Message) => void;
  filter?: (message: Message) => boolean;
}

// Route hook types
export interface RouteConfig {
  path: string;
  component: React.ComponentType;
  exact?: boolean;
}

// Component registry hook types
export interface ComponentMetadata {
  id: string;
  name: string;
  version: string;
  dependencies?: string[];
}

// Re-export message type
export type { Message };
