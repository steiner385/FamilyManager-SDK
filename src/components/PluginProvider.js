import { jsx as _jsx } from "react/jsx-runtime";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { PluginManager } from '../core/plugin/PluginManager';
import ErrorBoundary from './common/ErrorBoundary';
const PluginContext = createContext(undefined);
export function PluginProvider({ children }) {
    const [isInitialized, setIsInitialized] = useState(false);
    // Memoize the manager instance
    const manager = React.useMemo(() => PluginManager.getInstance(), []);
    useEffect(() => {
        // Add a small delay to ensure state updates properly
        const timer = setTimeout(() => {
            setIsInitialized(true);
        }, 0);
        return () => clearTimeout(timer);
    }, []);
    // Use separate useCallback hooks for each function
    const installPlugin = React.useCallback(async (plugin) => {
        await manager.registerPlugin(plugin);
    }, [manager]);
    const getPlugin = React.useCallback((name) => manager.getPlugin(name), [manager]);
    const isPluginReady = React.useCallback((name) => manager.isInitialized(name), [manager]);
    // Create the context value using the stable function references
    const value = React.useMemo(() => ({
        installPlugin,
        getPlugin,
        isPluginReady
    }), [installPlugin, getPlugin, isPluginReady]);
    if (!isInitialized) {
        return null;
    }
    return (_jsx(PluginContext.Provider, { value: value, children: _jsx(ErrorBoundary, { children: children }) }));
}
export function usePluginContext() {
    const context = useContext(PluginContext);
    if (!context) {
        throw new Error('usePluginContext must be used within PluginProvider');
    }
    return context;
}
//# sourceMappingURL=PluginProvider.js.map