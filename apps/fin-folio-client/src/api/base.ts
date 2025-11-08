// ===== API CLIENT FACTORY =====

import type { AxiosInstance, AxiosResponse } from "axios";

import type { ApiResponse } from "@/types";
import { setupAuthInterceptor } from "./auth-interceptor";
import apiClient from "./client";
import { getBaseUrl, handleApiError } from "./utils";

let apiInstance: AxiosInstance | null = null;

const createApiClient = (): AxiosInstance => {
  const client = apiClient(true);
  client.defaults.baseURL = getBaseUrl();
  setupAuthInterceptor(client);
  return client;
};

export const baseApi = (): AxiosInstance => {
  if (!apiInstance) {
    apiInstance = createApiClient();
  }

  return apiInstance;
};

// ===== GENERIC API METHODS =====

export const get = async <T = unknown>(
  url: string,
  params?: Record<string, unknown>
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

export const post = async <T = unknown>(
  url: string,
  data?: unknown,
  params?: Record<string, unknown>
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

export const put = async <T = unknown>(
  url: string,
  data?: unknown,
  params?: Record<string, unknown>
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

export const patch = async <T = unknown>(
  url: string,
  data?: unknown,
  params?: Record<string, unknown>
): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<ApiResponse<T>> = await baseApi().patch(
      url,
      data,
      { params }
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const remove = async <T = unknown>(
  url: string,
  params?: Record<string, unknown>
): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<ApiResponse<T>> = await baseApi().delete(
      url,
      { params }
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// ===== DEFAULT EXPORT =====

export default {
  baseApi,
  get,
  post,
  put,
  patch,
  remove
};
