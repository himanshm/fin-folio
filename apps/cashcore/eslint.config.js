import baseConfig from '@fin-folio/eslint-config';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  ...baseConfig,
  {
    rules: {
      '@stylistic/js/indent': ['error', 4],
      '@typescript-eslint/explicit-function-return-type': ['error'],
    },
  },
]);
