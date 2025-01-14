import type { ReactNode } from 'react';
import type { Theme } from '../types/base';
import type { Message } from '../types/plugin';
export interface A11yConfig {
    role?: string;
    label?: string;
    description?: string;
    tabIndex?: number;
}
export interface StateConfig {
    initialState?: any;
    persist?: boolean;
    scope?: 'local' | 'global';
}
export interface ErrorConfig {
    fallback?: ReactNode;
    onError?: (error: Error) => void;
}
export interface PersistenceConfig {
    key?: string;
    storage?: 'local' | 'session';
    serialize?: (value: any) => string;
    deserialize?: (value: string) => any;
}
export interface ThemeConfig {
    theme: Theme;
    onChange?: (theme: Theme) => void;
}
export interface PerformanceMetric {
    componentId: string;
    renderTime: number;
    timestamp: number;
}
export interface PluginMessageConfig {
    pluginId: string;
    callback: (message: Message) => void;
    filter?: (message: Message) => boolean;
}
export interface RouteConfig {
    path: string;
    component: React.ComponentType;
    exact?: boolean;
}
export interface ComponentMetadata {
    id: string;
    name: string;
    version: string;
    dependencies?: string[];
}
export type { Message };
//# sourceMappingURL=types.d.ts.map