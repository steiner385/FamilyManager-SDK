import React from 'react';
import { Plugin } from '../core/plugin/types';
interface PluginContextType {
    installPlugin: (plugin: Plugin) => Promise<void>;
    getPlugin: (name: string) => Plugin | undefined;
    isPluginReady: (name: string) => boolean;
}
export declare function PluginProvider({ children }: {
    children: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element | null;
export declare function usePluginContext(): PluginContextType;
export {};
//# sourceMappingURL=PluginProvider.d.ts.map