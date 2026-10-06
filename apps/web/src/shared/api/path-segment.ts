/**
 * Codifica un valor (id) para usarlo como UN segmento de path. Sin esto, un id
 * que viene de la URL (p. ej. `/eventos/[id]/reporte`, ruta pública) como
 * `../backups/download` haría que una request autenticada pegue a otro endpoint.
 */
const NAVIGATION_SEGMENTS: readonly string[] = ['', '.', '..'];

export function pathSegment(value: string): string {
  if (NAVIGATION_SEGMENTS.includes(value)) {
    throw new Error(`Segmento de path inválido: "${value}".`);
  }
  return encodeURIComponent(value);
}
