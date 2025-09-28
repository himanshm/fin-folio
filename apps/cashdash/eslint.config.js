import baseConfig from '@fin-folio/config';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  ...baseConfig,
  {
    extends: [
      'plugin:react-hooks/recommended',
      'plugin:react-refresh/recommended',
    ],
  },
]);
