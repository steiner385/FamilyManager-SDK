import { createContext, useContext } from 'react'
import type { ThemeConfig } from './types'
import { defaultTheme } from './defaultTheme'

const ThemeContext = createContext<ThemeConfig>(defaultTheme)

export function SDKThemeProvider({ 
  theme = defaultTheme,
  children 
}: { 
  theme?: Partial<ThemeConfig>
  children: React.ReactNode 
}) {
  const mergedTheme = { ...defaultTheme, ...theme }
  return (
    <ThemeContext.Provider value={mergedTheme}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useSDKTheme() {
  return useContext(ThemeContext)
}
