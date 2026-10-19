// @ts-check

/**
 * Fronteras del monorepo (regla del monorepo de `flujo-confiable.md` L2):
 *  - `packages/*` NO importa de `apps/*`.
 *  - `web` y `api` NO se importan entre sí.
 *
 * Estas fronteras son cruzadas-entre-paquetes: en el lint de cada paquete los imports
 * cruzados aparecen como especificadores (`@scout/api`) o rutas relativas hacia
 * `apps/*`, no como rutas resolubles del grafo de `eslint-plugin-boundaries`. Por eso
 * se enforzan con `no-restricted-imports` (paths + patterns), un bloque por paquete.
 */

/**
 * Construye un bloque flat-config con `no-restricted-imports`.
 * @param {{ paths?: { name: string, message: string }[], patterns?: { group: string[], message: string }[] }} options
 */
function monorepoBoundaries({ paths = [], patterns = [] }) {
  return {
    name: 'scout/monorepo-boundaries',
    rules: {
      'no-restricted-imports': ['error', { paths, patterns }],
    },
  };
}

const forbid = (name, message) => ({ name, message });
const forbidPattern = (group, message) => ({ group, message });

const APPS_MSG = 'Un paquete de `packages/*` no puede importar de `apps/*` (regla del monorepo).';
const WEB_TO_API_MSG = '`web` no puede importar de `api`. Lo compartido va en `@scout/shared`.';
const API_TO_WEB_MSG = '`api` no puede importar de `web`. Lo compartido va en `@scout/shared`.';

/** Para `packages/*` (shared, db, …): prohíbe ambas apps. */
export const packagesPreset = monorepoBoundaries({
  paths: [forbid('@scout/web', APPS_MSG), forbid('@scout/api', APPS_MSG)],
  patterns: [forbidPattern(['**/apps/**'], APPS_MSG)],
});

/** Para `apps/web`: prohíbe importar `api`. */
export const webPreset = monorepoBoundaries({
  paths: [forbid('@scout/api', WEB_TO_API_MSG)],
  patterns: [forbidPattern(['**/apps/api', '**/apps/api/**'], WEB_TO_API_MSG)],
});

/** Para `apps/api`: prohíbe importar `web`. */
export const apiPreset = monorepoBoundaries({
  paths: [forbid('@scout/web', API_TO_WEB_MSG)],
  patterns: [forbidPattern(['**/apps/web', '**/apps/web/**'], API_TO_WEB_MSG)],
});

export { monorepoBoundaries };
