import type { Theme } from '../../types/base';
export declare class ThemeManager {
    private static instance;
    private currentTheme;
    private constructor();
    static getInstance(): ThemeManager;
    getCurrentTheme(): Theme;
    setTheme(theme: Theme): void;
    extendTheme(extension: Partial<Theme>): void;
}
//# sourceMappingURL=ThemeManager.d.ts.map