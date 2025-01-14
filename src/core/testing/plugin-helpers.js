import { BasePlugin } from '../plugin/base';
import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client';
import { pluginRegistry } from '../plugin/registry';
export function createMockPluginContext() {
    return {
        app: new Hono(),
        prisma: new PrismaClient(),
        config: {
            env: 'test'
        },
        plugins: {
            hasPlugin: (name) => pluginRegistry.hasPlugin(name),
            getPlugin: (name) => pluginRegistry.getPlugin(name),
            getPluginState: (name) => pluginRegistry.getPluginState(name)
        },
        logMetadata: {
            context: 'test'
        }
    };
}
export class MockPlugin extends BasePlugin {
    constructor() {
        super(...arguments);
        this.initializeCalled = false;
        this.teardownCalled = false;
        this.metadata = {
            name: 'mock-plugin',
            version: '1.0.0',
            description: 'Mock plugin for testing'
        };
    }
    async onInitialize() {
        this.initializeCalled = true;
    }
    async onTeardown() {
        this.teardownCalled = true;
    }
}
export class DependentMockPlugin extends BasePlugin {
    constructor() {
        super(...arguments);
        this.initializeCalled = false;
        this.teardownCalled = false;
        this.metadata = {
            name: 'dependent-mock-plugin',
            version: '1.0.0',
            description: 'Mock plugin with dependencies',
            dependencies: ['mock-plugin']
        };
    }
    async onInitialize() {
        this.initializeCalled = true;
    }
    async onTeardown() {
        this.teardownCalled = true;
    }
}
//# sourceMappingURL=plugin-helpers.js.map