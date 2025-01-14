import { QueryClient } from '@tanstack/react-query';
export class QueryManager {
    constructor() {
        this.defaultConfig = {
            staleTime: 5 * 60 * 1000, // 5 minutes
            cacheTime: 30 * 60 * 1000, // 30 minutes
            retry: 3,
            refetchOnWindowFocus: true
        };
        this.queryClient = new QueryClient({
            defaultOptions: {
                queries: this.defaultConfig
            }
        });
    }
    static getInstance() {
        if (!QueryManager.instance) {
            QueryManager.instance = new QueryManager();
        }
        return QueryManager.instance;
    }
    getQueryClient() {
        return this.queryClient;
    }
    setDefaultConfig(config) {
        this.defaultConfig = { ...this.defaultConfig, ...config };
        this.queryClient.setDefaultOptions({
            queries: this.defaultConfig
        });
    }
    prefetchQuery(queryKey, queryFn) {
        return this.queryClient.prefetchQuery({
            queryKey,
            queryFn
        });
    }
    invalidateQueries(queryKey) {
        return this.queryClient.invalidateQueries({ queryKey });
    }
    clearCache() {
        return this.queryClient.clear();
    }
}
//# sourceMappingURL=QueryManager.js.map