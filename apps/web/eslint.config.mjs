import featureBoundaries from './eslint/feature-boundaries.mjs';
import noNewDate from './eslint/no-new-date.mjs';
import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const CODE_LIMITS = { maxParams: 2, maxFunctionLines: 50, maxFileLines: 400 };

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Contrato del repo: prohibido `any` sin justificar (CLAUDE.md §6).
      '@typescript-eslint/no-explicit-any': 'error',
      // Tamaño (CLAUDE.md §6): ≤2 params posicionales, funciones ≤50, archivos ≤400.
      'max-params': ['error', CODE_LIMITS.maxParams],
      'max-lines-per-function': [
        'error',
        {
          max: CODE_LIMITS.maxFunctionLines,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
      'max-lines': ['error', CODE_LIMITS.maxFileLines],
    },
  },
  {
    // Tests y fixtures: describe/it largos y datos de ejemplo son legítimos.
    files: ['**/*.test.{ts,tsx}', '**/testing/**', '**/fixtures/**', 'e2e/**'],
    rules: {
      'max-params': 'off',
      'max-lines-per-function': 'off',
      'max-lines': 'off',
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
