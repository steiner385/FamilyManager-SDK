import React from 'react';
import { render, act } from '@testing-library/react';
import { PluginProvider, usePluginContext } from '../PluginProvider';
import { PluginManager } from '../../core/plugin/PluginManager';
import type { Plugin, PluginConfig, PluginMetadata, PluginStatus } from '../../core/plugin/types';
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
  const metadata: PluginMetadata = {
    id: 'test-plugin',
    name: 'test-plugin',
    version: '1.0.0',
    author: 'Test Author',
    description: 'Test Plugin'
  };

  const config: PluginConfig = {
    name: 'test-plugin',
    version: '1.0.0',
    description: 'Test Plugin',
    enabled: true
  };

  const mockPlugin: Plugin = {
    id: 'test-plugin',
    name: 'test-plugin',
    version: '1.0.0',
    description: 'Test Plugin',
    metadata,
    routes: []
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

    expect(container.firstChild).toBeNull();

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
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    mockRegisterPlugin.mockImplementation(async () => {
      throw new Error('Installation failed');
    });

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
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  }, 10000);

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

    await act(async () => {
      jest.runAllTimers();
    });

    rerender(
      <PluginProvider>
        <ContextTracker />
      </PluginProvider>
    );

    await act(async () => {
      jest.runAllTimers();
    });

    expect(contextValueA.installPlugin).toBe(contextValueB.installPlugin);
    expect(contextValueA.getPlugin).toBe(contextValueB.getPlugin);
    expect(contextValueA.isPluginReady).toBe(contextValueB.isPluginReady);
  });

  it('should handle multiple plugins', async () => {
    const anotherPlugin: Plugin = {
      id: 'another-plugin',
      name: 'another-plugin',
      version: '1.0.0',
      description: 'Another Test Plugin',
      metadata: {
        id: 'another-plugin',
        name: 'another-plugin',
        version: '1.0.0',
        author: 'Test Author',
        description: 'Another Test Plugin'
      },
      routes: []
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

    await act(async () => {
      jest.runAllTimers();
    });

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
