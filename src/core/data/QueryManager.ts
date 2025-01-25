import { QueryClient } from '@tanstack/react-query'

interface QueryConfig {
  staleTime?: number
  cacheTime?: number
  retry?: number | boolean
  refetchOnWindowFocus?: boolean
}

export class QueryManager {
  private static instance: QueryManager
  private queryClient: QueryClient
  private defaultConfig: QueryConfig = {
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    retry: 3,
    refetchOnWindowFocus: true
  }

  private constructor() {
    this.queryClient = new QueryClient({
      defaultOptions: {
        queries: this.defaultConfig
      }
    })
  }

  static getInstance(): QueryManager {
    if (!QueryManager.instance) {
      QueryManager.instance = new QueryManager()
    }
    return QueryManager.instance
  }

  getQueryClient(): QueryClient {
    return this.queryClient
  }

  setDefaultConfig(config: Partial<QueryConfig>) {
    this.defaultConfig = { ...this.defaultConfig, ...config }
    this.queryClient.setDefaultOptions({
      queries: this.defaultConfig
    })
  }

  prefetchQuery(queryKey: any[], queryFn: () => Promise<any>) {
    return this.queryClient.prefetchQuery({
      queryKey,
      queryFn
    })
  }

  invalidateQueries(queryKey: any[]) {
    return this.queryClient.invalidateQueries({ queryKey })
  }

  clearCache() {
    return this.queryClient.clear()
  }
}
