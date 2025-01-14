import { renderHook, act } from '@testing-library/react';
import { usePluginUIStore } from '../PluginUIStore';
describe('PluginUIStore', () => {
    beforeEach(() => {
        const { result } = renderHook(() => usePluginUIStore());
        act(() => {
            result.current.setPluginVisibility('test-plugin', false);
            result.current.setPluginLayout('test-plugin', '');
            result.current.setPluginPreference('test-plugin', 'testPref', null);
        });
    });
    it('manages plugin visibility', () => {
        const { result } = renderHook(() => usePluginUIStore());
        act(() => {
            result.current.setPluginVisibility('test-plugin', true);
        });
        expect(result.current.visiblePlugins.has('test-plugin')).toBe(true);
        act(() => {
            result.current.setPluginVisibility('test-plugin', false);
        });
        expect(result.current.visiblePlugins.has('test-plugin')).toBe(false);
    });
    it('manages plugin layouts', () => {
        const { result } = renderHook(() => usePluginUIStore());
        act(() => {
            result.current.setPluginLayout('test-plugin', 'grid');
        });
        expect(result.current.pluginLayouts['test-plugin']).toBe('grid');
    });
    it('manages plugin preferences', () => {
        const { result } = renderHook(() => usePluginUIStore());
        act(() => {
            result.current.setPluginPreference('test-plugin', 'theme', 'dark');
        });
        expect(result.current.pluginPreferences['test-plugin'].theme).toBe('dark');
    });
});
//# sourceMappingURL=PluginUIStore.test.js.map