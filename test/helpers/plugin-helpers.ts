import { Plugin, PluginDependencies, PluginMetadata } from '../../src/core/plugin/types';
import { PluginStatus } from '../../src/core/plugin/types';

export interface TestPlugin extends Plugin {
  initializeCalled: boolean;
  teardownCalled: boolean;
}

export class MockPlugin implements TestPlugin {
  id = 'mock-plugin';
  name = 'Mock Plugin';
  version = '1.0.0';
  description = 'A mock plugin for testing';
  metadata: PluginMetadata = {
    id: 'mock-plugin',
    name: 'Mock Plugin',
    version: '1.0.0',
    author: 'Test Author',
    license: 'MIT'
  };
  dependencies: PluginDependencies = {
    required: {},
    optional: {}
  };
  initializeCalled = false;
  teardownCalled = false;

  async initialize(): Promise<void> {
    this.initializeCalled = true;
  }

  async teardown(): Promise<void> {
    this.teardownCalled = true;
  }
}

export class DependentMockPlugin implements TestPlugin {
  id = 'dependent-mock-plugin';
  name = 'Dependent Mock Plugin';
  version = '1.0.0';
  description = 'A dependent mock plugin for testing';
  metadata: PluginMetadata = {
    id: 'dependent-mock-plugin',
    name: 'Dependent Mock Plugin',
    version: '1.0.0',
    author: 'Test Author',
    license: 'MIT'
  };
  dependencies: PluginDependencies = {
    required: { 'mock-plugin': '1.0.0' },
    optional: {}
  };
  initializeCalled = false;
  teardownCalled = false;

  async initialize(): Promise<void> {
    this.initializeCalled = true;
  }

  async teardown(): Promise<void> {
    this.teardownCalled = true;
  }
}

export function isTestPlugin(plugin: Plugin): plugin is TestPlugin {
  return 'initializeCalled' in plugin && 'teardownCalled' in plugin;
}
