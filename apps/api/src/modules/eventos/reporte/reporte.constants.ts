/**
 * Constants for the event-report feature.
 *
 * A report "variant" is the discriminator that decides which contract and which
 * strategy apply. It is derived from (tipo, modalidadVenta, destinoGanancia):
 *   - venta + modalidad mixta     -> VENTA_MIXTA
 *   - venta + caja_grupo          -> VENTA_CAJA_GRUPO
 *   - venta + cuentas_personales  -> VENTA_CUENTAS_PERSONALES
 *   - grupo                       -> GRUPO
 */
// Variante y severidad son vocabulario de wire: se definen en @scout/shared.
export {
  REPORTE_SEVERIDAD,
  REPORTE_VARIANTE,
  type ReporteSeveridad,
  type ReporteVariante,
} from '@scout/shared/enums';

export const REPORTE_ROUTE_SEGMENT = 'reporte';

export const REPORTE_ERROR_MESSAGES = {
  VARIANTE_NO_RESOLVIBLE: (eventoId: string) =>
    `No se pudo resolver la variante de reporte para el evento ${eventoId}. ` +
    `Un evento de venta debe tener destinoGanancia definido.`,
  VARIANTE_SIN_STRATEGY: (variante: string) =>
    `No hay una estrategia de reporte registrada para la variante "${variante}".`,
} as const;

export const REPORTE_SWAGGER = {
  GET_SUMMARY: 'Reporte completo de un evento',
  GET_DESCRIPTION:
    'Devuelve un reporte con contrato variable según la variante del evento ' +
    '(venta+caja_grupo, venta+cuentas_personales, grupo). El campo "variante" ' +
    'discrimina la forma de la respuesta.',
  GET_RESPONSE_OK: 'Reporte del evento',
  GET_RESPONSE_NOT_FOUND: 'Evento no encontrado',
  GET_RESPONSE_BAD_REQUEST:
    'No se pudo resolver la variante (evento de venta sin destinoGanancia)',
  GET_PUBLIC_SUMMARY: 'Reporte público de un evento (sin autenticación)',
  GET_PUBLIC_DESCRIPTION:
    'Misma respuesta que el reporte interno, pero accesible sin login. Solo ' +
    'devuelve datos si el evento tiene reportePublico = true; de lo contrario ' +
    'responde 404 (no revela si el evento existe).',
  GET_PUBLIC_RESPONSE_NOT_FOUND:
    'El reporte no es público o el evento no existe',
} as const;
