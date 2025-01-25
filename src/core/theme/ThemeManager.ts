import type { Theme } from '../../types/base';

export class ThemeManager {
  private static instance: ThemeManager;
  private currentTheme: Theme = {
    colors: {
      primary: '#000000',
      secondary: '#666666',
      background: '#ffffff',
      text: '#000000'
    },
    typography: {
      fontFamily: 'system-ui, sans-serif',
      fontSize: {
        small: '0.875rem',
        medium: '1rem',
        large: '1.25rem'
      }
    },
    spacing: {
      small: '0.5rem',
      medium: '1rem',
      large: '2rem'
    }
  };

  private constructor() {}

  static getInstance(): ThemeManager {
    if (!ThemeManager.instance) {
      ThemeManager.instance = new ThemeManager()
    }
    return ThemeManager.instance
  }

  getCurrentTheme(): Theme {
    return { ...this.currentTheme }
  }

  setTheme(theme: Theme): void {
    if (!theme || typeof theme !== 'object' || !theme.colors) {
      throw new Error('Invalid theme: Theme must be an object with a colors property')
    }
    this.currentTheme = { ...theme }
  }

  extendTheme(extension: Partial<Theme>): void {
    this.currentTheme = {
      ...this.currentTheme,
      ...extension,
      colors: {
        ...this.currentTheme.colors,
        ...(extension.colors || {})
      },
      typography: {
        ...this.currentTheme.typography,
        ...(extension.typography || {})
      }
    }
  }
}
