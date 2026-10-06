'use client';

import { Check, Clock, Undo2, type LucideIcon } from 'lucide-react';

import {
  BADGE_TONE,
  StatusBadge,
  type BadgeTone,
} from '@/shared/components/data';
import {
  ESTADO_PAGO,
  ESTADO_PAGO_LABELS,
  type EstadoPago,
} from '@/shared/domain';

import { FINANZAS_COPY } from './copy';
import type { MovimientoCardData } from './types';

const BADGE_BY_ESTADO: Readonly<
  Record<EstadoPago, { readonly tone: BadgeTone; readonly icon: LucideIcon }>
> = {
  pagado: { tone: BADGE_TONE.SUCCESS, icon: Check },
  pendiente_reembolso: { tone: BADGE_TONE.INFO, icon: Undo2 },
  pendiente_cobro: { tone: BADGE_TONE.WARNING, icon: Clock },
};

export interface EstadoPagoBadgeProps {
  readonly movimiento: MovimientoCardData;
  readonly onPagarReembolso?: (movimiento: MovimientoCardData) => void;
}

/** "Pagado" / "Pendiente de Reembolso" / "A cobrar"; el pendiente de reembolso puede ser botón. */
export function EstadoPagoBadge({
  movimiento,
  onPagarReembolso,
}: EstadoPagoBadgeProps) {
  const { estadoPago } = movimiento;
  const config = BADGE_BY_ESTADO[estadoPago] ?? BADGE_BY_ESTADO.pagado;
  const badge = (
    <StatusBadge
      status={estadoPago}
      label={ESTADO_PAGO_LABELS[estadoPago] ?? estadoPago}
      tone={config.tone}
      icon={config.icon}
    />
  );
  if (estadoPago !== ESTADO_PAGO.PENDIENTE_REEMBOLSO || !onPagarReembolso)
    return badge;
  return (
    <button
      type="button"
      title={FINANZAS_COPY.card.marcarComoPagado}
      onClick={() => onPagarReembolso(movimiento)}
      className="inline-flex min-h-11 items-center rounded-sm hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus md:min-h-0"
    >
      {badge}
    </button>
  );
}
