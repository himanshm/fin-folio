import "express";
import type { JwtPayload } from "jsonwebtoken";

export interface TokenPayload extends JwtPayload {
  userId: string;
  tokenVersion?: number;
}

export interface AppAuth {
  userId: string;
  sessionId: string;
  ipAddress: string;
  deviceInfo: string;
}

declare module "express" {
  interface Request {
    appAuth?: AppAuth;
  }
}
