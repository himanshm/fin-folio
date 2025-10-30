import { logger } from "@/utils";
import { BaseError, RouteNotFoundError } from "@/utils/custom-error";
import type { NextFunction, Request, Response } from "express";

const sendErrorResponse = (
  res: Response,
  statusCode: number,
  message: string
) => {
  return res.status(statusCode).json({
    success: false,
    message
  });
};

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = error instanceof BaseError ? error.httpStatus : 500;
  logger.error(
    `[${statusCode}] ${req.method} ${req.originalUrl} - ${error.message}\n${error.stack}`
  );

  if (error instanceof BaseError) {
    return sendErrorResponse(res, error.httpStatus, error.message);
  }

  // Handle unknown errors
  return sendErrorResponse(res, 500, "Internal server error");
};

export const notFoundHandler = (
  _req: Request,
  _res: Response,
  next: NextFunction
) => {
  return next(new RouteNotFoundError());
};
