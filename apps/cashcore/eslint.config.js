import js from '@eslint/js';
import stylisticJs from '@stylistic/eslint-plugin';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import globals from 'globals';

/** @type {import('eslint').Linter.Config[]} */
export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        ...globals.node,
        NodeJS: true,
      },
      parserOptions: {
        parser: './tsconfig.json',
      },
    },

    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      '@stylistic/js': stylisticJs,
    },
    rules: {
      'object-curly-spacing': 'off',
      'valid-jsdoc': 'off',
      'max-len': 'off',
      'require-jsdoc': 'off',
      'import/no-cycle': 'off',
      'no-param-reassign': 'off',
      'no-shadow': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@stylistic/js/object-curly-spacing': ['error', 'always'],
      '@stylistic/js/semi': ['error', 'always'],
      '@stylistic/js/arrow-parens': ['error', 'as-needed'],
      '@typescript-eslint/ban-types': 'off',
      'func-names': ['error', 'never'],
      'arrow-parens': ['error', 'as-needed'],
      'no-fallthrough': ['error', { allowEmptyCase: true }],
      'new-cap': ['error', { capIsNew: false }],
      'no-unused-vars': 'off',
      // Allow unused vars in type signatures
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
  {
    files: ['*.ts', '*.tsx'],
    rules: {
      '@typescript-eslint/explicit-function-return-type': ['error'],
    },
  },
  {
    ignores: ['node_modules/', 'dist/', 'build/'],
  },
];
