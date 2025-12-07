import type { AxiosError, AxiosInstance } from "axios";
import { AUTH_ENDPOINTS, isAuthEndpoint } from "./api.routes";
import apiClient from "./client";
import { getBaseUrl } from "./utils";

const redirectToLogin = (): void => {
  window.dispatchEvent(new CustomEvent("auth:logout"));
};

// ===== AUTHENTICATION INTERCEPTOR =====

let isRefreshing = false;

export const setupAuthInterceptor = (client: AxiosInstance): void => {
  // Pass-through request interceptor stub: leave requests untouched, surface any setup errors
  // plug in auth headers or other request mutations in the success handler
  client.interceptors.request.use(
    config => config,
    (error: AxiosError) => Promise.reject(error)
  );

  // Response interceptor stub: handle errors (401)
  client.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
      // skip if no response
      if (!error.response) return Promise.reject(error);

      const originalRequest = error.config as typeof error.config & {
        _retry?: boolean;
      };

      // only handle 401 errors
      if (error.response.status !== 401) {
        return Promise.reject(error);
      }

      // Don't retry if already retried
      if (originalRequest?._retry) {
        return Promise.reject(error);
      }

      // Don't retry auth endpoints (login, register, etc.) - if they fail, it's not a token issue
      if (originalRequest.url && isAuthEndpoint(originalRequest.url)) {
        // Only redirect to login for refresh endpoint failures
        if (originalRequest.url.includes(AUTH_ENDPOINTS.REFRESH)) {
          redirectToLogin();
        }
        return Promise.reject(error);
      }

      // If already refreshing, do not queue or retry here
      if (isRefreshing) {
        return Promise.reject(error);
      }

      // Mark as retrying and start refresh process
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // create a fresh axios instance for the refresh request
        const refreshClient = apiClient(true);
        refreshClient.defaults.baseURL = getBaseUrl();

        // Attempt to refresh token (cookies handle auth; response body not required)
        await refreshClient.post(AUTH_ENDPOINTS.REFRESH);

        // Retry original request as-is
        return client.request(originalRequest);
      } catch (refreshError) {
        // Refresh failed - redirect to login
        redirectToLogin();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
  );
};
