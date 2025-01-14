import React from 'react';
import type { Theme } from '../../types/base';
interface ThemeContextValue {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}
interface ThemeProviderProps {
    children: React.ReactNode;
    initialTheme?: Theme;
}
export declare function ThemeProvider({ children, initialTheme }: ThemeProviderProps): import("react/jsx-runtime").JSX.Element;
export declare function useTheme(): ThemeContextValue;
export {};
//# sourceMappingURL=ThemeProvider.d.ts.map