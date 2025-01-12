import { useEffect, useCallback } from 'react';
import { PluginMessageBus } from '../core/plugin/PluginMessageBus';
import type { Message } from '../types/plugin';

export function usePluginMessages(
  pluginId: string,
  messageTypes?: string[]
) {
  const bus = PluginMessageBus.getInstance();

  const publish = useCallback((type: string, payload?: any) => {
    bus.publish(pluginId, type, payload);
  }, [pluginId]);

  const subscribe = useCallback((
    callback: (message: Message) => void,
    filter?: (message: Message) => boolean
  ) => {
    return bus.subscribe(pluginId, callback, filter);
  }, [pluginId]);

  return {
    publish,
    subscribe,
    getHistory: bus.getHistory.bind(bus)
  };
}
