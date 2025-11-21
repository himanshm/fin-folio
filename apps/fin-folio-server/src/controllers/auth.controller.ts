import { asyncHandler } from "@/middlewares";
import { authService } from "@/services";
import { AuthenticationError, clearAuthCookies, setAuthCookies } from "@/utils";
import { NextFunction, Request, RequestHandler, Response } from "express";

export const registerUser: RequestHandler = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { name, email, password } = req.body;

    const { user, tokens } = await authService.registerUser(
      { name, email, password },
      req.appAuth!
    );

    const userData = {
      id: user.publicId,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      country: user.country,
      currency: user.currency,
      currencySymbol: user.currencySymbol,
      locale: user.locale
    };

    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

    return res.status(201).json({
      meta: { success: true },
      message: "Registration successful",
      data: { user: userData }
    });
  }
);

export const signInUser: RequestHandler = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { email, password } = req.body;

    const { user, tokens } = await authService.signInUser(
      { email, password },
      req.appAuth!
    );

    const userData = {
      id: user.publicId,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      country: user.country,
      currency: user.currency,
      currencySymbol: user.currencySymbol,
      locale: user.locale
    };

    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

    return res.status(200).json({
      meta: { success: true },
      message: "Login successful",
      data: { user: userData }
    });
  }
);

export const logoutUser: RequestHandler = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const sessionId = req.appAuth?.sessionId;

    if (!sessionId) {
      throw new AuthenticationError("User not authenticated");
    }

    await authService.signOutUser(sessionId);
    clearAuthCookies(res);
    return res.status(204).send();
  }
);

export const getCurrentUser: RequestHandler = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const userId = req.appAuth?.userId;
    if (!userId) {
      throw new AuthenticationError("User not authenticated");
    }

    const user = await authService.getCurrentUser(userId);

    const userData = {
      id: user.publicId,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      country: user.country,
      currency: user.currency,
      currencySymbol: user.currencySymbol
    };

    return res.status(200).json({
      meta: { success: true },
      message: "Current user fetched successfully",
      data: { user: userData }
    });
  }
);

export const refreshToken: RequestHandler = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new AuthenticationError("Refresh token is required");
    }

    const { tokens } = await authService.refreshToken(
      refreshToken,
      req.appAuth!
    );

    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

    return res.status(200).json({
      meta: { success: true },
      message: "Token refreshed"
    });
  }
);
