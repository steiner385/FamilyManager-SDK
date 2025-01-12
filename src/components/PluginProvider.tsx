import React, { createContext, useContext, useEffect, useState } from 'react';
import { PluginManager } from '../core/plugin/PluginManager';
import { Plugin } from '../types/plugin';
import { ErrorBoundary } from './common/ErrorBoundary';

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

  // Create the context value directly with memoized functions
  const value = React.useMemo(() => ({
    installPlugin: (plugin: Plugin) => manager.installPlugin(plugin),
    getPlugin: (name: string) => manager.getPlugin(name),
    isPluginReady: (name: string) => manager.isInitialized(name)
  }), [manager]);

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
