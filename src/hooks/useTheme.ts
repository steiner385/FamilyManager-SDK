import { useState, useEffect } from 'react'
import { ThemeManager } from '../core/theme/ThemeManager'

export function useTheme() {
  const [theme, setTheme] = useState(() => 
    ThemeManager.getInstance().getCurrentTheme()
  )

  const updateTheme = (themeName: string) => {
    ThemeManager.getInstance().setTheme(themeName)
    setTheme(ThemeManager.getInstance().getCurrentTheme())
  }

  return { theme, setTheme: updateTheme }
}
