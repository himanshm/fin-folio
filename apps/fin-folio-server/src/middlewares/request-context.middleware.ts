import { NextFunction, Request, Response } from "express";
import requestIp from "request-ip";
import { UAParser } from "ua-parser-js";

export const requestContext = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const ipAddress = requestIp.getClientIp(req) || "unknown";

  const parser = new UAParser(req.headers["user-agent"]);
  const ua = parser.getResult();

  const deviceInfo =
    [
      ua.device.vendor,
      ua.device.model,
      ua.os.name,
      ua.os.version,
      ua.browser.name
    ]
      .filter(Boolean)
      .join(" / ") || "unknown";

  req.appAuth ??= { userId: "", sessionId: "", ipAddress, deviceInfo };
  req.appAuth.ipAddress = ipAddress;
  req.appAuth.deviceInfo = deviceInfo;

  next();
};
