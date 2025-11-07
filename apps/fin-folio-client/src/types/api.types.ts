export type QueryValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | (string | number | boolean | null | undefined)[];

export type QueryParams = Record<string, QueryValue>;

interface ApiMeta {
  success: boolean;
}

export interface ApiResponse<T = unknown> {
  data: T;
  message: string;
  meta: ApiMeta;
}

export type ApiErrorPayload = {
  message?: string;
  success?: boolean;
  [key: string]: unknown;
};

export type ApiError = {
  success: false;
  message: string;
  status?: number;
  data?: ApiErrorPayload;
};
