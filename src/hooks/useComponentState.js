import { useState, useEffect } from 'react';
import { ComponentStateManager } from '../core/state/ComponentStateManager';
export function useComponentState(componentId, initialState, config = {}) {
    const [state, setState] = useState(() => {
        const savedState = ComponentStateManager.getState(componentId, config);
        return savedState ?? initialState;
    });
    useEffect(() => {
        ComponentStateManager.setState(componentId, state, config);
    }, [componentId, state, config]);
    return [state, setState];
}
//# sourceMappingURL=useComponentState.js.map