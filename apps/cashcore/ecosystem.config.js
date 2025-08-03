export default {
  apps: [
    {
      name: 'cashcore',
      cwd: './apps/cashcore',
      script: 'src/server.ts',
      interpreter: 'tsx',
      exec_mode: 'fork',
      watch: true,
      ignore_watch: ['node_modules', 'logs', 'public'],
      node_args: '--max_old_space_size=4096',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
// to use pm2 start ecosystem.config.mjs
// This assumes backend has a script:

// "start": "tsx src/server.ts"
