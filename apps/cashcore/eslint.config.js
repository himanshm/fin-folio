import baseConfig from '@fin-folio/config';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  ...baseConfig,
  {
    rules: {
      '@stylistic/indent': ['error', 4],
      'prettier/prettier': [
        'error',
        {
          tabWidth: 4,
        },
      ],
      '@typescript-eslint/explicit-function-return-type': ['error'],
    },
  },
]);
