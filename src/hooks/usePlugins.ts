import { usePluginContext } from '../contexts/PluginContext';
import { Plugin } from '../core/plugin/types';

export const usePlugins = (): { plugins: Plugin[] } => {
  const context = usePluginContext();
  return { plugins: context.plugins as Plugin[] };
};
