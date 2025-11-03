import config from "@/config";
import { TokenPayload } from "@/types";
import { Response } from "express";
import jwt from "jsonwebtoken";
import { ConfigurationError } from "./custom-error";

const accessTokenSecret = config.app?.auth?.accessTokenSecret;
const refreshTokenSecret = config.app?.auth?.refreshTokenSecret;
const accessTokenExpiryMinutes = config.app?.auth?.accessTokenExpiry as number;
const refreshTokenExpiryDays = config.app?.auth?.refreshTokenExpiry as number;

if (!accessTokenSecret) {
  throw new ConfigurationError("Access token secret is not configured");
}

if (!refreshTokenSecret) {
  throw new ConfigurationError("Refresh token secret is not configured");
}

export const generateAccessToken = (
  userId: string,
  options: jwt.SignOptions
) => {
  return jwt.sign({ userId }, accessTokenSecret, options);
};

export const generateRefreshToken = (
  userId: string,
  tokenVersion: number,
  options: jwt.SignOptions
) => {
  return jwt.sign({ userId, tokenVersion }, refreshTokenSecret, options);
};

export const verifyAccessToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, accessTokenSecret) as TokenPayload;
  } catch (_error) {
    return null;
  }
};

export const verifyRefreshToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, refreshTokenSecret) as TokenPayload;
  } catch (_error) {
    return null;
  }
};

export const setAuthCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string
) => {
  // Use "lax" in development for Postman compatibility, "strict" in production
  const sameSite = process.env.NODE_ENV === "production" ? "strict" : "lax";

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite,
    maxAge: accessTokenExpiryMinutes * 60 * 1000 // 15 minutes
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite,
    maxAge: refreshTokenExpiryDays * 24 * 60 * 60 * 1000 // 7 days
  });
};

export const clearAuthCookies = (res: Response) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
};
