import { APP_CONFIG } from "@/constants";
import type { ApiError, ApiErrorPayload, QueryParams } from "@/types";
import type { AxiosError } from "axios";
import { isAxiosError } from "axios";

export const buildQueryParams = (args: QueryParams): string => {
  const params = new URLSearchParams();

  Object.entries(args).forEach(([key, value]) => {
    if (value == null) return;

    if (Array.isArray(value)) {
      value.forEach(val => {
        if (val !== null && val !== undefined) {
          params.append(key, String(val));
        }
      });
    } else if (typeof value === "object" && value !== null) {
      Object.entries(value).forEach(([nestedKey, nestedValue]) => {
        if (nestedValue !== null && nestedValue !== undefined) {
          params.set(`${key}[${nestedKey}]`, String(nestedValue));
        }
      });
    } else {
      params.set(key, String(value));
    }
  });

  return params.toString();
};

export const getOrSetSessionId = (): string => {
  const sessionKey = "client-session-id";
  let reqSessionId = localStorage.getItem(sessionKey);
  if (!reqSessionId) {
    reqSessionId = crypto.randomUUID();
    localStorage.setItem(sessionKey, reqSessionId);
  }
  return reqSessionId;
};

export const getBaseUrl = (): string => APP_CONFIG.API_BASE_URL;

export const handleApiError = (error: unknown): ApiError => {
  if (isAxiosError<ApiErrorPayload>(error)) {
    const axiosError = error as AxiosError<ApiErrorPayload>;

    if (axiosError.response) {
      // Server responded with error status
      const payload = axiosError.response.data;

      return {
        success: false,
        message: payload?.message || "An unknown error occurred",
        status: axiosError.response.status,
        data: payload
      };
    }

    if (axiosError.request) {
      // Request was made but no response received
      return {
        success: false,
        message: "Network error - please check your connection",
        status: 0
      };
    }

    return {
      success: false,
      message: axiosError.message || "An unexpected error occurred"
    };
  }

  const fallbackMessage =
    error instanceof Error ? error.message : "An unexpected error occurred";

  return {
    success: false,
    message: fallbackMessage
  };
};
