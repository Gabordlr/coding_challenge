import { defineConfig, globalIgnores } from "eslint/config";
import prettier from "eslint-config-prettier";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";

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
  backendJsConfig,
  backendTsConfig,
  backendDtsConfig,
  prettier,
  // Global ignores
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "cdk.out/**",
    "node_modules/**",
    "frontend/**", // Frontend has its own ESLint config
  ]),
]);

export default eslintConfig;
