import type { Secret } from "jsonwebtoken";

type ExpiresIn = string | number;

interface AppConfig {
  postgres: {
    host: string | undefined;
    port: number;
    username: string | undefined;
    password: string | undefined;
    database: string | undefined;
  };
  log: {
    folder: string;
    filename: string;
  };
  app: {
    port: number | string;
    auth: {
      clientUrl: string;
      accessTokenSecret: Secret;
      refreshTokenSecret: Secret;
      accessTokenExpiry: ExpiresIn;
      refreshTokenExpiry: ExpiresIn;
    };
  };
}

const config: AppConfig = {
  postgres: {
    host: process.env.PG_HOST,
    port: parseInt(process.env.PG_PORT || "5432"),
    username: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DB
  },
  log: {
    folder: process.env.LOG_FOLDER || "logs",
    filename: process.env.LOG_FILE_NAME || "fin-folio-server.log"
  },
  app: {
    port: process.env.BE_SERVICE_PORT || 8081,
    auth: {
      clientUrl: process.env.CLIENT_URL as string,
      accessTokenSecret: process.env.ACCESS_TOKEN_SECRET as Secret,
      refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET as Secret,
      accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY as ExpiresIn,
      refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY as ExpiresIn
    }
  }
};

export default config;
