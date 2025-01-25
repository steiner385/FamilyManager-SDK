import { ComponentType } from 'react';
import { ComponentRegistry } from '../core/registry/ComponentRegistry';
import type { ComponentMetadata } from '../core/registry/types';

interface UseRegistryResult {
  getComponent: <T = {}>(name: string) => ComponentType<T> | undefined;
  getMetadata: (name: string) => ComponentMetadata | undefined;
  getAllComponents: () => [string, ComponentType<any>][];
}

export function useRegistry(): UseRegistryResult {
  const registry = ComponentRegistry.getInstance();

  return {
    getComponent: (name: string) => registry.get(name),
    getMetadata: (name: string) => registry.getMetadata(name),
    getAllComponents: () => registry.getAllComponents()
  };
}
