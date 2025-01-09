import React, { createContext, useContext, useEffect, useState } from 'react';
import { PluginManager } from '../core/plugin/PluginManager';
import { Plugin } from '../core/types';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';

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
    setIsInitialized(true);
  }, []);

  const value: PluginContextType = {
    installPlugin: manager.installPlugin.bind(manager),
    getPlugin: manager.getPlugin.bind(manager),
    isPluginReady: manager.isInitialized.bind(manager)
  };

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
