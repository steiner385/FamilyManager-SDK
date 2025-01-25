import { Plugin, PluginMetadata, PluginConfig, PluginDependencies } from '../../plugin/types';
import { Theme } from '../../../types/base';
import { ComponentType } from 'react';

interface MockPluginOptions {
  id?: string;
  name?: string;
  version?: string;
  description?: string;
  author?: string;
  components?: Record<string, ComponentType>;
  theme?: Theme;
  dependencies?: Record<string, string>;
}

let mockPluginCounter = 0;

export function createMockPlugin(options: MockPluginOptions): Plugin {
  const pluginId = options.id || `test-plugin-${mockPluginCounter++}`;
  
  const metadata: PluginMetadata = {
    id: pluginId,
    name: options.name || 'Test Plugin',
    version: options.version || '1.0.0',
    author: options.author || 'Test Author',
    description: options.description || 'Test Description',
    dependencies: options.dependencies
  };

  const dependencies: PluginDependencies | undefined = options.dependencies ? {
    required: options.dependencies
  } : undefined;

  return {
    id: pluginId,
    name: metadata.name,
    version: metadata.version,
    description: metadata.description,
    metadata,
    components: options.components,
    theme: options.theme,
    dependencies,
    initialize: jest.fn().mockResolvedValue(undefined),
    start: jest.fn().mockResolvedValue(undefined),
    stop: jest.fn().mockResolvedValue(undefined),
    onInit: jest.fn().mockResolvedValue(undefined),
    onEnable: jest.fn().mockResolvedValue(undefined),
    onDisable: jest.fn().mockResolvedValue(undefined),
    teardown: jest.fn().mockResolvedValue(undefined)
  };
}
