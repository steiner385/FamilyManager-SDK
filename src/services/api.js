import axios from 'axios';
import { useAuthStore } from '../store/auth';
import { handleApiError } from '../utils/errorHandler';
class ApiService {
    constructor() {
        this.instance = axios.create({
            baseURL: process.env.REACT_APP_API_URL || '/api',
            timeout: parseInt(process.env.REACT_APP_API_TIMEOUT || '10000'),
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
            }
        });
        this.setupInterceptors();
    }
    setupInterceptors() {
        this.instance.interceptors.request.use((config) => {
            const authState = useAuthStore.getState();
            if (authState.isAuthenticated && config.requiresAuth !== false) {
                // Add auth header if needed
                config.headers = config.headers || {};
                config.headers['Authorization'] = `Bearer ${authState.token}`;
            }
            return config;
        }, (error) => Promise.reject(handleApiError(error)));
        this.instance.interceptors.response.use((response) => response, (error) => Promise.reject(handleApiError(error)));
    }
    async get(url, config) {
        const response = await this.instance.get(url, config);
        return response.data;
    }
    async post(url, data, config) {
        const response = await this.instance.post(url, data, config);
        return response.data;
    }
    async put(url, data, config) {
        const response = await this.instance.put(url, data, config);
        return response.data;
    }
    async delete(url, config) {
        const response = await this.instance.delete(url, config);
        return response.data;
    }
}
export const api = new ApiService();
//# sourceMappingURL=api.js.map