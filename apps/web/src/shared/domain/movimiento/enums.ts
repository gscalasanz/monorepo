/** Enums de movimiento — espejo de `backend/src/common/enums/index.ts`. */

export const TIPO_MOVIMIENTO = {
  INGRESO: 'ingreso',
  EGRESO: 'egreso',
} as const;

export type TipoMovimiento =
  (typeof TIPO_MOVIMIENTO)[keyof typeof TIPO_MOVIMIENTO];

export const TIPO_MOVIMIENTO_LABELS: Readonly<Record<TipoMovimiento, string>> =
  {
    ingreso: 'Ingreso',
    egreso: 'Egreso',
  };

export const CONCEPTO_MOVIMIENTO = {
  INSCRIPCION_GRUPO: 'inscripcion_grupo',
  INSCRIPCION_SCOUT_ARGENTINA: 'inscripcion_scout_argentina',
  INSCRIPCION_PAGO_SCOUT_ARGENTINA: 'inscripcion_pago_scout_argentina',
  CAMPAMENTO_PAGO: 'campamento_pago',
  CAMPAMENTO_GASTO: 'campamento_gasto',
  /** Ingreso: ganancia (margen) de la venta, no recaudación. */
  EVENTO_VENTA_INGRESO: 'evento_venta_ingreso',
  EVENTO_VENTA_GASTO: 'evento_venta_gasto',
  /** Ingreso a caja grupo: recupero del costo (solo destino cuentas_personales). */
  EVENTO_VENTA_RECUPERO_COSTO: 'evento_venta_recupero_costo',
  EVENTO_GRUPO_INGRESO: 'evento_grupo_ingreso',
  EVENTO_GRUPO_GASTO: 'evento_grupo_gasto',
  GASTO_GENERAL: 'gasto_general',
  REEMBOLSO: 'reembolso',
  AJUSTE_INICIAL: 'ajuste_inicial',
  ASIGNACION_FONDO_RAMA: 'asignacion_fondo_rama',
  TRANSFERENCIA_SALDO_PERSONAL: 'transferencia_saldo_personal',
  TRANSFERENCIA_ENTRE_CAJAS: 'transferencia_entre_cajas',
  USO_SALDO_PERSONAL: 'uso_saldo_personal',
  /** Egreso del fondo solidario: ayuda otorgada a una persona. */
  BONIFICACION_OTORGADA: 'bonificacion_otorgada',
  /** Ingreso a la caja grupo: contraparte de la bonificación otorgada. */
  BONIFICACION_RECIBIDA: 'bonificacion_recibida',
} as const;

export type ConceptoMovimiento =
  (typeof CONCEPTO_MOVIMIENTO)[keyof typeof CONCEPTO_MOVIMIENTO];

export const CONCEPTO_MOVIMIENTO_LABELS: Readonly<
  Record<ConceptoMovimiento, string>
> = {
  inscripcion_grupo: 'Inscripción de Grupo',
  inscripcion_scout_argentina: 'Inscripción Scout Argentina',
  inscripcion_pago_scout_argentina: 'Pago a Scout Argentina',
  campamento_pago: 'Pago de Campamento',
  campamento_gasto: 'Gasto de Campamento',
  evento_venta_ingreso: 'Ingreso Evento de Venta',
  evento_venta_gasto: 'Gasto Evento de Venta',
  evento_venta_recupero_costo: 'Recupero de Costo (Evento de Venta)',
  evento_grupo_ingreso: 'Ingreso Evento de Grupo',
  evento_grupo_gasto: 'Gasto Evento de Grupo',
  gasto_general: 'Gasto General',
  reembolso: 'Reembolso',
  ajuste_inicial: 'Ajuste Inicial',
  asignacion_fondo_rama: 'Asignación a Fondo de Rama',
  transferencia_saldo_personal: 'Transferencia de Saldo Personal',
  transferencia_entre_cajas: 'Transferencia entre Cajas',
  uso_saldo_personal: 'Uso de Saldo Personal',
  bonificacion_otorgada: 'Bonificación Otorgada',
  bonificacion_recibida: 'Bonificación Recibida',
};

