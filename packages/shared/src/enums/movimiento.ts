/** Vocabulario de dominio de movimientos. Ver docs/adr/0001-representacion-enums.md. */

/** Tipo de movimiento (PRD §3.6, F14). */
export const TipoMovimiento = {
  INGRESO: 'ingreso',
  EGRESO: 'egreso',
} as const;
export type TipoMovimiento = (typeof TipoMovimiento)[keyof typeof TipoMovimiento];

/** Concepto de un movimiento: cubre todos los flujos financieros (TRD §4.1). */
export const ConceptoMovimiento = {
  // Inscripciones
  /** Ingreso: cobro de inscripción de grupo. */
  INSCRIPCION_GRUPO: 'inscripcion_grupo',
  /** Ingreso: cobro de inscripción Scout Argentina. */
  INSCRIPCION_SCOUT_ARGENTINA: 'inscripcion_scout_argentina',
  /** Egreso: pago a Scout Argentina. */
  INSCRIPCION_PAGO_SCOUT_ARGENTINA: 'inscripcion_pago_scout_argentina',

  // Campamentos
  /** Ingreso: pago de un participante. */
  CAMPAMENTO_PAGO: 'campamento_pago',
  /** Egreso: gasto del campamento. */
  CAMPAMENTO_GASTO: 'campamento_gasto',

  // Eventos de venta
  /** Ingreso: ganancia (margen) de la venta. */
  EVENTO_VENTA_INGRESO: 'evento_venta_ingreso',
  /** Egreso: gastos del evento. */
  EVENTO_VENTA_GASTO: 'evento_venta_gasto',
  /** Ingreso a caja grupo: recupero del costo de lo vendido (solo destino cuentas_personales). */
  EVENTO_VENTA_RECUPERO_COSTO: 'evento_venta_recupero_costo',

  // Eventos de grupo
  /** Ingreso: recaudación del evento. */
  EVENTO_GRUPO_INGRESO: 'evento_grupo_ingreso',
  /** Egreso: gastos del evento. */
  EVENTO_GRUPO_GASTO: 'evento_grupo_gasto',

  /** Egreso: gastos no asociados a eventos. */
  GASTO_GENERAL: 'gasto_general',
  /** Egreso: devolución a quien adelantó plata. */
  REEMBOLSO: 'reembolso',
  /** Carga de saldo inicial (migración). */
  AJUSTE_INICIAL: 'ajuste_inicial',
  /** Ingreso a fondo de rama (no es egreso de caja). */
  ASIGNACION_FONDO_RAMA: 'asignacion_fondo_rama',

  // Transferencias internas
  /** Transferencia total del saldo de una caja personal a la caja grupo. */
  TRANSFERENCIA_SALDO_PERSONAL: 'transferencia_saldo_personal',
  /** Fondos de una caja a otra (egreso + ingreso linkeados). */
  TRANSFERENCIA_ENTRE_CAJAS: 'transferencia_entre_cajas',

  /** Egreso desde caja personal para un pago. */
  USO_SALDO_PERSONAL: 'uso_saldo_personal',

  // Bonificaciones (fondo solidario)
  /** Egreso del fondo solidario: ayuda otorgada a una persona. */
  BONIFICACION_OTORGADA: 'bonificacion_otorgada',
  /**
   * Ingreso a la caja grupo: contraparte de la bonificación otorgada. Conserva
   * inscripcionId/campamentoId para trazabilidad, pero DEBE excluirse de todo cálculo de
   * "cuánto pagó esta persona": si no, cuenta doble contra montoBonificado.
   */
  BONIFICACION_RECIBIDA: 'bonificacion_recibida',
} as const;
export type ConceptoMovimiento = (typeof ConceptoMovimiento)[keyof typeof ConceptoMovimiento];

/**
 * Medio de pago (PRD §3.3, F8). Sin tarjetas. MIXTO: un pago que combina plata física
 * (efectivo/transferencia) con saldo de la cuenta personal.
 */
export const MedioPago = {
  EFECTIVO: 'efectivo',
  TRANSFERENCIA: 'transferencia',
  SALDO_PERSONAL: 'saldo_personal',
  MIXTO: 'mixto',
} as const;
export type MedioPago = (typeof MedioPago)[keyof typeof MedioPago];

/**
 * Estado de pago de un movimiento (TRD §4.1). Los dos PENDIENTE significan "registrado
 * pero la plata no cambió de manos", así que ninguno afecta el saldo de la caja:
 * - PENDIENTE_REEMBOLSO (egresos): pasivo; alguien pagó de su bolsillo y el grupo le debe.
 * - PENDIENTE_COBRO (ingresos): a cobrar; venta registrada pero no cobrada.
 */
export const EstadoPago = {
  PAGADO: 'pagado',
  PENDIENTE_REEMBOLSO: 'pendiente_reembolso',
  PENDIENTE_COBRO: 'pendiente_cobro',
} as const;
export type EstadoPago = (typeof EstadoPago)[keyof typeof EstadoPago];

/**
 * Categoría de un movimiento: eje ortogonal al concepto, para reportes. Nullable en DB
 * (filas legacy y conceptos donde no aplica).
 */
export const CategoriaMovimiento = {
  INSUMOS: 'insumos',
  COMIDA: 'comida',
  TRANSPORTE: 'transporte',
  ALQUILER: 'alquiler',
  SERVICIOS: 'servicios',
  MATERIAL_DIDACTICO: 'material_didactico',
  MANTENIMIENTO: 'mantenimiento',
  OTROS: 'otros',
} as const;
export type CategoriaMovimiento = (typeof CategoriaMovimiento)[keyof typeof CategoriaMovimiento];

/** Filtro de movimientos en el detalle de un campamento (web lo llama `FILTRO_MOVIMIENTOS`). */
export const FiltroMovimientosCampamento = {
  /** Todos (INGRESO + EGRESO, incluido USO_SALDO_PERSONAL). */
  TODOS: 'todos',
  /** Solo INGRESO (pagos recibidos). */
  INGRESOS: 'ingresos',
  /** Todos los EGRESO (incluido USO_SALDO_PERSONAL). */
  EGRESOS: 'egresos',
  /** Solo gastos reales (CAMPAMENTO_GASTO, sin USO_SALDO_PERSONAL). */
  GASTOS: 'gastos',
} as const;
export type FiltroMovimientosCampamento =
  (typeof FiltroMovimientosCampamento)[keyof typeof FiltroMovimientosCampamento];

/**
 * Conceptos que el sistema genera AUTOMÁTICAMENTE al registrar/borrar una venta de evento
 * (cascada de borrado, validación de borrado, backfills). Si un concepto nuevo nace de una
 * venta, se agrega acá una sola vez.
 */
export const VENTA_DERIVED_CONCEPTOS: readonly ConceptoMovimiento[] = [
  ConceptoMovimiento.EVENTO_VENTA_INGRESO,
  ConceptoMovimiento.EVENTO_VENTA_GASTO,
  ConceptoMovimiento.EVENTO_VENTA_RECUPERO_COSTO,
] as const;
