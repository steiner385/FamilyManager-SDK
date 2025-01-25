import React from 'react';
import { render, act } from '@testing-library/react';
import { PluginProvider, usePluginContext } from '../PluginProvider';
import { PluginManager } from '../../core/plugin/PluginManager';
import type { Plugin, PluginConfig, PluginState, PluginStatus } from '../../core/plugin/types';
import { jest, describe, beforeEach, afterEach, it, expect } from '@jest/globals';
import '@testing-library/jest-dom';

// Create mock functions
const mockRegisterPlugin = jest.fn().mockImplementation(async () => {});
const mockGetPlugin = jest.fn().mockImplementation(() => undefined);
const mockIsPluginReady = jest.fn().mockImplementation(() => false);

// Mock the PluginManager
jest.mock('../../core/plugin/PluginManager', () => ({
  PluginManager: {
    getInstance: () => ({
      registerPlugin: mockRegisterPlugin,
      getPlugin: mockGetPlugin,
      isInitialized: mockIsPluginReady
    })
  }
}));

// Mock ErrorBoundary
jest.mock('../common/ErrorBoundary', () => {
  return ({ children }: { children: React.ReactNode }) => <>{children}</>;
});

describe('PluginProvider', () => {
  const pluginStatus: PluginStatus = 'active';

  const mockPluginConfig: PluginConfig = {
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
    status: pluginStatus,
    isInitialized: true,
    error: null
  };

  const mockPlugin: Plugin = {
    id: 'test-plugin',
    name: 'test-plugin',
    version: '1.0.0',
    status: pluginStatus,
    config: mockPluginConfig,
    state: mockPluginState,
    metadata: mockPluginConfig.metadata
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
    mockRegisterPlugin.mockImplementation(async () => {});
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
    const consoleError = jest.spyOn(console, 'error').mockImplementation((...args: unknown[]) => {});
    
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

    expect(mockRegisterPlugin).toHaveBeenCalledWith(mockPlugin);
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
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation((...args: unknown[]) => {});
    
    mockRegisterPlugin.mockImplementation(async () => {
      throw new Error('Installation failed');
    });

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
    expect(mockRegisterPlugin).toHaveBeenCalledWith(mockPlugin);
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
      status: pluginStatus,
      config: {
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
        status: pluginStatus,
        isInitialized: true,
        error: null
      },
      metadata: {
        id: 'another-plugin',
        name: 'another-plugin',
        version: '1.0.0',
        author: 'Test Author',
        description: 'Another Test Plugin'
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

    expect(mockRegisterPlugin).toHaveBeenCalledWith(mockPlugin);
    expect(mockRegisterPlugin).toHaveBeenCalledWith(anotherPlugin);

    const getButton = getByTestId('get-both');
    await act(async () => {
      getButton.click();
    });

    expect(mockGetPlugin).toHaveBeenCalledWith(mockPlugin.name);
    expect(mockGetPlugin).toHaveBeenCalledWith(anotherPlugin.name);
  });
});
