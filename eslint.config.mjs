import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";

// Frontend config (Next.js) - only apply to frontend files
const frontendConfig = nextVitals.map((config) => ({
  ...config,
  files: ["frontend/**/*.{js,jsx,ts,tsx}"],
}));

const frontendTsConfig = nextTs.map((config) => ({
  ...config,
  files: ["frontend/**/*.{js,jsx,ts,tsx}"],
}));

// Backend config for JavaScript files
const backendJsConfig = {
  files: ["backend/**/*.js"],
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    globals: {
      console: "readonly",
      process: "readonly",
      Buffer: "readonly",
      __dirname: "readonly",
      __filename: "readonly",
      module: "readonly",
      require: "readonly",
      exports: "readonly",
      global: "readonly",
      jest: "readonly",
      describe: "readonly",
      it: "readonly",
      expect: "readonly",
      beforeEach: "readonly",
      afterEach: "readonly",
    },
  },
  rules: {
    "no-console": "warn",
    "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "prefer-const": "warn",
  },
};

// Backend config for TypeScript source files (.ts but not .d.ts)
const backendTsConfig = {
  files: ["backend/**/*.ts"],
  ignores: ["**/*.d.ts"],
  languageOptions: {
    parser: tsParser,
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      project: "./backend/tsconfig.json",
    },
    globals: {
      console: "readonly",
      process: "readonly",
      Buffer: "readonly",
      __dirname: "readonly",
      __filename: "readonly",
      module: "readonly",
      require: "readonly",
      exports: "readonly",
      global: "readonly",
      jest: "readonly",
      describe: "readonly",
      it: "readonly",
      expect: "readonly",
      beforeEach: "readonly",
      afterEach: "readonly",
    },
  },
  plugins: {
    "@typescript-eslint": tsPlugin,
  },
  rules: {
    "no-console": "warn",
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "prefer-const": "warn",
  },
};

// Backend config for TypeScript declaration files (.d.ts)
const backendDtsConfig = {
  files: ["backend/**/*.d.ts"],
  languageOptions: {
    parser: tsParser,
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
    },
    globals: {
      console: "readonly",
      process: "readonly",
      Buffer: "readonly",
      __dirname: "readonly",
      __filename: "readonly",
      module: "readonly",
      require: "readonly",
      exports: "readonly",
      global: "readonly",
      jest: "readonly",
      describe: "readonly",
      it: "readonly",
      expect: "readonly",
      beforeEach: "readonly",
      afterEach: "readonly",
    },
  },
  plugins: {
    "@typescript-eslint": tsPlugin,
  },
  rules: {
    "no-console": "warn",
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "prefer-const": "warn",
  },
};

const eslintConfig = defineConfig([
  ...frontendConfig,
  ...frontendTsConfig,
  backendJsConfig,
  backendTsConfig,
  backendDtsConfig,
  prettier,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "cdk.out/**",
    "node_modules/**",
  ]),
  {
    files: ["frontend/**/*.{ts,tsx,js,jsx}"],
    rules: {
      // Disable no-html-link-for-pages rule since we're using App Router, not Pages Router
      "@next/next/no-html-link-for-pages": "off",
    },
  },
  {
    files: ["frontend/lib/graphql/client.ts"],
    rules: {
      // Allow unknown type in this specific file due to GraphQL type conflicts
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      // Allow @ts-ignore due to type conflicts between GraphQL versions
      "@typescript-eslint/ban-ts-comment": "off",
    },
  },
]);

export default eslintConfig;
