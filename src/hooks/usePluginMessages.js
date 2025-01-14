import { useCallback } from 'react';
import { PluginMessageBus } from '../core/plugin/PluginMessageBus';
export function usePluginMessages(pluginId, messageTypes) {
    const bus = PluginMessageBus.getInstance();
    const publish = useCallback((type, payload) => {
        bus.publish(pluginId, type, payload);
    }, [pluginId]);
    const subscribe = useCallback((callback, filter) => {
        return bus.subscribe(pluginId, callback, filter);
    }, [pluginId]);
    return {
        publish,
        subscribe,
        getHistory: bus.getHistory.bind(bus)
    };
}
//# sourceMappingURL=usePluginMessages.js.map