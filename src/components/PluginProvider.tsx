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
  const manager = PluginManager.getInstance();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Add a small delay to ensure state updates properly
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const value: PluginContextType = React.useMemo(() => {
    // Create stable function references using useCallback
    const installPlugin = React.useCallback(
      (plugin: Plugin) => manager.installPlugin(plugin),
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

    return {
      installPlugin,
      getPlugin,
      isPluginReady
    };
  }, [manager]);

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
