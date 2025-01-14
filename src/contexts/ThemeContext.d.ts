import React from 'react';
type Theme = 'light' | 'dark';
export interface ThemeContextType {
    theme: Theme;
    isDark: boolean;
    colors: Record<string, string>;
    typography: Typography;
    spacing: Record<string, string>;
    toggleTheme: () => void;
    updateTheme: (newTheme: Theme) => Promise<void>;
    updateThemeColors: (colors: Record<string, string>) => void;
    updateTypography: (typography: Partial<Typography>) => void;
    updateSpacing: (spacing: Record<string, string>) => void;
    saveThemePreset: (preset: ThemePreset) => void;
    loadThemePreset: (preset: ThemePreset) => void;
    fonts: string[];
    presets: ThemePreset[];
}
interface Typography {
    fonts: Record<string, string>;
    sizes: Record<string, string>;
    scaleRatio?: string;
}
interface ThemePreset {
    name: string;
    colors: Record<string, string>;
    typography: Typography;
}
interface ThemeProviderProps {
    children: React.ReactNode;
}
export declare function ThemeProvider({ children }: ThemeProviderProps): import("react/jsx-runtime").JSX.Element;
export declare function useTheme(): ThemeContextType;
export {};
//# sourceMappingURL=ThemeContext.d.ts.map