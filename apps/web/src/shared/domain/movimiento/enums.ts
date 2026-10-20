/**
 * Enums de movimiento. La definición vive en `@scout/shared/enums` (única para web y api);
 * acá se re-exporta con el nombre histórico del front (adaptador). Los `*_LABELS` son copy
 * de UI y se quedan en web.
 */
import {
  CategoriaMovimiento as CATEGORIA_MOVIMIENTO,
  ConceptoMovimiento as CONCEPTO_MOVIMIENTO,
  EstadoPago as ESTADO_PAGO,
  FiltroMovimientosCampamento as FILTRO_MOVIMIENTOS,
  MedioPago as MEDIO_PAGO,
  TipoMovimiento as TIPO_MOVIMIENTO,
  type CategoriaMovimiento,
  type ConceptoMovimiento,
  type EstadoPago,
  type MedioPago,
  type TipoMovimiento,
  VENTA_DERIVED_CONCEPTOS,
} from '@scout/shared/enums';

export { VENTA_DERIVED_CONCEPTOS };
export { CATEGORIA_MOVIMIENTO, CONCEPTO_MOVIMIENTO, ESTADO_PAGO, FILTRO_MOVIMIENTOS, MEDIO_PAGO, TIPO_MOVIMIENTO };
export type { CategoriaMovimiento, ConceptoMovimiento, EstadoPago, MedioPago, TipoMovimiento };

export const TIPO_MOVIMIENTO_LABELS: Readonly<Record<TipoMovimiento, string>> =
  {
    ingreso: 'Ingreso',
    egreso: 'Egreso',
  };

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

export const MEDIOS_PAGO: readonly MedioPago[] = Object.values(MEDIO_PAGO);

export const MEDIO_PAGO_LABELS: Readonly<Record<MedioPago, string>> = {
  efectivo: 'Efectivo',
  transferencia: 'Transferencia',
  saldo_personal: 'Saldo Personal',
  mixto: 'Mixto',
};

export const ESTADO_PAGO_LABELS: Readonly<Record<EstadoPago, string>> = {
  pagado: 'Pagado',
  pendiente_reembolso: 'Pendiente de Reembolso',
  pendiente_cobro: 'A cobrar',
};

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
