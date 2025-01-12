import { ComponentType } from 'react';
import type { Plugin, PluginConfig, PluginState } from '../../../types/plugin';
import type { Theme } from '../../../types/base';

interface MockPluginOptions {
  name: string;
  version: string;
  description?: string;
  components?: Record<string, ComponentType>;
  theme?: Partial<Theme>;
  dependencies?: string[];
}

export function createMockPlugin(options: MockPluginOptions): Plugin {
  const config: PluginConfig = {
    id: `mock-${options.name}`,
    name: options.name,
    version: options.version,
    metadata: {
      id: `mock-${options.name}`,
      name: options.name,
      version: options.version,
      description: options.description || `Mock plugin for ${options.name}`,
      author: 'Test Author',
      dependencies: options.dependencies ? {
        required: options.dependencies.reduce((acc, dep) => ({
          ...acc,
          [dep]: '1.0.0'
        }), {})
      } : undefined
    }
  };

  const state: PluginState = {
    isEnabled: true,
    status: 'stopped',
    isInitialized: false,
    error: null
  };

  return {
    id: config.id,
    name: options.name,
    version: options.version,
    status: 'inactive',
    config,
    state,
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
    }
  };
}
