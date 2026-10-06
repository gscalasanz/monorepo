/**
 * `@/shared/components/finanzas` — piezas financieras compartidas por
 * campamentos y eventos: card de movimiento, filtros, confirm de reembolso y
 * diálogos de gasto / ingreso.
 */
export { FINANZAS_COPY, DESCRIPCION_MAX_LENGTH } from './copy';
export type { MovimientoCardData } from './types';
export { MovimientoCard, type MovimientoCardProps } from './movimiento-card';
export {
  EstadoPagoBadge,
  type EstadoPagoBadgeProps,
} from './estado-pago-badge';
export {
  MovimientoFilterTabs,
  type MovimientoFilterTabsProps,
} from './movimiento-filter-tabs';
export {
  MOVIMIENTO_FILTER_ITEMS,
  filterMovimientosBy,
  type FilterMovimientosByParams,
  type FilterableByTipo,
} from './movimiento-filter';
export {
  confirmPagarReembolso,
  type ConfirmPagarReembolsoParams,
} from './confirm-pagar-reembolso';
export {
  GastoFormDialog,
  type GastoFormDialogProps,
} from './gasto-form-dialog';
export {
  GASTO_ESTADO_PAGO_OPTIONS,
  GASTO_MEDIO_PAGO_OPTIONS,
  gastoFieldsSchema,
  gastoFormSchema,
  initialGastoDraft,
  toGastoDto,
  toGastoEventoDto,
  type GastoEstadoPago,
  type GastoFormDraft,
  type GastoFormValues,
  type GastoMedioPago,
} from './gasto-form-schema';
export { withEstadoPago, withResponsable } from './gasto-form-transitions';
export {
  IngresoFormDialog,
  type IngresoFormDialogProps,
} from './ingreso-form-dialog';
export {
  INGRESO_MEDIO_PAGO_OPTIONS,
  ingresoFormSchema,
  toIngresoDto,
  type IngresoFormDraft,
  type IngresoFormValues,
} from './ingreso-form-schema';
export {
  FormDialogShell,
  type FormDialogShellProps,
} from './form-dialog-shell';
export {
  useDialogSubmit,
  type DialogSubmit,
  type DialogSubmitOptions,
} from './use-dialog-submit';
