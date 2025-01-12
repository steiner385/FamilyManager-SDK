import { 
  useQuery as useReactQuery, 
  UseQueryResult,
  QueryKey,
  UseQueryOptions
} from '@tanstack/react-query';
import { useNotification } from '../contexts/NotificationContext';
import { handleApiError, getErrorMessage } from '../utils/errorHandler';

export function useQuery<TData = unknown, TError = unknown>(
  queryKey: QueryKey,
  queryFn: () => Promise<TData>,
  options: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'> = {}
): UseQueryResult<TData, TError> {
  const { showNotification } = useNotification();

  const defaultRetry = (failureCount: number, error: unknown) => {
    const apiError = handleApiError(error);
    
    // Don't retry on client errors (4xx)
    if (apiError.status && apiError.status >= 400 && apiError.status < 500) {
      return false;
    }
    
    // Retry server errors up to 3 times
    return failureCount < 3;
  };

  return useReactQuery({
    queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
    queryFn: async () => {
      try {
        return await queryFn();
      } catch (error) {
        const apiError = handleApiError(error);
        const message = getErrorMessage(apiError);
        showNotification('error', message);
        throw error;
      }
    },
    retry: options.retry ?? defaultRetry,
    ...options
  });
}
