import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { useAuthStore } from '../store/auth';
import { handleApiError } from '../utils/errorHandler';
import { InternalAxiosRequestConfig } from 'axios';

interface ApiConfig extends Omit<AxiosRequestConfig, 'headers'> {
  requiresAuth?: boolean;
  headers?: Record<string, string>;
}

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  requiresAuth?: boolean;
}

class ApiService {
  private instance: AxiosInstance;

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

  private setupInterceptors() {
    this.instance.interceptors.request.use(
      (config: CustomInternalAxiosRequestConfig) => {
        const authState = useAuthStore.getState();
        if (authState.isAuthenticated && config.requiresAuth !== false) {
          // Add auth header if needed
          config.headers = config.headers || {};
          config.headers['Authorization'] = `Bearer ${authState.token}`;
        }
        return config;
      },
      (error) => Promise.reject(handleApiError(error))
    );

    this.instance.interceptors.response.use(
      (response) => response,
      (error) => Promise.reject(handleApiError(error))
    );
  }

  async get<T>(url: string, config?: ApiConfig): Promise<T> {
    const response = await this.instance.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: unknown, config?: ApiConfig): Promise<T> {
    const response = await this.instance.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: unknown, config?: ApiConfig): Promise<T> {
    const response = await this.instance.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: ApiConfig): Promise<T> {
    const response = await this.instance.delete<T>(url, config);
    return response.data;
  }
}

export const api = new ApiService();
