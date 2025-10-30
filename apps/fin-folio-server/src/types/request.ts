import type { Request } from "express";
import type { JwtPayload } from "jsonwebtoken";

export interface TokenPayload extends JwtPayload {
  userId: string;
  tokenVersion?: number;
}

export interface AppAuth {
  userId: string;
  ipAddress: string;
  deviceInfo: string;
}

export interface CustomRequest extends Request {
  appAuth?: AppAuth;
}
