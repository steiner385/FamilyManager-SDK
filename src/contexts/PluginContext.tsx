import React, { createContext, useContext } from 'react';
import { PluginMetadata } from '../core/plugin/types';

interface PluginContextValue {
  plugins: PluginMetadata[];
}

const PluginContext = createContext<PluginContextValue>({
  plugins: [],
});

export const PluginProvider: React.FC<{ plugins: PluginMetadata[] }> = ({
  plugins,
  children,
}) => {
  return (
    <PluginContext.Provider value={{ plugins }}>
      {children}
    </PluginContext.Provider>
  );
};

export const usePluginContext = () => useContext(PluginContext);
