import config from "@/config";
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
