import { useState, useCallback } from 'react';
export function useLoadingState(initialState = false) {
    const [isLoading, setIsLoading] = useState(initialState);
    const [error, setError] = useState(null);
    const startLoading = useCallback(() => {
        setIsLoading(true);
        setError(null);
    }, []);
    const stopLoading = useCallback(() => {
        setIsLoading(false);
    }, []);
    const setLoadingError = useCallback((error) => {
        setError(error);
        setIsLoading(false);
    }, []);
    return {
        isLoading,
        error,
        startLoading,
        stopLoading,
        setLoadingError
    };
}
//# sourceMappingURL=useLoadingState.js.map