/**
 * Plugin system event types and payloads
 */

import { BaseEvent } from '../events/types';

/**
 * Plugin event types
 */
export enum PluginEventType {
  INITIALIZED = 'plugin.initialized',
  TEARDOWN = 'plugin.teardown',
  ERROR = 'plugin.error',
  DEPENDENCY_CHANGED = 'plugin.dependency.changed'
}

/**
 * Plugin event payloads
 */
export interface PluginEventPayload {
  [PluginEventType.INITIALIZED]: {
    pluginName: string;
    version: string;
    dependencies: string[];
  };
  [PluginEventType.TEARDOWN]: {
    pluginName: string;
  };
  [PluginEventType.ERROR]: {
    pluginName: string;
    error: Error;
  };
  [PluginEventType.DEPENDENCY_CHANGED]: {
    pluginName: string;
    dependency: string;
    action: 'added' | 'removed' | 'updated';
  };
}

/**
 * Creates a plugin event with the specified type and payload
 */
export function createPluginEvent<T extends PluginEventType>(
  type: T,
  payload: PluginEventPayload[T],
  source: string
): BaseEvent {
  return {
    type,
    timestamp: Date.now(),
    source,
    metadata: { payload }
  };
}
