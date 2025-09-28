import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettierPlugin from 'eslint-plugin-prettier';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig } from 'eslint/config';
import globals from 'globals';

const baseConfig = defineConfig([
  js.configs.recommended,

  // --- TypeScript files ---
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      '@typescript-eslint': tseslint,
      import: importPlugin,
      prettier: prettierPlugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      '@stylistic': stylistic,
      'jsx-a11y': jsxA11y,
      react: reactPlugin,
    },
    languageOptions: {
      parser: tsParser,
      globals: {
        ...globals.node,
        ...globals.browser,
        NodeJS: true,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        projectService: true,
      },
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
      react: {
        version: 'detect',
      },
    },
    rules: {
      'no-unused-vars': 'off',
      // stylistic
      '@stylistic/indent': ['error', 2],
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/arrow-parens': ['error', 'as-needed'],
      '@stylistic/object-curly-spacing': ['error', 'always'],
      // TypeScript
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: true,
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
        },
      ],
      // Prettier
      'prettier/prettier': [
        'warn',
        {
          arrowParens: 'avoid',
          printWidth: 80,
          semi: true,
          singleQuote: true,
          trailingComma: 'none',
        },
      ],
      // import rules
      'import/no-duplicates': 'error',

      // react accessibility
      'jsx-a11y/accessible-emoji': 'warn',
      'no-underscore-dangle': [
        'error',
        {
          allowAfterThis: true,
        },
      ],
    },
  },

  // --- JavaScript files ---
  {
    files: ['**/*.{js,jsx,mjs,cjs}'],
    plugins: {
      import: importPlugin,
      prettier: prettierPlugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      '@stylistic': stylistic,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.browser,
        NodeJS: true,
      },
    },
    rules: {
      'prettier/prettier': 'warn',
    },
  },
  // --- Ignores ---
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      'apps/**/ecosystem.config.js',
    ],
  },
]);

export default baseConfig;
