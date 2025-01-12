import React from 'react'
import { render } from '@testing-library/react'
import { PluginProvider, usePluginContext } from '../PluginProvider'
import { PluginManager } from '../../core/plugin/PluginManager'
import '@testing-library/jest-dom'

jest.mock('../../core/plugin/PluginManager', () => ({
  PluginManager: {
    getInstance: jest.fn(() => ({
      installPlugin: jest.fn(),
      getPlugin: jest.fn(),
      isInitialized: jest.fn()
    }))
  }
}))

describe('PluginProvider', () => {
  const TestComponent = () => {
    const context = usePluginContext()
    return <div data-testid="test">{context ? 'context-available' : 'no-context'}</div>
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('provides plugin context to children', () => {
    const { getByTestId } = render(
      <PluginProvider>
        <TestComponent />
      </PluginProvider>
    )

    expect(getByTestId('test')).toHaveTextContent('context-available')
  })

  it('throws error when usePluginContext is used outside provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
    
    expect(() => {
      render(<TestComponent />)
    }).toThrow('usePluginContext must be used within PluginProvider')
    
    consoleError.mockRestore()
  })
})
