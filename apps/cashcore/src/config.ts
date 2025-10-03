import 'dotenv/config';
import type { Config, DBConfig } from 'types/config.types.ts';

const config: Config = {
  development: {
    username: process.env.DB_USERNAME || '',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || '',
    host: process.env.DB_HOST || '',
    port: Number(process.env.DB_PORT) || 5432,
    dialect: 'postgres',
    logging: process.env.DEV_DB_LOGGING === 'true',
    log: {
      folder: process.env.LOG_FOLDER,
      filename: process.env.LOG_FILENAME,
      stackTrace: process.env.DEV_LOG_STACKTRACE === 'true' || true
    },
    ssl: process.env.DB_SSL === 'true',
    pool: {
      max: Number(process.env.DB_POOL_MAX) || 5,
      min: Number(process.env.DB_POOL_MIN) || 0,
      idle: Number(process.env.DB_POOL_IDLE) || 10000,
      acquire: Number(process.env.DB_POOL_ACQUIRE) || 60000
    },
    app: {
      auth: {
        token: process.env.CAPP_AUTH_TOKEN || '',
        domain: process.env.CAPP_AUTH_DOMAIN || '',
        jwtSecret: process.env.CAPP_AUTH_JWT_SECRET || ''
      },
      url: process.env.CAPP_URL || '',
      port: process.env.PORT || 8081
    }
  },
  test: {
    username: process.env.DB_USERNAME || '',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || '',
    host: process.env.DB_HOST || '',
    port: Number(process.env.DB_PORT) || 5432,
    dialect: 'postgres',
    ssl: process.env.DB_SSL === 'true'
  },
  production: {
    username: process.env.DB_USERNAME || '',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || '',
    host: process.env.DB_HOST || '',
    port: Number(process.env.DB_PORT) || 5432,
    dialect: 'postgres',
    ssl: process.env.DB_SSL === 'true'
  }
};

export const getConfig = (env: keyof Config): DBConfig => config[env];

export default config;
