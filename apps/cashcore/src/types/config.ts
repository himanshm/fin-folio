export interface DBConfig {
  username: string;
  password: string;
  database: string;
  host: string;
  port: number;
  dialect: 'postgres';
  logging?: boolean | string;
  log?: {
    folder?: string;
    filename?: string;
    stackTrace?: boolean;
  };
  ssl?: boolean;
  pool?: {
    max: number;
    min: number;
    idle: number;
    acquire: number;
  }
  app?: {
    auth: {
      token: string;
      domain: string;
      jwtSecret: string;
    }
    url: string;
    port: number | string;
  }
}

export interface Config {
  development: DBConfig;
  test: DBConfig;
  production: DBConfig;
}