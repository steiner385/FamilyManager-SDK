import { PluginContext, PluginMetadata, PluginConfig, Plugin, PluginStatus } from '../core/plugin/types';
import { BasePlugin } from '../core/plugin/base';
import { Logger } from '../core/logging/Logger';
import { EventBus } from '../core/events/EventBus';
import { pluginRegistry } from '../core/plugin/registry';

export function createMockPluginContext(): PluginContext {
  const mockConfig: PluginConfig = {
    name: 'test-plugin',
    version: '1.0.0',
    description: 'Test plugin',
    settings: {
      env: 'test'
    }
  };

  const mockMetadata: PluginMetadata = {
    id: 'test-plugin',
    name: 'Test Plugin',
    version: '1.0.0',
    description: 'Test plugin'
  };

  return {
    id: 'test-plugin',
    name: 'Test Plugin',
    version: '1.0.0',
    config: mockConfig,
    metadata: mockMetadata,
    logger: Logger.getInstance(),
    events: EventBus.getInstance(),
    plugins: {
      hasPlugin: (id: string) => pluginRegistry.getPlugin(id) !== undefined,
      getPlugin: (id: string) => pluginRegistry.getPlugin(id),
      getPluginState: (id: string) => pluginRegistry.getPluginState(id)
    }
  };
}

export class MockPlugin extends BasePlugin {
  initializeCalled = false;
  teardownCalled = false;
  
  constructor() {
    const metadata: PluginMetadata = {
      id: 'mock-plugin',
      name: 'mock-plugin',
      version: '1.0.0',
      description: 'Mock plugin for testing'
    };
    super('mock-plugin', 'mock-plugin', '1.0.0', 'Mock plugin for testing', metadata);
  }

  protected async onInitialize(): Promise<void> {
    this.initializeCalled = true;
  }

  protected async onTeardown(): Promise<void> {
    this.teardownCalled = true;
  }
}

export class DependentMockPlugin extends BasePlugin {
  initializeCalled = false;
  teardownCalled = false;

  constructor() {
    const metadata: PluginMetadata = {
      id: 'dependent-mock-plugin',
      name: 'dependent-mock-plugin',
      version: '1.0.0',
      description: 'Mock plugin with dependencies',
      dependencies: {
        'mock-plugin': '1.0.0'
      }
    };
    super('dependent-mock-plugin', 'dependent-mock-plugin', '1.0.0', 'Mock plugin with dependencies', metadata);
  }

  protected async onInitialize(): Promise<void> {
    this.initializeCalled = true;
  }

  protected async onTeardown(): Promise<void> {
    this.teardownCalled = true;
  }
}