import React, { createContext, useContext } from 'react';
import { Plugin } from '../core/plugin/types';

interface PluginContextValue {
  plugins: Plugin[];
}

const PluginContext = createContext<PluginContextValue>({
  plugins: [],
});

interface PluginProviderProps {
  plugins: Plugin[];
  children: React.ReactNode;
}

export const PluginProvider: React.FC<PluginProviderProps> = ({
  plugins,
  children,
}) => {
  return (
    <PluginContext.Provider value={{ plugins }}>
      {children}
    </PluginContext.Provider>
  );
};

export const usePluginContext = () => {
  const context = useContext(PluginContext);
  if (!context) {
    throw new Error('usePluginContext must be used within a PluginProvider');
  }
  return context;
};

export { PluginContext };
