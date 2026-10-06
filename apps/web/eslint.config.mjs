import featureBoundaries from './eslint/feature-boundaries.mjs';
import noNewDate from './eslint/no-new-date.mjs';
import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Contrato del repo: prohibido `any` sin justificar (CLAUDE.md §6).
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
  // Fronteras (copiadas de mi-tienda): regla de timezone + features aisladas.
  ...noNewDate,
  ...featureBoundaries,
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'coverage/**',
    'playwright-report/**',
    'test-results/**',
    'design-directions/**',
    // ReUI vendorizado (shadcn registry): código de terceros, sí pasa por typecheck.
    'src/shared/components/reui/**',
  ]),
]);

export default eslintConfig;
