const { jsx: _jsx } = require("react/jsx-runtime");
const React = require('react');
const { createContext, useContext, useEffect, useState, useMemo, useCallback } = React;
const { PluginManager } = require('../core/plugin/PluginManager');
const ErrorBoundary = require('./common/ErrorBoundary');

const PluginContext = createContext(undefined);

function PluginProvider({ children }) {
    const [isInitialized, setIsInitialized] = useState(false);
    
    // Memoize the manager instance
    const manager = useMemo(() => PluginManager.getInstance(), []);

    useEffect(() => {
        // Add a small delay to ensure state updates properly
        const timer = setTimeout(() => {
            setIsInitialized(true);
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    // Use separate useCallback hooks for each function
    const installPlugin = useCallback(async (plugin) => {
        await manager.registerPlugin(plugin);
    }, [manager]);

    const getPlugin = useCallback((name) => manager.getPlugin(name), [manager]);

    const isPluginReady = useCallback((name) => manager.isInitialized(name), [manager]);

    // Create the context value using the stable function references
    const value = useMemo(() => ({
        installPlugin,
        getPlugin,
        isPluginReady
    }), [installPlugin, getPlugin, isPluginReady]);

    if (!isInitialized) {
        return null;
    }

    return _jsx(PluginContext.Provider, { 
        value: value, 
        children: _jsx(ErrorBoundary, { children: children }) 
    });
}

function usePluginContext() {
    const context = useContext(PluginContext);
    if (!context) {
        throw new Error('usePluginContext must be used within PluginProvider');
    }
    return context;
}

module.exports = {
    PluginProvider,
    usePluginContext
};
