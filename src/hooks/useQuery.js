import { useState, useCallback } from 'react';
import { useNotification } from '../contexts/NotificationContext';
export function useQuery() {
    const [state, setState] = useState({
        data: null,
        error: null,
        isLoading: false,
    });
    const { addNotification } = useNotification();
    const execute = useCallback(async (queryFn, options = {}) => {
        const { onSuccess, onError, showSuccessNotification = false, showErrorNotification = true, successMessage = 'Operation completed successfully', errorMessage = 'An error occurred', } = options;
        setState(prev => ({ ...prev, isLoading: true }));
        try {
            const data = await queryFn();
            setState({ data, error: null, isLoading: false });
            if (showSuccessNotification) {
                addNotification(successMessage, 'success');
            }
            onSuccess?.(data);
            return data;
        }
        catch (error) {
            const errorObj = error instanceof Error ? error : new Error(String(error));
            setState({ data: null, error: errorObj, isLoading: false });
            if (showErrorNotification) {
                addNotification(errorMessage, 'error');
            }
            onError?.(errorObj);
            throw errorObj;
        }
    }, [addNotification]);
    return {
        ...state,
        execute,
    };
}
//# sourceMappingURL=useQuery.js.map