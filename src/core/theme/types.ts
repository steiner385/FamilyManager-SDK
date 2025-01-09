export interface ThemeConfig {
  colors: {
    primary: Record<string, string>
    secondary: Record<string, string>
    success: Record<string, string>
    error: Record<string, string>
    warning: Record<string, string>
  }
  typography: {
    fontFamily: string
    fontSize: Record<string, string>
    fontWeight: Record<string, number>
  }
  spacing: Record<string, string>
  borderRadius: Record<string, string>
  shadows: Record<string, string>
}
