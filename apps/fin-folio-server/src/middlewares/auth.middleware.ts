import config from "@/config";
import { userRepository, userSessionRepository } from "@/repositories";
import {
  AuthenticationError,
  clearAuthCookies,
  generateAccessToken,
  verifyAccessToken,
  verifyRefreshToken
} from "@/utils";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { asyncHandler } from "./async-handler.middleware";

/**
 * Finds the session ID that matches the given refresh token for a user
 */
const findSessionByRefreshToken = async (
  userId: number,
  refreshToken: string
): Promise<string | null> => {
  const sessions =
    await userSessionRepository.findAllActiveByUserIdForAuth(userId);

  for (const session of sessions) {
    const isValid = await session.isTokenValid(refreshToken);
    if (isValid) {
      return session.id;
    }
  }

  return null;
};

/**
 * Sets req.appAuth with user info and session, preserving existing context data
 */
const setAuthContext = (
  req: Request,
  userId: string,
  sessionId: string
): void => {
  req.appAuth = {
    userId,
    sessionId,
    ipAddress: req.appAuth?.ipAddress || "",
    deviceInfo: req.appAuth?.deviceInfo || ""
  };
};

/**
 * Validates user exists and throws if not found
 */
const validateUser = async (publicId: string) => {
  const user = await userRepository.findOneByPublicIdForAuth(publicId);
  if (!user) {
    throw new AuthenticationError("User not found");
  }
  return user;
};

/**
 * Refreshes the access token and sets it as a cookie
 */
const refreshAccessTokenCookie = (
  res: Response,
  userPublicId: string
): void => {
  const accessTokenExpiryMinutes = config.app?.auth
    ?.accessTokenExpiry as number;
  const newAccessToken = generateAccessToken(userPublicId, {
    expiresIn: `${accessTokenExpiryMinutes}m`
  });

  res.cookie("accessToken", newAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: accessTokenExpiryMinutes * 60 * 1000
  });
};

export const authenticate: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const accessToken = req.cookies?.accessToken;
    const refreshToken = req.cookies?.refreshToken;

    if (!accessToken || !refreshToken) {
      clearAuthCookies(res);
      throw new AuthenticationError("Authentication required");
    }

    const decoded = verifyAccessToken(accessToken);

    if (decoded) {
      const user = await validateUser(decoded.userId);
      const sessionId =
        (await findSessionByRefreshToken(user.id, refreshToken)) || "";

      setAuthContext(req, decoded.userId, sessionId);
      return next();
    }

    const refreshDecoded = verifyRefreshToken(refreshToken);
    if (!refreshDecoded) {
      clearAuthCookies(res);
      throw new AuthenticationError("Invalid refresh token");
    }

    const user = await validateUser(refreshDecoded.userId);
    if (user.refreshTokenVersion !== refreshDecoded.tokenVersion) {
      clearAuthCookies(res);
      throw new AuthenticationError("Invalid session");
    }

    // Generate and set new access token
    refreshAccessTokenCookie(res, user.publicId);

    // Find matching session
    const sessionId = await findSessionByRefreshToken(user.id, refreshToken);
    if (!sessionId) {
      clearAuthCookies(res);
      throw new AuthenticationError("Session not found");
    }

    setAuthContext(req, user.publicId, sessionId);
    return next();
  }
);
