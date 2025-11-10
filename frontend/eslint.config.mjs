import { FlatCompat } from "@eslint/eslintrc";
import prettier from "eslint-config-prettier";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  prettier,
  {
    ignores: [".next/**", "out/**", "build/**", "next-env.d.ts"],
  },
  {
    rules: {
      // Disable no-html-link-for-pages rule since we're using App Router, not Pages Router
      "@next/next/no-html-link-for-pages": "off",
    },
  },
];

export default eslintConfig;
