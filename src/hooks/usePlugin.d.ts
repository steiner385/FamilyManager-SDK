import { Plugin } from '../core/plugin/types';
interface PluginHookState {
    plugin: Plugin | null;
    isReady: boolean;
    error: Error | null;
}
export declare function usePlugin(pluginName: string): PluginHookState;
export {};
//# sourceMappingURL=usePlugin.d.ts.map