import { useMemo } from 'react';
import { UIComponentRegistry } from '../core/ui/UIComponentRegistry';
export function useUIComponent(id) {
    const registry = UIComponentRegistry.getInstance();
    const component = useMemo(() => registry.get(id), [id]);
    const metadata = useMemo(() => registry.getMetadata(id), [id]);
    return {
        Component: component,
        metadata,
        isRegistered: !!component
    };
}
//# sourceMappingURL=useUIComponent.js.map