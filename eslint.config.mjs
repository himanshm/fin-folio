import js from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import prettierPlugin from "eslint-plugin-prettier";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import reactRefreshPlugin from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores(["dist"]),
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,tsx,jsx}"],
    plugins: {
      import: importPlugin,
      prettier: prettierPlugin,
      "react-hooks": reactHooksPlugin,
      "react-refresh": reactRefreshPlugin
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      },
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module"
      }
    },
    rules: {
      ...reactHooksPlugin.configs["recommended-latest"].rules,
      ...reactRefreshPlugin.configs.vite.rules,
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "none",
          vars: "all",
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
          caughtErrors: "none"
        }
      ],
      "import/no-duplicates": "error",
      "no-restricted-imports": "off",
      "@typescript-eslint/no-restricted-imports": [
        "warn",
        {
          name: "react-redux",
          importNames: ["useSelector", "useDispatch"],
          message:
            "Use typed hooks `useAppDispatch` and `useAppSelector` instead."
        }
      ],
      "prettier/prettier": [
        "warn",
        {
          arrowParens: "avoid",
          printWidth: 80,
          semi: true,
          trailingComma: "none",
          useTabs: false,
          tabWidth: 2
        }
      ]
    }
  }
]);
