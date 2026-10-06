import type { ZodError } from 'zod';

/**
 * Colapsa los issues de un `ZodError` a un mapa `campo → primer mensaje`, listo
 * para alimentar el prop `error` de cada campo. Solo el primer issue por campo
 * (el más relevante para el usuario). Inmutable: construye un objeto nuevo.
 * Port de mi-tienda (`shared/forms/field-errors.ts`).
 */
export function collectFieldErrors(error: ZodError): Record<string, string> {
  return error.issues.reduce<Record<string, string>>((acc, issue) => {
    const field = issue.path[0];
    if (typeof field !== 'string' || field in acc) return acc;
    return { ...acc, [field]: issue.message };
  }, {});
}
