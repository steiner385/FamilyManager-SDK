import React, { createContext, useContext, useState, useEffect } from 'react';

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

const defaultTypography: Typography = {
  fonts: {
    body: 'system-ui, sans-serif',
    heading: 'system-ui, sans-serif',
  },
  sizes: {
    base: '16px',
    h1: '2.5rem',
    h2: '2rem',
    h3: '1.75rem',
    h4: '1.5rem',
  },
  scaleRatio: '1.2',
};

const defaultPreset: ThemePreset = {
  name: 'Default',
  colors: {
    primary: '#007bff',
    secondary: '#6c757d',
    success: '#28a745',
    error: '#dc3545',
    warning: '#ffc107',
    info: '#17a2b8',
    background: '#ffffff',
    text: '#212529',
  },
  typography: defaultTypography,
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const savedTheme = localStorage.getItem('theme');
      return (savedTheme === 'dark' || savedTheme === 'light') ? savedTheme : 'light';
    } catch {
      return 'light';
    }
  });
  const [colors, setColors] = useState<Record<string, string>>(defaultPreset.colors);
  const [typography, setTypography] = useState<Typography>(defaultPreset.typography);
  const [spacing, setSpacing] = useState<Record<string, string>>({});
  const [presets, setPresets] = useState<ThemePreset[]>([defaultPreset]);
  const [fonts] = useState<string[]>(['system-ui', 'Arial', 'Helvetica', 'sans-serif']);

  const isDark = theme === 'dark';

  // Initialize theme class on mount
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    updateTheme(newTheme);
  };

  const updateTheme = async (newTheme: Theme) => {
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    // Here you would typically persist the theme preference
    try {
      await localStorage.setItem('theme', newTheme);
    } catch (error) {
      console.error('Failed to persist theme preference:', error);
    }
  };

  const updateThemeColors = (newColors: Record<string, string>) => {
    setColors(prevColors => ({ ...prevColors, ...newColors }));
    // Apply colors to CSS variables
    Object.entries(newColors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--color-${key}`, value);
    });
  };

  const updateTypography = (newTypography: Partial<Typography>) => {
    setTypography(prevTypography => ({ ...prevTypography, ...newTypography }));
    // Apply typography to CSS variables
    if (newTypography.fonts) {
      Object.entries(newTypography.fonts).forEach(([key, value]) => {
        document.documentElement.style.setProperty(`--font-${key}`, value);
      });
    }
    if (newTypography.sizes) {
      Object.entries(newTypography.sizes).forEach(([key, value]) => {
        document.documentElement.style.setProperty(`--font-size-${key}`, value);
      });
    }
  };

  const updateSpacing = (newSpacing: Record<string, string>) => {
    setSpacing(prevSpacing => ({ ...prevSpacing, ...newSpacing }));
    // Apply spacing to CSS variables
    Object.entries(newSpacing).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--spacing-${key}`, value);
    });
  };

  const saveThemePreset = (preset: ThemePreset) => {
    setPresets(prevPresets => {
      const index = prevPresets.findIndex(p => p.name === preset.name);
      if (index >= 0) {
        const newPresets = [...prevPresets];
        newPresets[index] = preset;
        return newPresets;
      }
      return [...prevPresets, preset];
    });
  };

  const loadThemePreset = (preset: ThemePreset) => {
    updateThemeColors(preset.colors);
    updateTypography(preset.typography);
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      isDark,
      colors,
      typography,
      spacing,
      toggleTheme,
      updateTheme,
      updateThemeColors,
      updateTypography,
      updateSpacing,
      saveThemePreset,
      loadThemePreset,
      fonts,
      presets,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
