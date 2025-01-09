import { render, RenderOptions } from '@testing-library/react'
import { ComponentProvider } from '../core/ComponentProvider'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { ToastProvider } from '@/contexts/ToastContext'

interface WrapperProps {
  children: React.ReactNode
  components?: Record<string, React.ComponentType>
}

function TestWrapper({ children, components = {} }: WrapperProps) {
  return (
    <ComponentProvider components={components}>
      <ThemeProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </ThemeProvider>
    </ComponentProvider>
  )
}

export function renderWithProviders(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & {
    components?: Record<string, React.ComponentType>
  }
) {
  const { components, ...renderOptions } = options || {}
  
  return render(ui, {
    wrapper: ({ children }) => (
      <TestWrapper components={components}>{children}</TestWrapper>
    ),
    ...renderOptions,
  })
}
