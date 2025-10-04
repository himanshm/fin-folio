import apiClient from '@/lib/apiClient';
import type { ApiError, ApiResponse } from '@/types';
import type { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

// ===== BASE API CONFIGURATION =====

const baseUrl = import.meta.env.VITE_BASE_API_URL;
// const testUrl = 'https://jsonplaceholder.typicode.com';  
const getBaseUrl = () => {
  return `${baseUrl}`;
};

// ===== AUTHENTICATION HELPERS =====

const getCurrentUserIdentifier = (): string | null => {
  return sessionStorage.getItem('currentUserIdentifier');
};

const setCurrentUserIdentifier = (identifier: string): void => {
  sessionStorage.setItem('currentUserIdentifier', identifier);
};

const removeCurrentUserIdentifier = (): void => {
  sessionStorage.removeItem('currentUserIdentifier');
};

// ===== AUTHENTICATION INTERCEPTOR =====

const setupAuthInterceptor = (client: ReturnType<typeof apiClient>) => {
  // Request interceptor to add auth headers
  client.interceptors.request.use(
    config => {
      const currentUserIdentifier = getCurrentUserIdentifier();
      if (currentUserIdentifier) {
        config.headers.set('auth-user', currentUserIdentifier);
      }
      return config;
    },
    error => Promise.reject(error)
  );

  // Response interceptor to handle 401 errors
  client.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
      // Skip if no response
      if (!error.response) return Promise.reject(error);

      const originalRequest = error.config;

      // Prevent infinite loop: don't handle if refresh call itself failed
      if (originalRequest?.url?.includes('/auth/refresh')) {
        return Promise.reject(error);
      }

      if (error.response?.status === 401) {
        removeCurrentUserIdentifier();

        try {
          const refreshClient = apiClient(true);
          refreshClient.defaults.baseURL = getBaseUrl();

          const refreshResponse = await refreshClient.post('/auth/refresh');

          if (refreshResponse.status === 200) {
            const newIdentifier = refreshResponse.data?.identifier;
            if (newIdentifier) setCurrentUserIdentifier(newIdentifier);

            // Retry the original request
            if (error.config) {
              error.config.headers.set('auth-user', newIdentifier);
              return client.request(error.config);
            }
          }
        } catch (refreshError) {
          // Refresh failed, redirect to login
          if (typeof window !== 'undefined') {
            const loginUrl = `${getBaseUrl()}/login?refUrl=${encodeURIComponent(window.location.href)}`;
            window.location.href = loginUrl;
          }
        }
      }
      return Promise.reject(error);
    }
  );
};

// ===== API CLIENT FACTORY =====

const createApiClient = () => {
  const client = apiClient(true); // Create new instance

  // Update the base URL
  client.defaults.baseURL = getBaseUrl();

  // Setup auth interceptors
  setupAuthInterceptor(client);

  return client;
};

// ===== ERROR HANDLING =====

const handleApiError = (error: any): ApiError => {
  if (error.response) {
    // Server responded with error status
    return {
      message: error.response.data?.message || 'An error occurred',
      status: error.response.status,
      data: error.response.data
    };
  } else if (error.request) {
    // Request was made but no response received
    return {
      message: 'Network error - please check your connection',
      status: 0
    };
  } else {
    // Something else happened
    return {
      message: error.message || 'An unexpected error occurred'
    };
  }
};

// ===== BASE API INSTANCES =====

let apiInstance: AxiosInstance | null = null;

export const baseApi = (): AxiosInstance => {
  if (!apiInstance) {
    apiInstance = createApiClient();
  }
  return apiInstance;
};

// ===== API METHODS =====

// Generic GET method
export const apiGet = async <T = any>(
  url: string,
  params?: Record<string, any>
): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<ApiResponse<T>> = await baseApi().get(url, {
      params
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Generic POST method
export const apiPost = async <T = any>(
  url: string,
  data?: any,
  params?: Record<string, any>
): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<ApiResponse<T>> = await baseApi().post(
      url,
      data,
      { params }
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Generic PUT method
export const apiPut = async <T = any>(
  url: string,
  data?: any,
  params?: Record<string, any>
): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<ApiResponse<T>> = await baseApi().put(
      url,
      data,
      { params }
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Generic DELETE method
export const apiDelete = async <T = any>(
  url: string,
  params?: Record<string, any>
): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<ApiResponse<T>> = await baseApi().delete(
      url,
      {
        params
      }
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// ===== AUTHENTICATION HELPERS =====

export const setUserIdentifier = (identifier: string): void => {
  setCurrentUserIdentifier(identifier);
};

export const clearUserIdentifier = (): void => {
  removeCurrentUserIdentifier();
};

export const getCurrentUser = (): string | null => {
  return getCurrentUserIdentifier();
};

// ===== EXPORT ALL API METHODS =====

export default {
  // Base API instances
  baseApi,

  // HTTP methods
  get: apiGet,
  post: apiPost,
  put: apiPut,
  delete: apiDelete,

  // Auth helpers
  setUserIdentifier,
  clearUserIdentifier,
  getCurrentUser
};
