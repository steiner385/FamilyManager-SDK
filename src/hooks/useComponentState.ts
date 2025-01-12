import { useState, useEffect } from 'react';
import { ComponentStateManager } from '../core/state/ComponentStateManager';
import type { StateConfig } from '../core/state/ComponentStateManager';

export function useComponentState<T>(
  componentId: string,
  initialState: T,
  config: StateConfig = {}
) {
  const [state, setState] = useState<T>(() => {
    const savedState = ComponentStateManager.getState(componentId, config);
    return savedState ?? initialState;
  });

  useEffect(() => {
    ComponentStateManager.setState(componentId, state, config);
  }, [componentId, state, config]);

  return [state, setState] as const;
}
