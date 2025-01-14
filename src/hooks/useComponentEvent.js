import { useEffect } from 'react';
export function useComponentEvent(emitter, event, callback) {
    useEffect(() => {
        return emitter.on(event, callback);
    }, [emitter, event, callback]);
}
//# sourceMappingURL=useComponentEvent.js.map