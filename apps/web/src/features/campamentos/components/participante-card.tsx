'use client';

import {
  ClipboardCheck,
  ClipboardX,
  Gift,
    Plus,
  UserMinus,
  XCircle,
} from 'lucide-react';

import { Money, RamaChip, StatusBadge } from '@/shared/components/data';
import { Button } from '@/shared/components/ui/button';
import type { ParticipantePago } from '@/shared/domain';
import { formatMoney } from '@/shared/format';
import { DATE_FORMATS, formatDate } from '@/shared/time';
import { ParticipantePagos } from '@/features/campamentos/components/participante-pagos';
import { PARTICIPANTES_COPY as C } from '@/features/campamentos/constants/copy';
import {
  PARTICIPANTE_ESTADO,
  isExento,
  montoCubierto,
  participanteAcciones,
  participanteEstado,
} from '@/features/campamentos/helpers/detalle';
import type { DetalleActions } from '@/features/campamentos/hooks/use-detalle-actions';

export interface ParticipanteHandlers {
  readonly actions: DetalleActions;
  readonly onRegistrarPago: (p: ParticipantePago) => void;
  readonly onBonificar: (p: ParticipantePago) => void;
}

function EstadoBadge({
  participante,
}: {
  readonly participante: ParticipantePago;
}) {
  const estado = participanteEstado(participante);
  if (estado === PARTICIPANTE_ESTADO.EXENTO)
    return <StatusBadge tone="neutral" label={C.EXENTO} />;
  if (estado === PARTICIPANTE_ESTADO.AL_DIA)
    return <StatusBadge status="pagado" label={C.AL_DIA} />;
  return (
    <span className="flex items-baseline gap-1 text-[13px] text-danger">
      <Money
        amount={participante.saldoPendiente}
        tone="debt"
        className="font-semibold"
      />
      {C.PENDIENTE}
    </span>
  );
}

function RowButtons({
  participante: p,
  actions,
}: {
  readonly participante: ParticipantePago;
  readonly actions: DetalleActions;
}) {
  const autorizacion = p.autorizacionEntregada
    ? C.AUTORIZACION_OK
    : C.AUTORIZACION_PENDIENTE;
  return (
    <div className="flex">
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={autorizacion}
        title={autorizacion}
        className={
          p.autorizacionEntregada ? 'text-success' : 'text-warning'
        }
        onClick={() => void actions.toggleAutorizacion(p)}
      >
        {p.autorizacionEntregada ? (
          <ClipboardCheck aria-hidden className="size-4" />
        ) : (
          <ClipboardX aria-hidden className="size-4" />
        )}
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={C.QUITAR}
        title={C.QUITAR}
        className="hover:text-danger"
        onClick={() => void actions.removeParticipante(p)}
      >
        <UserMinus aria-hidden className="size-4" />
      </Button>
    </div>
  );
}

function CardHeader({
  participante: p,
  actions,
}: {
  readonly participante: ParticipantePago;
  readonly actions: DetalleActions;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-semibold text-ink">{p.nombre}</h3>
          {p.rama && <RamaChip rama={p.rama} variant="dot" />}
        </div>
        <span className="text-[13px] text-ink-muted tabular-nums">
          <Money amount={montoCubierto(p)} /> /{' '}
          <Money amount={p.montoAsignado} />
        </span>
        {!isExento(p) && p.montoBonificado > 0 && (
          <span className="text-xs text-info">
            {C.bonificado(formatMoney(p.montoBonificado))}
          </span>
        )}
        <span className="text-xs text-ink-subtle">
          {C.inscripto(formatDate(p.fechaInscripcion, DATE_FORMATS.date))}
        </span>
      </div>
      <div className="flex flex-col items-end gap-1">
        <EstadoBadge participante={p} />
        <RowButtons participante={p} actions={actions} />
      </div>
    </div>
  );
}

function CardActions({
  participante: p,
  handlers,
}: {
  readonly participante: ParticipantePago;
  readonly handlers: ParticipanteHandlers;
}) {
  const can = participanteAcciones(p);
  if (!can.registrarPago && !can.bonificar && !can.quitarBonificacion)
    return null;
  return (
    <div className="flex flex-wrap gap-2">
      {can.registrarPago && (
        <Button
          size="sm"
          variant="secondary"
          icon={<Plus aria-hidden className="size-4" />}
          onClick={() => handlers.onRegistrarPago(p)}
        >
          {C.REGISTRAR_PAGO}
        </Button>
      )}
      {can.bonificar && (
        <Button
          size="sm"
          variant="secondary"
          icon={<Gift aria-hidden className="size-4" />}
          onClick={() => handlers.onBonificar(p)}
        >
          {can.ajustar ? C.AJUSTAR_BONIFICACION : C.BONIFICAR}
        </Button>
      )}
      {can.quitarBonificacion && (
        <Button
          size="sm"
          variant="ghost"
          icon={<XCircle aria-hidden className="size-4" />}
          onClick={() => void handlers.actions.quitarBonificacion(p)}
        >
          {C.QUITAR_BONIFICACION}
        </Button>
      )}
    </div>
  );
}

/** Card de participante: avance, estado, autorización, historial y acciones de pago. */
export function ParticipanteCard({
  participante,
  handlers,
}: {
  readonly participante: ParticipantePago;
  readonly handlers: ParticipanteHandlers;
}) {
  return (
    <article className="flex min-w-0 flex-col gap-3 rounded-lg border border-border bg-surface p-3 md:p-4">
      <CardHeader participante={participante} actions={handlers.actions} />
      <ParticipantePagos
        pagos={participante.pagos}
        onEliminarPago={(pago) => void handlers.actions.eliminarPago(pago)}
      />
      <CardActions participante={participante} handlers={handlers} />
    </article>
  );
}

