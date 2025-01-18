import { useContext } from 'react';
import { PluginContext } from '../contexts/PluginContext';

export const usePlugins = () => {
  const { plugins } = useContext(PluginContext);
  return { plugins };
};
