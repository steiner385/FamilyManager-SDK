import { ComponentRegistry } from '../core/registry/ComponentRegistry'

export function useRegistry() {
  const registry = ComponentRegistry.getInstance()

  return {
    getComponent: (name: string) => registry.get(name),
    getMetadata: (name: string) => registry.getMetadata(name),
    getAllComponents: () => registry.getAllComponents()
  }
}
