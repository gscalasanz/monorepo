import { CONCEPTO_MOVIMIENTO, type ConceptoMovimiento } from '@/shared/domain';

/**
 * Conceptos que solo mueven plata entre cajas del grupo (cada uno tiene su contraparte):
 * cuentan para el saldo pero no son ingreso ni egreso real del mes.
 */
export const INTERNAL_TRANSFER_CONCEPTOS: ReadonlySet<ConceptoMovimiento> = new Set([
  CONCEPTO_MOVIMIENTO.TRANSFERENCIA_ENTRE_CAJAS,
  CONCEPTO_MOVIMIENTO.TRANSFERENCIA_SALDO_PERSONAL,
  CONCEPTO_MOVIMIENTO.ASIGNACION_FONDO_RAMA,
  CONCEPTO_MOVIMIENTO.USO_SALDO_PERSONAL,
  CONCEPTO_MOVIMIENTO.BONIFICACION_OTORGADA,
  CONCEPTO_MOVIMIENTO.BONIFICACION_RECIBIDA,
]);

export const FLOW_LOCALE = 'es-AR';
export const FLOW_PERCENT_FRACTION_DIGITS = 1;
export const MONTHS_PER_YEAR = 12;
/** Largo del `YYYY-MM` dentro de un `YYYY-MM-DD`. */
export const MONTH_KEY_LENGTH = 7;

/** Ventana del gráfico de evolución (máximo del toggle 6m/12m). */
export const HISTORY_MONTHS = 12;
/** Tope de páginas (de 100) del historial: protege de un grupo con miles de movimientos. */
export const MAX_HISTORY_PAGES = 30;

/** Meses que dibuja la sparkline de cada métrica. */
export const SPARKLINE_MONTHS = 8;
