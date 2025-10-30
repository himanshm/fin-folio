import config from "@/config";
import { existsSync, mkdirSync } from "fs";
import pino from "pino";

const isDev = process.env.NODE_ENV !== "production";

const logPath = config.log?.folder ?? "./logs";
if (!existsSync(logPath)) {
  mkdirSync(logPath, { recursive: true });
}

const logFile = `${logPath}/${config.log?.filename ?? "app-all.log"}`;

export const logger = pino({
  name: "fin-folio-server",
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  transport: isDev
    ? {
        targets: [
          {
            target: "pino-pretty",
            level: "debug",
            options: {
              colorize: true,
              translateTime: "SYS:HH:MM:ss",
              ignore: "pid,hostname",
              singleLine: false
            }
          },
          {
            target: "pino/file",
            level: "debug",
            options: { destination: logFile }
          }
        ]
      }
    : {
        target: "pino/file",
        options: { destination: logFile }
      }
});
