import { getConfig } from 'config.ts';
import { env as _env } from 'process';
import type { Config } from '../types/config.types.ts';

const env = (_env.NODE_ENV || 'development') as keyof Config;
const config = getConfig(env);

export default {
    username: config.username,
    password: config.password,
    database: config.database,
    host: config.host,
    dialect: config.dialect,
    port: config.port,
    logging: config.logging,
    migrationStorageTableName: 'SequelizeMeta',
    migrationStorageTableNameSchema: 'public',
};
