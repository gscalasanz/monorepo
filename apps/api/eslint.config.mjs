// @ts-check
import eslint from '@eslint/js';
import { apiPreset } from '@scout/config/eslint/monorepo-boundaries';
import { noNewDatePresets } from '@scout/config/eslint/no-new-date';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      "prettier/prettier": ["error", { endOfLine: "auto" }],
    },
  },
  // Fronteras (@scout/config): api ↛ web.
  apiPreset,
  // Fechas solo vía @scout/shared/time (error desde el cierre de MONOREPO.md Fase 8).
  ...noNewDatePresets.api,
);
