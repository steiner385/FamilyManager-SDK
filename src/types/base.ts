import type { ReactNode } from 'react';

// Base configuration interface
export interface BaseConfig {
  id: string;
  name: string;
  version: string;
  description?: string;
  dependencies?: string[];
}

// Base state interface
export interface BaseState {
  isInitialized: boolean;
  isLoading?: boolean;
  error: Error | null;
}

// Base theme interface
export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    [key: string]: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      small: string;
      medium: string;
      large: string;
      [key: string]: string;
    };
  };
  spacing: {
    small: string;
    medium: string;
    large: string;
    [key: string]: string;
  };
}

// Base component props
export interface BaseProps {
  className?: string;
  children?: ReactNode;
  id?: string;
  'data-testid'?: string;
}

// Base route configuration
export interface BaseRouteConfig {
  path: string;
  component: React.ComponentType;
  exact?: boolean;
  layout?: string;
  auth?: boolean;
  roles?: string[];
}

// Base layout configuration
export interface BaseLayoutConfig {
  id: string;
  name: string;
  template: string[];
  areas: string[];
}

// Base error boundary props
export interface BaseErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}
