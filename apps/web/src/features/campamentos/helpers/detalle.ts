/** Cálculos de presentación del detalle (KPIs, card de participante, historial). */
import {
  CONCEPTO_MOVIMIENTO,
  CONCEPTO_MOVIMIENTO_LABELS,
  ESTADO_PAGO_CAMPAMENTO,
  TIPO_MOVIMIENTO,
  type CampamentoKpis,
  type ParticipantePago,
} from '@/shared/domain';
import type { PagoContext } from "@/features/campamentos/helpers/pago";

const FULL_PERCENT = 100;

/** Barra "Recaudación": min(recaudado / a recaudar · 100, 100) redondeado (0 si no hay nada a recaudar). */
export function recaudacionPercent(kpis: CampamentoKpis): number {
  if (kpis.totalARecaudar === 0) return 0;
  return Math.round(
    Math.min((kpis.totalRecaudado / kpis.totalARecaudar) * FULL_PERCENT, FULL_PERCENT),
  );
}

export const PARTICIPANTE_ESTADO = {
  EXENTO: 'exento',
  AL_DIA: 'al-dia',
  PENDIENTE: 'pendiente',
} as const;

export type ParticipanteEstado = (typeof PARTICIPANTE_ESTADO)[keyof typeof PARTICIPANTE_ESTADO];

export function participanteEstado(p: ParticipantePago): ParticipanteEstado {
  if (p.estadoPago === ESTADO_PAGO_CAMPAMENTO.EXENTO) return PARTICIPANTE_ESTADO.EXENTO;
  return p.saldoPendiente === 0 ? PARTICIPANTE_ESTADO.AL_DIA : PARTICIPANTE_ESTADO.PENDIENTE;
}

/** Lo cubierto: pagado + bonificado (numerador de la card). */
export function montoCubierto(p: ParticipantePago): number {
  return p.totalPagado + p.montoBonificado;
}

export function isExento(p: ParticipantePago): boolean {
  return p.estadoPago === ESTADO_PAGO_CAMPAMENTO.EXENTO;
}

/** Acciones disponibles en la card (paridad con los `@if` del template). */
export function participanteAcciones(p: ParticipantePago): {
  readonly registrarPago: boolean;
  readonly bonificar: boolean;
  readonly ajustar: boolean;
  readonly quitarBonificacion: boolean;
} {
  return {
    registrarPago: p.saldoPendiente > 0,
    bonificar: !isExento(p),
    ajustar: p.montoBonificado > 0,
    quitarBonificacion: p.montoBonificado > 0,
  };
}

type Pago = ParticipantePago['pagos'][number];

/** Solo el pago real de campamento se gestiona desde el historial (no las bonificaciones). */
export function isPagoGestionable(pago: Pago): boolean {
  return pago.concepto === CONCEPTO_MOVIMIENTO.CAMPAMENTO_PAGO;
}

export function isEgreso(pago: Pago): boolean {
  return pago.tipo === TIPO_MOVIMIENTO.EGRESO;
}

export function conceptoLabel(concepto: Pago['concepto']): string {
  return CONCEPTO_MOVIMIENTO_LABELS[concepto] ?? concepto;
}

/** Datos para el diálogo de pago (`costoPorPersona` = asignado − bonificado). */
export function pagoContextOf(p: ParticipantePago, saldoCuentaPersonal: number): PagoContext {
  return {
    costoPorPersona: p.montoAsignado - p.montoBonificado,
    totalPagado: p.totalPagado,
    montoPendiente: p.saldoPendiente,
    saldoCuentaPersonal,
  };
}
