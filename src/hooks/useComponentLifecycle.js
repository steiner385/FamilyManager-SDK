import { useEffect, useRef } from 'react';
import { ComponentLifecycle } from '../core/lifecycle/ComponentLifecycle';
export function useComponentLifecycle(componentId, hooks) {
    const prevPropsRef = useRef(null);
    useEffect(() => {
        ComponentLifecycle.registerHooks(componentId, hooks);
        ComponentLifecycle.triggerMount(componentId);
        return () => {
            ComponentLifecycle.triggerUnmount(componentId);
            ComponentLifecycle.unregisterHooks(componentId);
        };
    }, [componentId]);
    useEffect(() => {
        if (prevPropsRef.current) {
            ComponentLifecycle.triggerUpdate(componentId, prevPropsRef.current);
        }
        prevPropsRef.current = hooks;
    }, [hooks, componentId]);
}
//# sourceMappingURL=useComponentLifecycle.js.map