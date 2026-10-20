/** Vocabulario de dominio de inscripciones. Ver docs/adr/0001-representacion-enums.md. */

/**
 * Estado de una inscripción (TRD §4.1), calculado por el api. Hoy el api nunca emite
 * `bonificado`: una inscripción 100% bonificada o con monto 0 vuelve como `pagado`.
 */
export const EstadoInscripcion = {
  PENDIENTE: 'pendiente',
  PARCIAL: 'parcial',
  PAGADO: 'pagado',
  BONIFICADO: 'bonificado',
} as const;
export type EstadoInscripcion = (typeof EstadoInscripcion)[keyof typeof EstadoInscripcion];

/** Tipo de inscripción: GRUPO (grupo local) o SCOUT_ARGENTINA (nacional). */
export const TipoInscripcion = {
  GRUPO: 'grupo',
  SCOUT_ARGENTINA: 'scout_argentina',
} as const;
export type TipoInscripcion = (typeof TipoInscripcion)[keyof typeof TipoInscripcion];

/**
 * Filtro de deudores en inscripciones: qué deben. Sin filtro, cualquier deudor
 * (documentación O dinero).
 */
export const TipoDeuda = {
  /** Solo documentación faltante (solo SCOUT_ARGENTINA). */
  DOCUMENTACION: 'documentacion',
  /** Solo dinero adeudado (saldoPendiente > 0). */
  DINERO: 'dinero',
  /** Dinero Y documentación. */
  AMBOS: 'ambos',
} as const;
export type TipoDeuda = (typeof TipoDeuda)[keyof typeof TipoDeuda];
