import js from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import prettier from "eslint-plugin-prettier";
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,tsx,jsx}"],
    plugins: {
      js,
      prettier,
      import: importPlugin,
     },
    extends: [
      "js/recommended",
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module'
      }
    },
    rules: {
      'no-unused-vars': 'off',
      "@typescript-eslint/no-unused-vars": [
          "error",
          {
              args: "none",
              vars: "all",
              varsIgnorePattern: "^_",
              argsIgnorePattern: "^_",
              caughtErrors: "none",
          },
        ],
      'import/no-duplicates': 'error',
      'prettier/prettier': [
        'warn',
        {
          arrowParens: 'avoid',
          printWidth: 80,
          semi: true,
          trailingComma: 'none',
          useTabs: false,
          tabWidth: 2
        }
      ]
    }
  },
]);
