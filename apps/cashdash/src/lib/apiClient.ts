import {
  buildQueryParams,
  getAppVersion,
  getOrSetSessionId
} from '@/lib/utils';
import type { QueryParams } from '@/types';
import axios, { type AxiosInstance } from 'axios';

let instance: AxiosInstance | null = null;

const apiClient = (newInstance: boolean = false): AxiosInstance => {
  if (newInstance || !instance) {
    instance = axios.create({
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        'x-session-id': getOrSetSessionId(),
        'x-app-version': getAppVersion()
      },
      withCredentials: true,
      validateStatus: status => status === 200,
      paramsSerializer: (params: QueryParams) => buildQueryParams(params)
    });
  }

  return instance;
};

export default apiClient;
