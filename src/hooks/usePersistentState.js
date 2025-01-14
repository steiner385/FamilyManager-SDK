import { useState, useEffect } from 'react';
import { StatePersistenceManager } from '../core/state/StatePersistenceManager';
export function usePersistentState(key, initialState, config) {
    const manager = StatePersistenceManager.getInstance();
    const [state, setState] = useState(() => {
        const persisted = manager.retrieve(key, config);
        return persisted ?? initialState;
    });
    useEffect(() => {
        manager.persist(key, state, config);
    }, [key, state, config]);
    return [state, setState];
}
//# sourceMappingURL=usePersistentState.js.map