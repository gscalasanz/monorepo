// @ts-check
import boundaries from 'eslint-plugin-boundaries';

/**
 * Fronteras entre features de `apps/web` (estructura-frontend.md §"Las 3 reglas").
 * Hace estructural la garantía "borrar la carpeta de un feature no rompe nada":
 *  - un `feature` NO importa de otro `feature` (solo de sí mismo + `shared`);
 *  - un `feature` solo se importa por su barrel (`index.ts`), nunca sus internals;
 *  - `app/` (routing) puede importar features y `shared`.
 *
 * A diferencia de las fronteras del monorepo, estas viven todas dentro de `web` y
 * se resuelven por ruta de archivo → es el caso natural de `eslint-plugin-boundaries`.
 * El plugin se importa acá adentro, así solo `packages/config` necesita la dependencia.
 *
 * Nota: el resolver `node` con extensiones TS alcanza para imports relativos. La
 * resolución del alias `@/...` (cuando `web` tenga features reales) se suma con
 * `eslint-import-resolver-typescript` en el config de la app.
 */

const SAME_FEATURE = ['feature', { feature: '${from.feature}' }];
const FEATURE_ENTRY = ['index.ts', 'index.tsx'];

const elements = [
  { type: 'app', pattern: 'src/app', mode: 'folder' },
  { type: 'feature', pattern: 'src/features/*', mode: 'folder', capture: ['feature'] },
  { type: 'shared', pattern: 'src/shared', mode: 'folder' },
];

const elementTypes = [
  'error',
  {
    default: 'disallow',
    message: 'Import prohibido entre capas: ${file.type} → ${dependency.type} (ver estructura-frontend.md).',
    rules: [
      { from: ['feature'], allow: [SAME_FEATURE, 'shared'] },
      { from: ['app'], allow: ['feature', 'shared'] },
      { from: ['shared'], allow: ['shared'] },
    ],
  },
];

const entryPoint = [
  'error',
  {
    default: 'disallow',
    message: 'De un feature solo se importa su barrel `index.ts`, no sus internals.',
    rules: [
      { target: ['feature'], allow: FEATURE_ENTRY },
      { target: ['app', 'shared'], allow: '**' },
    ],
  },
];

const config = [
  {
    name: 'scout/feature-boundaries',
    files: ['src/**/*.{ts,tsx}'],
    plugins: { boundaries },
    settings: {
      'boundaries/elements': elements,
      'import/resolver': {
        node: { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
      },
    },
    rules: {
      'boundaries/element-types': elementTypes,
      'boundaries/entry-point': entryPoint,
    },
  },
];

export default config;
