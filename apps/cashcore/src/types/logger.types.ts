import type { Request } from 'express';

export interface CustomRequest extends Request {
  sessionId?: string;
  appVersion?: string;
  appAuth?: { userId?: string };
}

export interface Logger {
  log: (level: string, message: string) => void;
  info: (message: string) => void;
  warn: (message: string) => void;
  error: (message: string | Error) => void;
  stream: {
    write: (message: string, req: CustomRequest) => void;
  };
}
