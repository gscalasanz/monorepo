/** Enums de inscripción — espejo de `backend/src/common/enums/index.ts`. */

export const TIPO_INSCRIPCION = {
  GRUPO: 'grupo',
  SCOUT_ARGENTINA: 'scout_argentina',
} as const;

export type TipoInscripcion = (typeof TIPO_INSCRIPCION)[keyof typeof TIPO_INSCRIPCION];

export const TIPO_INSCRIPCION_LABELS: Readonly<Record<TipoInscripcion, string>> = {
  grupo: 'Grupo',
  scout_argentina: 'Scout Argentina',
};

/**
 * Estado calculado por el backend. Ojo: hoy el backend nunca emite `bonificado`
 * (una inscripción 100% bonificada o con monto 0 vuelve como `pagado`).
 */
export const ESTADO_INSCRIPCION = {
  PENDIENTE: 'pendiente',
  PARCIAL: 'parcial',
  PAGADO: 'pagado',
  BONIFICADO: 'bonificado',
} as const;

export type EstadoInscripcion = (typeof ESTADO_INSCRIPCION)[keyof typeof ESTADO_INSCRIPCION];

export const ESTADO_INSCRIPCION_LABELS: Readonly<Record<EstadoInscripcion, string>> = {
  pendiente: 'Pendiente',
  parcial: 'Pago Parcial',
  pagado: 'Pagado',
  bonificado: 'Bonificado',
};

/** Filtro de deudores: dinero, documentación (solo Scout Argentina) o ambos. */
export const TIPO_DEUDA = {
  DOCUMENTACION: 'documentacion',
  DINERO: 'dinero',
  AMBOS: 'ambos',
} as const;

export type TipoDeuda = (typeof TIPO_DEUDA)[keyof typeof TIPO_DEUDA];

/** Valor de `rama` en `/inscripciones` para filtrar educadores (singular acá). */
export const INSCRIPCIONES_RAMA_EDUCADOR = 'educador';
