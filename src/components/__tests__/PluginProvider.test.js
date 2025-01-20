const { Fragment: _Fragment, jsx: _jsx, jsxs: _jsxs } = require("react/jsx-runtime");
const React = require('react');
const { render, act } = require('@testing-library/react');
const { PluginProvider, usePluginContext } = require('../PluginProvider');
const { describe, beforeEach, afterEach, it, expect } = require('@jest/globals');
require('@testing-library/jest-dom');
// Create mock functions
const mockRegisterPlugin = jest.fn().mockImplementation(async () => { });
const mockGetPlugin = jest.fn().mockImplementation(() => undefined);
const mockIsPluginReady = jest.fn().mockImplementation(() => false);
const mockPluginManager = {
    registerPlugin: mockRegisterPlugin,
    getPlugin: mockGetPlugin,
    isInitialized: mockIsPluginReady,
    plugins: new Map()
};
// Mock the PluginManager
jest.mock('../../core/plugin/PluginManager', () => ({
    PluginManager: {
        getInstance: () => mockPluginManager
    }
}));
// Mock ErrorBoundary
jest.mock('../common/ErrorBoundary', () => {
    return ({ children }) => _jsx(_Fragment, { children: children });
});
describe('PluginProvider', () => {
    const pluginStatus = 'active';
    const mockPluginConfig = {
        metadata: {
            id: 'test-plugin',
            name: 'test-plugin',
            version: '1.0.0',
            author: 'Test Author',
            description: 'Test Plugin'
        }
    };
    const mockPluginState = {
        isEnabled: true,
        status: pluginStatus,
        isInitialized: true,
        error: null
    };
    const mockPlugin = {
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
        return (_jsxs("div", { "data-testid": "test", children: [_jsx("button", { "data-testid": "install-button", onClick: async () => {
                        try {
                            await context.installPlugin(mockPlugin);
                        }
                        catch (error) {
                            console.error(error);
                        }
                    }, children: "Install" }), _jsx("button", { "data-testid": "get-button", onClick: () => context.getPlugin('test-plugin'), children: "Get" }), _jsx("button", { "data-testid": "ready-button", onClick: () => context.isPluginReady('test-plugin'), children: "Check Ready" })] }));
    };
    beforeEach(() => {
        jest.clearAllMocks();
        mockPluginManager.plugins.clear();
        mockRegisterPlugin.mockImplementation(async (plugin) => {
            mockPluginManager.plugins.set(plugin.id, plugin);
        });
        mockGetPlugin.mockImplementation((id) => mockPluginManager.plugins.get(id));
        mockIsPluginReady.mockImplementation(() => true);
        jest.useFakeTimers();
    });
    afterEach(() => {
        jest.useRealTimers();
    });
    it('should not render children until initialized', () => {
        const { container } = render(_jsx(PluginProvider, { children: _jsx(TestComponent, {}) }));
        // Initially null due to !isInitialized
        expect(container.firstChild).toBeNull();
        // After initialization (useEffect runs)
        act(() => {
            jest.runAllTimers();
        });
        expect(container.firstChild).not.toBeNull();
    });
    it('provides plugin context to children', async () => {
        const { getByTestId } = render(_jsx(PluginProvider, { children: _jsx(TestComponent, {}) }));
        // Wait for initialization
        await act(async () => {
            jest.runAllTimers();
        });
        expect(getByTestId('test')).toBeTruthy();
    });
    it('throws error when usePluginContext is used outside provider', () => {
        const consoleError = jest.spyOn(console, 'error').mockImplementation((...args) => { });
        expect(() => {
            render(_jsx(TestComponent, {}));
        }).toThrow('usePluginContext must be used within PluginProvider');
        consoleError.mockRestore();
    });
    it('should handle plugin installation', async () => {
        const { getByTestId } = render(_jsx(PluginProvider, { children: _jsx(TestComponent, {}) }));
        await act(async () => {
            jest.runAllTimers();
        });
        await act(async () => {
            getByTestId('install-button').click();
        });
        expect(mockRegisterPlugin).toHaveBeenCalledWith(mockPlugin);
    });
    it('should handle plugin retrieval', async () => {
        const { getByTestId } = render(_jsx(PluginProvider, { children: _jsx(TestComponent, {}) }));
        await act(async () => {
            jest.runAllTimers();
        });
        await act(async () => {
            getByTestId('get-button').click();
        });
        expect(mockGetPlugin).toHaveBeenCalledWith('test-plugin');
    });
    it('should check plugin ready state', async () => {
        const { getByTestId } = render(_jsx(PluginProvider, { children: _jsx(TestComponent, {}) }));
        await act(async () => {
            jest.runAllTimers();
        });
        await act(async () => {
            getByTestId('ready-button').click();
        });
        expect(mockIsPluginReady).toHaveBeenCalledWith('test-plugin');
    });
    it('should handle plugin installation errors', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation((...args) => { });
        mockRegisterPlugin.mockImplementation(async () => {
            throw new Error('Installation failed');
        });
        const { getByTestId } = render(_jsx(PluginProvider, { children: _jsx(TestComponent, {}) }));
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
        let contextValueA;
        let contextValueB;
        const ContextTracker = () => {
            const context = usePluginContext();
            React.useEffect(() => {
                if (!contextValueA) {
                    contextValueA = context;
                }
                else {
                    contextValueB = context;
                }
            });
            return null;
        };
        const { rerender } = render(_jsx(PluginProvider, { children: _jsx(ContextTracker, {}) }));
        // Wait for first render and initialization
        await act(async () => {
            jest.runAllTimers();
        });
        // Force a re-render
        rerender(_jsx(PluginProvider, { children: _jsx(ContextTracker, {}) }));
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
        const anotherPlugin = {
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
            return (_jsxs("div", { children: [_jsx("button", { "data-testid": "install-both", onClick: async () => {
                            await installPlugin(mockPlugin);
                            await installPlugin(anotherPlugin);
                        }, children: "Install Both" }), _jsx("button", { "data-testid": "get-both", onClick: () => {
                            getPlugin(mockPlugin.id);
                            getPlugin(anotherPlugin.id);
                        }, children: "Get Both" })] }));
        };
        const { getByTestId } = render(_jsx(PluginProvider, { children: _jsx(MultiPluginTest, {}) }));
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
        expect(mockGetPlugin).toHaveBeenCalledWith(mockPlugin.id);
        expect(mockGetPlugin).toHaveBeenCalledWith(anotherPlugin.id);
    });
});
//# sourceMappingURL=PluginProvider.test.js.map
