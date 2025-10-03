import { normalisePort } from '@fin-folio/config';
import app from 'app.ts';
import { getConfig } from 'config.ts';
import http from 'http';
import logger from 'logger.ts';
import {
  handleServerError,
  onServerListen
} from 'middlewares/server.middlewares.ts';
import { env as _env } from 'process';
import type { Config } from './types/config.types.ts';

const env = (_env.NODE_ENV || 'development') as keyof Config;
const config = getConfig(env);

const port = normalisePort(String(_env.PORT ?? config.app?.port ?? 8081));

if (port === false) {
  logger.error('Invalid port specified');
  process.exit(1);
}

app.set('port', port);

const server = http.createServer(app);
logger.info(`***** START | Env: ${env} *****`);

server.listen(port);

server.on('error', err => handleServerError(err, port));
server.on('listening', () => onServerListen(server));
