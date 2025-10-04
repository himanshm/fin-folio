import type { QueryParams } from '@/types';
import { customNanoId } from '@fin-folio/config';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import packageJson from '../../../../package.json';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const buildQueryParams = (args: QueryParams): string => {
  const params = new URLSearchParams();

  Object.entries(args).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(val => params.append(key, String(val)));
    } else {
      params.set(key, String(value));
    }
  });

  return params.toString();
};

export const getOrSetSessionId = (): string => {
  let reqSessionId = localStorage.getItem('reqSessionId');
  if (!reqSessionId) {
    reqSessionId = customNanoId();
    localStorage.setItem('reqSessionId', reqSessionId);
  }

  return reqSessionId;
};

export const getAppVersion = () => packageJson.version;
