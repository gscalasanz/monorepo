// @ts-check

/**
 * Regla `no-new-Date`: hace estructural la regla de timezone (TR-DATA-8).
 *
 * Prohíbe `new Date()` y `Date.now()` "pelados" en lógica de negocio: toda lectura del
 * reloj o derivación de "el día" pasa por el módulo `time` (`@scout/shared/time`, que web
 * re-exporta como `@/shared/time`), anclado a `America/Argentina/Buenos_Aires`.
 *
 * Se arma con `no-restricted-syntax` (sin plugin propio). Cada app/paquete usa su preset
 * porque cambia dónde vive el módulo `time` exento y a qué import apunta el mensaje.
 */

/** @typedef {'warn' | 'error'} Severity */
/** @typedef {{ name: string, hint: string, exempt: string[], severity?: Severity }} NoNewDateOptions */

/** Tests y type-tests no son lógica de negocio (un `.type-test.ts` usa `new Date()` para afirmar tipos). */
const TEST_GLOBS = [
  '**/*.test.{ts,tsx}',
  '**/*.spec.{ts,tsx}',
  '**/*.e2e-spec.ts',
  '**/*.type-test.ts',
];

const hint = (importPath, exemptDir) =>
  `Usá \`${importPath}\` (nowInstant/todayBsAs…). \`new Date()\` y \`Date.now()\` ` +
  `pelados están prohibidos fuera de ${exemptDir} (regla de timezone TR-DATA-8).`;

/**
 * Construye el array de bloques flat-config de la regla.
 * @param {NoNewDateOptions} options
 */
export function createNoNewDate({ name, hint: message, exempt, severity = 'error' }) {
  const restrictedSyntax = [
    { selector: 'NewExpression[callee.name="Date"]', message },
    {
      selector: 'CallExpression[callee.object.name="Date"][callee.property.name="now"]',
      message,
    },
  ];
  return [
    { name: `scout/no-new-date/${name}`, rules: { 'no-restricted-syntax': [severity, ...restrictedSyntax] } },
    {
      name: `scout/no-new-date/${name}/exemptions`,
      files: [...exempt, ...TEST_GLOBS],
      rules: { 'no-restricted-syntax': 'off' },
    },
  ];
}

/** @type {Record<'web' | 'api' | 'packages', NoNewDateOptions>} */
export const NO_NEW_DATE_OPTIONS = {
  web: {
    name: 'web',
    hint: hint('@/shared/time', 'src/shared/time/'),
    exempt: ['src/shared/time/**'],
  },
  api: {
    name: 'api',
    hint: hint('@scout/shared/time', 'packages/shared/src/time/'),
    // Las migraciones las genera TypeORM y no se editan a mano.
    exempt: ['src/database/migrations/**'],
  },
  packages: {
    name: 'packages',
    hint: hint('./time', 'src/time/'),
    exempt: ['src/time/**'],
  },
};

export const noNewDatePresets = {
  web: createNoNewDate(NO_NEW_DATE_OPTIONS.web),
  api: createNoNewDate(NO_NEW_DATE_OPTIONS.api),
  packages: createNoNewDate(NO_NEW_DATE_OPTIONS.packages),
};
