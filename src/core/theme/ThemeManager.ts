interface Theme {
  colors: {
    [key: string]: string
  }
  typography?: {
    [key: string]: string | number
  }
  [key: string]: any
}

export class ThemeManager {
  private static instance: ThemeManager
  private currentTheme: Theme = {
    colors: {},
    typography: {}
  }

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
