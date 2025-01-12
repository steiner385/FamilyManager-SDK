import { PluginContext, PluginMetadata } from '../plugin/types';
import { BasePlugin } from '../plugin/base';
import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client';
import { pluginRegistry } from '../plugin/registry';

export function createMockPluginContext(): PluginContext {
  return {
    app: new Hono(),
    prisma: new PrismaClient(),
    config: {
      env: 'test'
    },
    plugins: {
      hasPlugin: (name: string) => pluginRegistry.hasPlugin(name),
      getPlugin: (name: string) => pluginRegistry.getPlugin(name),
      getPluginState: (name: string) => pluginRegistry.getPluginState(name)
    },
    logMetadata: {
      context: 'test'
    }
  };
}

export class MockPlugin extends BasePlugin {
  initializeCalled = false;
  teardownCalled = false;
  
  readonly metadata: PluginMetadata = {
    name: 'mock-plugin',
    version: '1.0.0',
    description: 'Mock plugin for testing'
  };

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

  readonly metadata: PluginMetadata = {
    name: 'dependent-mock-plugin',
    version: '1.0.0',
    description: 'Mock plugin with dependencies',
    dependencies: ['mock-plugin']
  };

  protected async onInitialize(): Promise<void> {
    this.initializeCalled = true;
  }

  protected async onTeardown(): Promise<void> {
    this.teardownCalled = true;
  }
}
