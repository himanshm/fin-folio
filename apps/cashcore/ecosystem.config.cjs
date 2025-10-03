// ecosystem.config.mjs
const { env: _env } = require('process');

const APPS = {
  CASHCORE: 'cashcore',
};

const ENVS = {
  DEVELOPMENT: 'development',
  TEST: 'test',
  PRODUCTION: 'production',
};

const ALLOWED_ENVS = Object.values(ENVS);
const env = _env.PM2_ENV || ENVS.DEVELOPMENT;

console.log('Starting cashcore for env:', env);

if (!ALLOWED_ENVS.includes(env)) {
  throw new Error(
    `Invalid environment: "${env}". Allowed environments are: ${ALLOWED_ENVS.join(', ')}`
  );
}

// Helpers
const getScript = () => {
  if (env === ENVS.PRODUCTION) return './dist/server.js';
  return './src/server.ts';
};

const getInterpreterArgs = () => {
  if (env === ENVS.PRODUCTION) return '';
  return '--import tsx';
};

const getNodeArgsForApp = () => {
  if (env === ENVS.PRODUCTION) return '--max_old_space_size=7500';
  if (env === ENVS.TEST) return '--max_old_space_size=4096';
  return '';
};

const getInstances = appName => {
  if (appName === APPS.CASHCORE && [ENVS.PRODUCTION, ENVS.TEST].includes(env))
    return 2;
  return 1;
};

const getExecMode = appName => {
  if (appName === APPS.CASHCORE && [ENVS.PRODUCTION, ENVS.TEST].includes(env))
    return 'cluster';
  return 'fork';
};

const shouldWatch = () => env === ENVS.DEVELOPMENT;

module.exports = {
  apps: [
    {
      name: APPS.CASHCORE,
      cwd: __dirname,
      script: getScript(),
      interpreter: 'node',
      interpreter_args: getInterpreterArgs(),
      exec_mode: getExecMode(APPS.CASHCORE),
      watch: shouldWatch(APPS.CASHCORE),
      instances: getInstances(APPS.CASHCORE),
      node_args: getNodeArgsForApp(APPS.CASHCORE),
      ignore_watch: ['node_modules', 'logs', 'public'],
      env: {
        NODE_ENV: env,
        PORT: 8081,
      },
    },
  ],
};
