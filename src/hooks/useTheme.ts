import { useState, useEffect } from 'react';
import { ThemeManager } from '../core/theme/ThemeManager';
import type { Theme } from '../types/base';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => 
    ThemeManager.getInstance().getCurrentTheme()
  );

  const updateTheme = (newTheme: Theme) => {
    ThemeManager.getInstance().setTheme(newTheme);
    setTheme(ThemeManager.getInstance().getCurrentTheme());
  };

  return { theme, setTheme: updateTheme };
}
