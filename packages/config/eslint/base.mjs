import js from "@eslint/js";
import tseslint from "typescript-eslint";

/**
 * Base ESLint (flat config) compartida por el monorepo.
 * Las reglas de boundaries (imports cruzados entre features/apps) se agregan
 * en su propia story (ver plan F0). Acá: recommended + prohibir `any`.
 */
export default tseslint.config(
  {
    ignores: [
      "**/dist/**",
      "**/.next/**",
      "**/.turbo/**",
      "**/node_modules/**",
      "**/coverage/**",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
    },
  },
);
