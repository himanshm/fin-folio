import baseConfig from '@fin-folio/config';
import { defineConfig } from 'eslint/config';
console.log(baseConfig);

export default defineConfig([
  ...baseConfig,
  {
    extends: [
      'plugin:react-hooks/recommended',
      'plugin:react-refresh/recommended',
    ],
  },
]);
