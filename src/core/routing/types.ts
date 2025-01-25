import type { ReactNode } from 'react';
import type { BaseConfig } from '../../types/base';

export interface RouteConfig extends BaseConfig {
  path: string;
  component: React.ComponentType;
  exact?: boolean;
  layout?: string;
  auth?: boolean;
  roles?: string[];
  meta?: {
    title?: string;
    description?: string;
    [key: string]: any;
  };
}

export interface RouteProps {
  path: string;
  exact?: boolean;
  component: React.ComponentType;
  layout?: string;
  children?: ReactNode;
}

export interface RouterState {
  currentRoute: string | null;
  previousRoute: string | null;
  params: Record<string, string>;
  query: URLSearchParams;
}

export interface RouterContext {
  routes: Map<string, RouteConfig>;
  currentRoute: string | null;
  navigate: (path: string, options?: NavigateOptions) => void;
  registerRoute: (route: RouteConfig) => void;
  unregisterRoute: (path: string) => void;
}

export interface NavigateOptions {
  replace?: boolean;
  state?: any;
  query?: Record<string, string>;
}

export interface RouteMatch {
  path: string;
  url: string;
  isExact: boolean;
  params: Record<string, string>;
}
