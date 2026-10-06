import type { EstadoPago, MedioPago, TipoMovimiento } from '@/shared/domain';

/**
 * Forma mínima que necesita `MovimientoCard` (port de `MovimientoCardVM`). La
 * satisfacen los movimientos del detalle de campamento y los de eventos.
 */
export interface MovimientoCardData {
  readonly id: string;
  /** `Date`, ISO o `YYYY-MM-DD` (se formatea con `@/shared/time`). */
  readonly fecha: Date | string;
  readonly tipo: TipoMovimiento;
  readonly concepto?: string;
  readonly monto: number;
  readonly descripcion?: string | null;
  readonly medioPago: MedioPago;
  readonly estadoPago: EstadoPago;
  readonly responsableNombre: string;
}