/** Conceptos derivados de ventas (espejo de `VENTA_DERIVED_CONCEPTOS` del backend). */
export const VENTA_DERIVED_CONCEPTOS: readonly ConceptoMovimiento[] = [
  CONCEPTO_MOVIMIENTO.EVENTO_VENTA_INGRESO,
  CONCEPTO_MOVIMIENTO.EVENTO_VENTA_GASTO,
  CONCEPTO_MOVIMIENTO.EVENTO_VENTA_RECUPERO_COSTO,
];

export const MEDIO_PAGO = {
  EFECTIVO: 'efectivo',
  TRANSFERENCIA: 'transferencia',
  SALDO_PERSONAL: 'saldo_personal',
  MIXTO: 'mixto',
} as const;

export type MedioPago = (typeof MEDIO_PAGO)[keyof typeof MEDIO_PAGO];

export const MEDIOS_PAGO: readonly MedioPago[] = Object.values(MEDIO_PAGO);

export const MEDIO_PAGO_LABELS: Readonly<Record<MedioPago, string>> = {
  efectivo: 'Efectivo',
  transferencia: 'Transferencia',
  saldo_personal: 'Saldo Personal',
  mixto: 'Mixto',
};

export const ESTADO_PAGO = {
  PAGADO: 'pagado',
  PENDIENTE_REEMBOLSO: 'pendiente_reembolso',
  /** Ingreso registrado cuya plata todavía no entró: no afecta el saldo. */
  PENDIENTE_COBRO: 'pendiente_cobro',
} as const;

export type EstadoPago = (typeof ESTADO_PAGO)[keyof typeof ESTADO_PAGO];

export const ESTADO_PAGO_LABELS: Readonly<Record<EstadoPago, string>> = {
  pagado: 'Pagado',
  pendiente_reembolso: 'Pendiente de Reembolso',
  pendiente_cobro: 'A cobrar',
};

/** Eje ortogonal al concepto, usado en reportes. */
export const CATEGORIA_MOVIMIENTO = {
  INSUMOS: 'insumos',
  COMIDA: 'comida',
  TRANSPORTE: 'transporte',
  ALQUILER: 'alquiler',
  SERVICIOS: 'servicios',
  MATERIAL_DIDACTICO: 'material_didactico',
  MANTENIMIENTO: 'mantenimiento',
  OTROS: 'otros',
} as const;

export type CategoriaMovimiento =
  (typeof CATEGORIA_MOVIMIENTO)[keyof typeof CATEGORIA_MOVIMIENTO];

export const CATEGORIA_MOVIMIENTO_LABELS: Readonly<
  Record<CategoriaMovimiento, string>
> = {
  insumos: 'Insumos',
  comida: 'Comida',
  transporte: 'Transporte',
  alquiler: 'Alquiler',
  servicios: 'Servicios',
  material_didactico: 'Material Didáctico',
  mantenimiento: 'Mantenimiento',
  otros: 'Otros',
};

/** Filtro de movimientos de campamentos y eventos (`FiltroMovimientosCampamento` del backend). */
export const FILTRO_MOVIMIENTOS = {
  TODOS: 'todos',
  INGRESOS: 'ingresos',
  EGRESOS: 'egresos',
  GASTOS: 'gastos',
} as const;

export type FiltroMovimientos =
  (typeof FILTRO_MOVIMIENTOS)[keyof typeof FILTRO_MOVIMIENTOS];

export const FILTRO_MOVIMIENTOS_LABELS: Readonly<
  Record<FiltroMovimientos, string>
> = {
  todos: 'Todos',
  ingresos: 'Ingresos',
  egresos: 'Egresos',
  gastos: 'Gastos',
};
