interface QueryOptions<T> {
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
    showSuccessNotification?: boolean;
    showErrorNotification?: boolean;
    successMessage?: string;
    errorMessage?: string;
}
export declare function useQuery<T = any>(): {
    execute: (queryFn: () => Promise<T>, options?: QueryOptions<T>) => Promise<T>;
    data: T | null;
    error: Error | null;
    isLoading: boolean;
};
export {};
//# sourceMappingURL=useQuery.d.ts.map