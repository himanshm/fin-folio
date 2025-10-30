import type { Server } from "http";
import { logger } from "./logger";

export const handleServerError = (
  error: NodeJS.ErrnoException,
  port: number | string
): void => {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`;

  if (error.code === "EACCES") {
    logger.error(`${bind} requires elevated privileges`);
    process.exit(1);
  } else if (error.code === "EADDRINUSE") {
    logger.error(`${bind} is already in use`);
    process.exit(1);
  } else {
    throw error;
  }
};

export const onServerListen = (server: Server): void => {
  const addr = server.address();

  if (addr) {
    const bind =
      typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
    logger.info(`Listening on ${bind}`);
  } else {
    logger.error("Server address is null");
  }
};

export const normalizePort = (val: string): string | number | false => {
  const port = parseInt(val, 10);

  if (Number.isNaN(port)) return val;

  if (port >= 0) return port;

  return false;
};
