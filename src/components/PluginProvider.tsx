import React, { createContext, useContext, useEffect, useState } from 'react';
import { PluginManager } from '../core/plugin/PluginManager';
import { Plugin } from '../core/plugin/types';
import ErrorBoundary from './common/ErrorBoundary';

interface PluginContextType {
  installPlugin: (plugin: Plugin) => Promise<void>;
  getPlugin: (name: string) => Plugin | undefined;
  isPluginReady: (name: string) => boolean;
}

const PluginContext = createContext<PluginContextType | undefined>(undefined);

export function PluginProvider({ children }: { children: React.ReactNode }) {
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
  const installPlugin = React.useCallback(
    async (plugin: Plugin) => {
      await manager.registerPlugin(plugin);
    },
    [manager]
  );

  const getPlugin = React.useCallback(
    (name: string) => manager.getPlugin(name),
    [manager]
  );

  const isPluginReady = React.useCallback(
    (name: string) => manager.isInitialized(name),
    [manager]
  );

  // Create the context value using the stable function references
  const value = React.useMemo(
    () => ({
      installPlugin,
      getPlugin,
      isPluginReady
    }),
    [installPlugin, getPlugin, isPluginReady]
  );

  if (!isInitialized) {
    return null;
  }

  return (
    <PluginContext.Provider value={value}>
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
    </PluginContext.Provider>
  );
}

export function usePluginContext() {
  const context = useContext(PluginContext);
  if (!context) {
    throw new Error('usePluginContext must be used within PluginProvider');
  }
  return context;
}
