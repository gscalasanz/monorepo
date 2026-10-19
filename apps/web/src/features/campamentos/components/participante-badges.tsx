import { ClipboardCheck, ClipboardX } from 'lucide-react';

import { Money, StatusBadge } from '@/shared/components/data';
import type { ParticipantePago } from '@/shared/domain';
import { PARTICIPANTES_COPY as C } from '@/features/campamentos/constants/copy';
import {
  PARTICIPANTE_ESTADO,
  participanteEstado,
} from '@/features/campamentos/helpers/detalle';

/** Exento · Al día · "$X pendiente" (en rojo de deuda). */
export function ParticipanteEstadoBadge({
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
    <span className="flex items-baseline gap-1 text-[13px] whitespace-nowrap text-danger">
      <Money
        amount={participante.saldoPendiente}
        tone="debt"
        className="font-semibold"
      />
      {C.PENDIENTE}
    </span>
  );
}

/** Autorización de los padres: entregada / pendiente (ícono + texto, nunca solo color). */
export function AutorizacionBadge({
  entregada,
}: {
  readonly entregada: boolean;
}) {
  return entregada ? (
    <StatusBadge
      tone="success"
      icon={ClipboardCheck}
      label={C.AUTORIZACION_OK_SHORT}
    />
  ) : (
    <StatusBadge
      tone="warning"
      icon={ClipboardX}
      label={C.AUTORIZACION_PENDIENTE_SHORT}
    />
  );
}
