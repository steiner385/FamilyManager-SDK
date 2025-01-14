import { useState, useCallback } from 'react';
import { useNotification } from '../contexts/NotificationContext';

interface QueryOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  showSuccessNotification?: boolean;
  showErrorNotification?: boolean;
  successMessage?: string;
  errorMessage?: string;
}

interface QueryState<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
}

export function useQuery<T = any>() {
  const [state, setState] = useState<QueryState<T>>({
    data: null,
    error: null,
    isLoading: false,
  });

  const { addNotification } = useNotification();

  const execute = useCallback(async (
    queryFn: () => Promise<T>,
    options: QueryOptions<T> = {}
  ) => {
    const {
      onSuccess,
      onError,
      showSuccessNotification = false,
      showErrorNotification = true,
      successMessage = 'Operation completed successfully',
      errorMessage = 'An error occurred',
    } = options;

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const data = await queryFn();
      setState({ data, error: null, isLoading: false });
      
      if (showSuccessNotification) {
        addNotification(successMessage, 'success');
      }
      
      onSuccess?.(data);
      return data;
    } catch (error) {
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
