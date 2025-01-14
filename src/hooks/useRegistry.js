import { ComponentRegistry } from '../core/registry/ComponentRegistry';
export function useRegistry() {
    const registry = ComponentRegistry.getInstance();
    return {
        getComponent: (name) => registry.get(name),
        getMetadata: (name) => registry.getMetadata(name),
        getAllComponents: () => registry.getAllComponents()
    };
}
//# sourceMappingURL=useRegistry.js.map