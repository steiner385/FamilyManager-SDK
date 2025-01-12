import { useMemo } from 'react';
import { ComponentType } from 'react';
import { UIComponentRegistry } from '../core/ui/UIComponentRegistry';
import type { UIComponentMetadata } from '../core/ui/types';

interface UseUIComponentResult {
  Component: ComponentType | undefined;
  metadata: UIComponentMetadata | undefined;
  isRegistered: boolean;
}

export function useUIComponent(id: string): UseUIComponentResult {
  const registry = UIComponentRegistry.getInstance();

  const component = useMemo(() => registry.get(id), [id]);
  const metadata = useMemo(() => registry.getMetadata(id), [id]);

  return {
    Component: component,
    metadata,
    isRegistered: !!component
  };
}
