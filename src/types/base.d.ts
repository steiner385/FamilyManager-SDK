import type { ReactNode } from 'react';
export interface BaseConfig {
    id: string;
    name: string;
    version: string;
    description?: string;
    dependencies?: string[];
}
export interface BaseState {
    isInitialized: boolean;
    isLoading?: boolean;
    error: Error | null;
}
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
export interface BaseProps {
    className?: string;
    children?: ReactNode;
    id?: string;
    'data-testid'?: string;
}
export interface BaseRouteConfig {
    path: string;
    component: React.ComponentType;
    exact?: boolean;
    layout?: string;
    auth?: boolean;
    roles?: string[];
}
export interface BaseLayoutConfig {
    id: string;
    name: string;
    template: string[];
    areas: string[];
}
export interface BaseErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}
//# sourceMappingURL=base.d.ts.map