import { getConfig } from 'config.ts';
import { env as _env } from 'process';
import type { Config } from 'types/config.types.ts';
import type { CustomRequest, Logger } from 'types/logger.types.ts';
import winston from 'winston';

const env = (_env.NODE_ENV || 'development') as keyof Config;
const config = getConfig(env);
const logFilePath: string = `${config.log?.folder ?? './logs'}/${config.log?.filename ?? 'app-all.log'}`;

// Custom formatter to include request body in logs
const customFormatter = winston.format(info => {
  if (info.requestBody && typeof info.requestBody === 'object') {
    info.message += ` -- ${JSON.stringify(info.requestBody)}`;
    delete info.requestBody;
  }
  return info;
});

const winstonLogger = winston.createLogger({
  format: winston.format.combine(customFormatter(), winston.format.json()),
  transports: [
    new winston.transports.File({
      level: 'debug',
      filename: logFilePath,
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.Console({
      level: 'debug',
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ],
  exitOnError: false
});

const logger: Logger = {
  log: (level, message) => winstonLogger.log(level, message),

  info: message => winstonLogger.info(message),

  warn: message => winstonLogger.warn(message),

  error: message => {
    if (message instanceof Error) {
      winstonLogger.error(message.message);
      if (config.log?.stackTrace ?? true) {
        winstonLogger.error(`Stack Trace --> ${message.stack}`);
      }
    } else {
      winstonLogger.error(message);
    }
  },

  stream: {
    write(message: string, req: CustomRequest) {
      const { appAuth, body, sessionId } = req;

      let userId: string | undefined;
      let client: string | undefined;

      if (appAuth?.userId) {
        userId = appAuth.userId;
        client = 'app';
      }

      const logDetails = {
        message: message.trim(),
        sessionId,
        userId,
        client,
        requestBody: { ...body }
      };

      winstonLogger.info(logDetails);
    }
  }
};

export default logger;
