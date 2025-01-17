import { PluginDependencyConfig } from '../../plugin/types';
export function createMockPlugin(options) {
    const dependencies = options.dependencies
        ? new PluginDependencyConfig(options.dependencies.reduce((acc, dep) => ({
            ...acc,
            [dep]: '1.0.0'
        }), {}))
        : undefined;
    const config = {
        metadata: {
            id: `mock-${options.name}`,
            name: options.name,
            version: options.version,
            description: options.description || `Mock plugin for ${options.name}`,
            author: 'Test Author',
            dependencies
        }
    };
    const state = {
        isEnabled: true,
        status: 'active',
        isInitialized: false,
        error: null
    };
    const plugin = {
        id: `mock-${options.name}`,
        name: options.name,
        version: options.version,
        status: 'active',
        config,
        state,
        metadata: config.metadata,
        dependencies,
        async initialize() {
            return Promise.resolve();
        },
        async onInit() {
            // Register components if provided
            if (options.components) {
                const ComponentRegistry = (await import('../../registry/ComponentRegistry')).ComponentRegistry;
                const registry = ComponentRegistry.getInstance();
                Object.entries(options.components).forEach(([name, component]) => {
                    registry.register(name, component);
                });
            }
            // Apply theme if provided
            if (options.theme) {
                const ThemeManager = (await import('../../theme/ThemeManager')).ThemeManager;
                const themeManager = ThemeManager.getInstance();
                themeManager.extendTheme(options.theme);
            }
        },
        async getHealth() {
            return {
                status: 'healthy',
                message: 'Plugin is healthy',
                timestamp: Date.now(),
                metrics: {
                    memory: {
                        current: 50,
                        trend: 0,
                        history: []
                    },
                    cpu: {
                        current: 30,
                        trend: 0,
                        history: []
                    },
                    responseTime: {
                        current: 100,
                        trend: 0,
                        history: []
                    }
                }
            };
        },
        async onUnload() {
            return Promise.resolve();
        },
        async teardown() {
            return Promise.resolve();
        },
        getPluginMetrics: async (pluginName, timeRange) => ({
            memory: {
                current: 50,
                trend: 0,
                history: []
            },
            cpu: {
                current: 30,
                trend: 0,
                history: []
            },
            responseTime: {
                current: 100,
                trend: 0,
                history: []
            }
        })
    };
    return plugin;
}
//# sourceMappingURL=testHelpers.js.map