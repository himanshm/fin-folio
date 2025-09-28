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

export default defineConfig([
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
    },
    rules: {
      // ===== From frontend config =====
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],

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

      // ===== From backend config =====
      'object-curly-spacing': 'off',
      'valid-jsdoc': 'off',
      'max-len': 'off',
      'require-jsdoc': 'off',
      'import/no-cycle': 'off',
      'no-param-reassign': 'off',
      'no-shadow': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@typescript-eslint/ban-types': 'off',
      'func-names': ['error', 'never'],
      'arrow-parens': ['error', 'as-needed'],
      'no-fallthrough': ['error', { allowEmptyCase: true }],
      'new-cap': ['error', { capIsNew: false }],
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
  // --- Shared rules for all files ---
  {
    rules: {
      '@stylistic/indent': ['error', 2], // default everywhere
      '@stylistic/arrow-parens': ['error', 'as-needed'],
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/object-curly-spacing': ['error', 'always'],
      'import/no-duplicates': 'error',
    },
  },

  // --- Ignores ---
  {
    ignores: [
      '**/node_modules',
      '**/dist',
      '**/build',
      'apps/**/ecosystem.config.js',
    ],
  },
]);
