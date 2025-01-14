import { AxiosRequestConfig } from 'axios';
interface ApiConfig extends Omit<AxiosRequestConfig, 'headers'> {
    requiresAuth?: boolean;
    headers?: Record<string, string>;
}
declare class ApiService {
    private instance;
    constructor();
    private setupInterceptors;
    get<T>(url: string, config?: ApiConfig): Promise<T>;
    post<T>(url: string, data?: unknown, config?: ApiConfig): Promise<T>;
    put<T>(url: string, data?: unknown, config?: ApiConfig): Promise<T>;
    delete<T>(url: string, config?: ApiConfig): Promise<T>;
}
export declare const api: ApiService;
export {};
//# sourceMappingURL=api.d.ts.map