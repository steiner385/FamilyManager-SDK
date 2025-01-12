import React from 'react';
import { render, act } from '@testing-library/react';
import { PluginProvider, usePluginContext } from '../PluginProvider';
import { PluginManager } from '../../core/plugin/PluginManager';
import type { Plugin, PluginConfig, PluginState } from '../../types/plugin';
import { jest, describe, beforeEach, afterEach, it, expect } from '@jest/globals';
import '@testing-library/jest-dom';

// Create mock functions
const mockInstallPlugin = jest.fn();
const mockGetPlugin = jest.fn();
const mockIsPluginReady = jest.fn();

// Mock the PluginManager
jest.mock('../../core/plugin/PluginManager', () => ({
  PluginManager: {
    getInstance: () => ({
      installPlugin: mockInstallPlugin,
      getPlugin: mockGetPlugin,
      isInitialized: mockIsPluginReady
    })
  }
}));

// Mock ErrorBoundary
jest.mock('../common/ErrorBoundary', () => ({
  ErrorBoundary: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

describe('PluginProvider', () => {
  const mockPluginConfig: PluginConfig = {
    id: 'test-plugin',
    name: 'test-plugin',
    version: '1.0.0',
    metadata: {
      id: 'test-plugin',
      name: 'test-plugin',
      version: '1.0.0',
      author: 'Test Author',
      description: 'Test Plugin'
    }
  };

  const mockPluginState: PluginState = {
    isEnabled: true,
    status: 'started',
    isInitialized: true,
    error: null
  };

  const mockPlugin: Plugin = {
    id: 'test-plugin',
    name: 'test-plugin',
    version: '1.0.0',
    status: 'active',
    config: mockPluginConfig,
    state: mockPluginState
  };

  // Test component that uses the plugin context
  const TestComponent = () => {
    const context = usePluginContext();
    return (
      <div data-testid="test">
        <button 
          data-testid="install-button" 
          onClick={async () => {
            try {
              await context.installPlugin(mockPlugin);
            } catch (error) {
              console.error(error);
            }
          }}
        >
          Install
        </button>
        <button 
          data-testid="get-button" 
          onClick={() => context.getPlugin('test-plugin')}
        >
          Get
        </button>
        <button 
          data-testid="ready-button" 
          onClick={() => context.isPluginReady('test-plugin')}
        >
          Check Ready
        </button>
      </div>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockInstallPlugin.mockImplementation(() => Promise.resolve());
    mockGetPlugin.mockImplementation(() => mockPlugin);
    mockIsPluginReady.mockImplementation(() => true);
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should not render children until initialized', () => {
    const { container } = render(
      <PluginProvider>
        <TestComponent />
      </PluginProvider>
    );

    // Initially null due to !isInitialized
    expect(container.firstChild).toBeNull();

    // After initialization (useEffect runs)
    act(() => {
      jest.runAllTimers();
    });

    expect(container.firstChild).not.toBeNull();
  });

  it('provides plugin context to children', async () => {
    const { getByTestId } = render(
      <PluginProvider>
        <TestComponent />
      </PluginProvider>
    );

    // Wait for initialization
    await act(async () => {
      jest.runAllTimers();
    });

    expect(getByTestId('test')).toBeTruthy();
  });

  it('throws error when usePluginContext is used outside provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('usePluginContext must be used within PluginProvider');
    
    consoleError.mockRestore();
  });

  it('should handle plugin installation', async () => {
    const { getByTestId } = render(
      <PluginProvider>
        <TestComponent />
      </PluginProvider>
    );

    await act(async () => {
      jest.runAllTimers();
    });

    await act(async () => {
      getByTestId('install-button').click();
    });

    expect(mockInstallPlugin).toHaveBeenCalledWith(mockPlugin);
  });

  it('should handle plugin retrieval', async () => {
    const { getByTestId } = render(
      <PluginProvider>
        <TestComponent />
      </PluginProvider>
    );

    await act(async () => {
      jest.runAllTimers();
    });

    await act(async () => {
      getByTestId('get-button').click();
    });

    expect(mockGetPlugin).toHaveBeenCalledWith('test-plugin');
  });

  it('should check plugin ready state', async () => {
    const { getByTestId } = render(
      <PluginProvider>
        <TestComponent />
      </PluginProvider>
    );

    await act(async () => {
      jest.runAllTimers();
    });

    await act(async () => {
      getByTestId('ready-button').click();
    });

    expect(mockIsPluginReady).toHaveBeenCalledWith('test-plugin');
  });

  it('should handle plugin installation errors', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    const error = new Error('Installation failed');
    mockInstallPlugin.mockRejectedValueOnce(error);

    const { getByTestId } = render(
      <PluginProvider>
        <TestComponent />
      </PluginProvider>
    );

    // Wait for initialization
    await act(async () => {
      jest.runAllTimers();
    });

    // Click the button and wait for the error to be handled
    await act(async () => {
      getByTestId('install-button').click();
    });

    // Verify expectations
    expect(mockInstallPlugin).toHaveBeenCalledWith(mockPlugin);
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  }, 10000); // Increase timeout to 10 seconds

  it('should maintain stable context value', async () => {
    let contextValueA: any;
    let contextValueB: any;
    
    const ContextTracker = () => {
      const context = usePluginContext();
      React.useEffect(() => {
        if (!contextValueA) {
          contextValueA = context;
        } else {
          contextValueB = context;
        }
      });
      return null;
    };

    const { rerender } = render(
      <PluginProvider>
        <ContextTracker />
      </PluginProvider>
    );

    // Wait for first render and initialization
    await act(async () => {
      jest.runAllTimers();
    });

    // Force a re-render
    rerender(
      <PluginProvider>
        <ContextTracker />
      </PluginProvider>
    );

    // Wait for second render
    await act(async () => {
      jest.runAllTimers();
    });

    // Compare the actual function references
    expect(contextValueA.installPlugin).toBe(contextValueB.installPlugin);
    expect(contextValueA.getPlugin).toBe(contextValueB.getPlugin);
    expect(contextValueA.isPluginReady).toBe(contextValueB.isPluginReady);
  });

  it('should handle multiple plugins', async () => {
    const anotherPlugin: Plugin = {
      id: 'another-plugin',
      name: 'another-plugin',
      version: '1.0.0',
      status: 'active',
      config: {
        id: 'another-plugin',
        name: 'another-plugin',
        version: '1.0.0',
        metadata: {
          id: 'another-plugin',
          name: 'another-plugin',
          version: '1.0.0',
          author: 'Test Author',
          description: 'Another Test Plugin'
        }
      },
      state: {
        isEnabled: true,
        status: 'started',
        isInitialized: true,
        error: null
      }
    };

    const MultiPluginTest = () => {
      const { installPlugin, getPlugin } = usePluginContext();
      return (
        <div>
          <button 
            data-testid="install-both" 
            onClick={async () => {
              await installPlugin(mockPlugin);
              await installPlugin(anotherPlugin);
            }}
          >
            Install Both
          </button>
          <button 
            data-testid="get-both" 
            onClick={() => {
              getPlugin(mockPlugin.name);
              getPlugin(anotherPlugin.name);
            }}
          >
            Get Both
          </button>
        </div>
      );
    };

    const { getByTestId } = render(
      <PluginProvider>
        <MultiPluginTest />
      </PluginProvider>
    );

    // Wait for initialization
    await act(async () => {
      jest.runAllTimers();
    });

    // Now try to find and click the button
    const installButton = getByTestId('install-both');
    await act(async () => {
      installButton.click();
    });

    expect(mockInstallPlugin).toHaveBeenCalledWith(mockPlugin);
    expect(mockInstallPlugin).toHaveBeenCalledWith(anotherPlugin);

    const getButton = getByTestId('get-both');
    await act(async () => {
      getButton.click();
    });

    expect(mockGetPlugin).toHaveBeenCalledWith(mockPlugin.name);
    expect(mockGetPlugin).toHaveBeenCalledWith(anotherPlugin.name);
  });
});
