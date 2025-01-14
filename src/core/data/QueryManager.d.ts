import { QueryClient } from '@tanstack/react-query';
interface QueryConfig {
    staleTime?: number;
    cacheTime?: number;
    retry?: number | boolean;
    refetchOnWindowFocus?: boolean;
}
export declare class QueryManager {
    private static instance;
    private queryClient;
    private defaultConfig;
    private constructor();
    static getInstance(): QueryManager;
    getQueryClient(): QueryClient;
    setDefaultConfig(config: Partial<QueryConfig>): void;
    prefetchQuery(queryKey: any[], queryFn: () => Promise<any>): Promise<void>;
    invalidateQueries(queryKey: any[]): Promise<void>;
    clearCache(): void;
}
export {};
//# sourceMappingURL=QueryManager.d.ts.map