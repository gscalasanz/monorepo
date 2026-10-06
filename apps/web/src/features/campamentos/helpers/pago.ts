/**
 * Pago de campamento (mixto: efectivo/transferencia + saldo personal).
 * Port de la lógica de `PagoCampamentoDialogComponent` (modo alta).
 */
import {
  MEDIO_PAGO,
  type RegistrarPagoCampamentoDto,
} from '@/shared/domain';

const FULL_PERCENT = 100;

export const PAGO_MEDIOS = [MEDIO_PAGO.EFECTIVO, MEDIO_PAGO.TRANSFERENCIA] as const;
export type PagoMedio = (typeof PAGO_MEDIOS)[number];

export interface PagoContext {
  /** Asignado − bonificado. */
  readonly costoPorPersona: number;
  readonly totalPagado: number;
  readonly montoPendiente: number;
  readonly saldoCuentaPersonal: number;
}

export interface PagoDraft {
  readonly montoPagado: number | null;
  readonly montoConSaldoPersonal: number | null;
  readonly medioPago: PagoMedio | null;
  readonly descripcion: string;
}

export const INITIAL_PAGO_DRAFT: PagoDraft = {
  montoPagado: 0,
  montoConSaldoPersonal: 0,
  medioPago: MEDIO_PAGO.EFECTIVO,
  descripcion: '',
};

export interface PagoSummary {
  readonly montoPagado: number;
  readonly montoSaldo: number;
  readonly total: number;
  readonly maxSaldoUsable: number;
  readonly restante: number;
  readonly progress: number;
  readonly puedeUsarSaldo: boolean;
  readonly esMixto: boolean;
  readonly saldoExcedido: boolean;
  readonly medioFaltante: boolean;
  readonly invalid: boolean;
}

export function pagoProgress(ctx: PagoContext): number {
  if (ctx.costoPorPersona <= 0) return FULL_PERCENT;
  return Math.min(FULL_PERCENT, Math.round((ctx.totalPagado / ctx.costoPorPersona) * FULL_PERCENT));
}

export function pagoSummary(ctx: PagoContext, draft: PagoDraft): PagoSummary {
  const puedeUsarSaldo = ctx.saldoCuentaPersonal > 0;
  const montoPagado = draft.montoPagado ?? 0;
  const montoSaldo = puedeUsarSaldo ? (draft.montoConSaldoPersonal ?? 0) : 0;
  const total = montoPagado + montoSaldo;
  const saldoExcedido = montoSaldo > ctx.saldoCuentaPersonal;
  const medioFaltante = montoPagado > 0 && draft.medioPago === null;
  const negativo = montoPagado < 0 || montoSaldo < 0;
  return {
    montoPagado,
    montoSaldo,
    total,
    maxSaldoUsable: Math.min(ctx.saldoCuentaPersonal, ctx.montoPendiente),
    restante: Math.max(0, ctx.montoPendiente - total),
    progress: pagoProgress(ctx),
    puedeUsarSaldo,
    esMixto: montoPagado > 0 && montoSaldo > 0,
    saldoExcedido,
    medioFaltante,
    invalid:
      negativo || total <= 0 || total > ctx.montoPendiente || medioFaltante || saldoExcedido,
  };
}

/** "Pagar Todo (mixto)": primero saldo personal, el resto en efectivo. */
export function pagarTodoMixto(ctx: PagoContext): Partial<PagoDraft> {
  const saldo = Math.min(ctx.saldoCuentaPersonal, ctx.montoPendiente);
  return { montoConSaldoPersonal: saldo, montoPagado: ctx.montoPendiente - saldo };
}

/** "Solo Saldo": usa todo el saldo disponible (hasta lo pendiente). */
export function soloSaldo(ctx: PagoContext): Partial<PagoDraft> {
  return { montoConSaldoPersonal: Math.min(ctx.saldoCuentaPersonal, ctx.montoPendiente) };
}

/** "Solo Efectivo": todo lo pendiente por efectivo/transferencia. */
export function soloEfectivo(ctx: PagoContext): Partial<PagoDraft> {
  return { montoPagado: ctx.montoPendiente, montoConSaldoPersonal: 0 };
}

/** Body de `POST /campamentos/:id/pagos/:personaId`. */
export function toPagoDto(ctx: PagoContext, draft: PagoDraft): RegistrarPagoCampamentoDto {
  const { montoPagado, montoSaldo } = pagoSummary(ctx, draft);
  const descripcion = draft.descripcion.trim();
  return {
    montoPagado,
    ...(montoSaldo > 0 && { montoConSaldoPersonal: montoSaldo }),
    ...(montoPagado > 0 && draft.medioPago && { medioPago: draft.medioPago }),
    ...(descripcion && { descripcion }),
  };
}
