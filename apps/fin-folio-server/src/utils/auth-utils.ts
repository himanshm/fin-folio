import config from "@/config";
import { TokenPayload } from "@/types";
import jwt from "jsonwebtoken";
import { ConfigurationError } from "./custom-error";

const accessTokenSecret = config.app?.auth?.accessTokenSecret;
const refreshTokenSecret = config.app?.auth?.refreshTokenSecret;

if (!accessTokenSecret) {
  throw new ConfigurationError("Access token secret is not configured");
}

if (!refreshTokenSecret) {
  throw new ConfigurationError("Refresh token secret is not configured");
}

export const generateAccessToken = (
  userId: string | number,
  options: jwt.SignOptions
) => {
  return jwt.sign({ userId }, accessTokenSecret, options);
};

export const generateRefreshToken = (
  userId: string | number,
  tokenVersion: number,
  options: jwt.SignOptions
) => {
  return jwt.sign({ userId, tokenVersion }, refreshTokenSecret, options);
};

export const verifyRefreshToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, refreshTokenSecret) as TokenPayload;
  } catch (_error) {
    return null;
  }
};
