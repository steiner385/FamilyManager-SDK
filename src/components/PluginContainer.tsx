import React from 'react';
import { usePlugin } from '../hooks/usePlugin';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';

interface PluginContainerProps {
  pluginName: string;
  children?: React.ReactNode;
  className?: string;
}

export function PluginContainer({ pluginName, children, className }: PluginContainerProps) {
  const { plugin, isReady, error } = usePlugin(pluginName);

  if (!isReady) {
    return <LoadingSpinner size="large" />;
  }

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  if (!plugin) {
    return <ErrorMessage message={`Plugin ${pluginName} not found`} />;
  }

  return (
    <div className={`plugin-container ${className || ''}`}>
      {plugin.routes?.map(route => (
        <div key={route.path} className="plugin-route">
          <route.component />
        </div>
      ))}
      {children}
    </div>
  );
}
