import { Plugin, PluginMetadata } from '../../plugin/types'

export function createMockPlugin(metadata: Partial<PluginMetadata>): Plugin {
  return {
    id: metadata.id || 'test-plugin',
    name: metadata.name || 'Test Plugin',
    version: metadata.version || '1.0.0',
    initialize: jest.fn().mockResolvedValue(undefined),
    start: jest.fn().mockResolvedValue(undefined),
    stop: jest.fn().mockResolvedValue(undefined)
  }
}
