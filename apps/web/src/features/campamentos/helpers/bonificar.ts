/** Bonificación contra el fondo solidario (port de `BonificarParticipanteDialogComponent`). */

export interface BonificarContext {
  readonly montoAsignado: number;
  readonly montoBonificadoActual: number;
  /** Ya pagado en efectivo/transferencia: no bonificable de nuevo. */
  readonly totalPagado: number;
  readonly saldoFondo: number;
}

export interface BonificarState {
  readonly monto: number;
  readonly maxBonificable: number;
  /** Lo que realmente sale del fondo: ajustar de 5.000 a 6.000 consume 1.000. */
  readonly adicional: number;
  readonly excedeAsignado: boolean;
  readonly saldoInsuficiente: boolean;
  readonly puedeConfirmar: boolean;
}

export function maxBonificable(ctx: BonificarContext): number {
  return Math.max(0, ctx.montoAsignado - ctx.totalPagado);
}

export function bonificarState(ctx: BonificarContext, monto: number | null): BonificarState {
  const value = monto ?? 0;
  const max = maxBonificable(ctx);
  const adicional = Math.max(0, value - ctx.montoBonificadoActual);
  const excedeAsignado = value > max;
  const saldoInsuficiente = adicional > ctx.saldoFondo;
  return {
    monto: value,
    maxBonificable: max,
    adicional,
    excedeAsignado,
    saldoInsuficiente,
    puedeConfirmar: monto !== null && value >= 0 && !excedeAsignado && !saldoInsuficiente,
  };
}

/** 0 → quitar la bonificación (DELETE); > 0 → fijar el total (PATCH). */
export type BonificarAction =
  | { readonly kind: 'quitar' }
  | { readonly kind: 'fijar'; readonly monto: number };

export function bonificarAction(monto: number): BonificarAction {
  return monto === 0 ? { kind: 'quitar' } : { kind: 'fijar', monto };
}
