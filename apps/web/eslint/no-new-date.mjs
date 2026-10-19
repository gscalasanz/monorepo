// @ts-check

/**
 * Regla `no-new-Date` — hace estructural la regla de timezone (TR-DATA-8).
 *
 * Prohíbe `new Date()` y `Date.now()` "pelados" en lógica de negocio: toda lectura
 * del reloj / derivación de "el día" pasa por el módulo `time` de `packages/shared`
 * (`nowUtc()`, `todayBsAs()`, …), que ancla la zona `America/Argentina/Buenos_Aires`.
 *
 * Es un array de bloques flat-config: lo importan directamente las apps y paquetes
 * (web, api, shared), ya que `web` no extiende el `base` compartido.
 */

const TIME_MODULE_HINT =
  'Usá `@/shared/time` (nowInstant/todayBsAs…). `new Date()` y `Date.now()` ' +
  'pelados están prohibidos fuera de src/shared/time/ (regla de timezone TR-DATA-8).';

/**
 * Globs exentos: el módulo `time` (única vía autorizada a construir fechas crudas)
 * y los archivos de test/type-test (no son lógica de negocio; un `.type-test.ts`
 * incluso usa `new Date()` para *afirmar* que un Date crudo no es un `Instant`).
 */
const EXEMPT_GLOBS = [
  'src/shared/time/**',
  '**/*.test.{ts,tsx}',
  '**/*.spec.{ts,tsx}',
  '**/*.type-test.ts',
];

const restrictedSyntax = [
  { selector: 'NewExpression[callee.name="Date"]', message: TIME_MODULE_HINT },
  {
    selector: 'CallExpression[callee.object.name="Date"][callee.property.name="now"]',
    message: TIME_MODULE_HINT,
  },
];

const config = [
  {
    name: 'scout/no-new-date',
    rules: {
      'no-restricted-syntax': ['error', ...restrictedSyntax],
    },
  },
  {
    name: 'scout/no-new-date/exemptions',
    files: EXEMPT_GLOBS,
    rules: {
      'no-restricted-syntax': 'off',
    },
  },
];

export default config;
