import { logger } from "@/utils";
import { Request, RequestHandler, Response } from "express";
import pino from "pino";
import pinoHttp from "pino-http";

// HTTP request logger middleware using pino-http
export const httpLogger: RequestHandler = pinoHttp({
  logger,
  customLogLevel: (_req: Request, res: Response, err?: Error) => {
    if (res.statusCode >= 500 || err) return "error";
    if (res.statusCode >= 400) return "warn";
    if (res.statusCode >= 300) return "silent";
    return "info";
  },
  customSuccessMessage: (req: Request, res: Response) => {
    return `${req.method} ${req.url} ${res.statusCode}`;
  },
  customErrorMessage: (req: Request, res: Response, err: Error) => {
    return `${req.method} ${req.url} ${res.statusCode} - ${err.message}`;
  },
  serializers: {
    req: (req: Request) => ({
      method: req.method,
      url: req.url,
      path: req.path,
      params: req.params,
      query: req.query,
      headers: req.headers, // Log all headers
      //   headers: {
      //     host: req.headers.host,
      //     'user-agent': req.headers['user-agent'],
      //     'content-type': req.headers['content-type']
      //   },
      remoteAddress: req.socket?.remoteAddress,
      remotePort: req.socket?.remotePort
    }),
    res: pino.stdSerializers.res,
    err: pino.stdSerializers.err
  },
  autoLogging: true,
  customAttributeKeys: {
    req: "request",
    res: "response",
    err: "error",
    responseTime: "duration"
  }
});
