import { describe, beforeEach, it, expect } from '@jest/globals';
import { pluginRegistry } from '../../../core/plugin/registry';
import { MockPlugin } from '../../plugin-helpers';
describe('PluginRegistry', () => {
    let mockPlugin;
    beforeEach(() => {
        mockPlugin = new MockPlugin();
        pluginRegistry.clear();
    });
    it('should register a plugin', () => {
        pluginRegistry.register(mockPlugin);
        expect(pluginRegistry.get('mock-plugin')).toBe(mockPlugin);
    });
    it('should prevent duplicate registration', () => {
        pluginRegistry.register(mockPlugin);
        expect(() => pluginRegistry.register(mockPlugin))
            .toThrow('Plugin mock-plugin is already registered');
    });
    it('should unregister a plugin', () => {
        pluginRegistry.register(mockPlugin);
        pluginRegistry.unregister('mock-plugin');
        expect(pluginRegistry.get('mock-plugin')).toBeUndefined();
    });
    it('should list all plugins', () => {
        pluginRegistry.register(mockPlugin);
        const plugins = pluginRegistry.getAll();
        expect(plugins).toHaveLength(1);
        expect(plugins[0]).toBe(mockPlugin);
    });
    it('should check plugin existence', () => {
        expect(pluginRegistry.hasPlugin('mock-plugin')).toBe(false);
        pluginRegistry.register(mockPlugin);
        expect(pluginRegistry.hasPlugin('mock-plugin')).toBe(true);
    });
    it('should clear all plugins', () => {
        pluginRegistry.register(mockPlugin);
        pluginRegistry.clear();
        expect(pluginRegistry.getAll()).toHaveLength(0);
    });
});
//# sourceMappingURL=PluginRegistry.test.js.map