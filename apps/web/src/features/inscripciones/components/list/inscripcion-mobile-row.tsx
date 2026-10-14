import { Money, RamaChip, StatusBadge } from '@/shared/components/data';
import { NavChevron } from '@/shared/components/ui/nav-chevron';
import { ESTADO_INSCRIPCION_LABELS, type Inscripcion } from '@/shared/domain';
import { formatDate } from '@/shared/time';
import { LIST_COPY as C } from '@/features/inscripciones/constants/copy';
import { personaNombre } from '@/features/inscripciones/helpers/list';

/** Fila de la lista mobile: persona + estado a la izquierda, pendiente a la derecha. */
export function InscripcionMobileRow({
  inscripcion,
}: {
  readonly inscripcion: Inscripcion;
}) {
  return (
    <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
      <div className="flex min-w-0 flex-col gap-1">
        <span className="truncate text-sm font-medium text-ink">
          {personaNombre(inscripcion)}
        </span>
        {inscripcion.persona?.rama ? (
          <RamaChip rama={inscripcion.persona.rama} variant="dot" />
        ) : null}
        <span className="flex items-center gap-2 text-xs text-ink-subtle">
          <StatusBadge
            status={inscripcion.estado}
            label={ESTADO_INSCRIPCION_LABELS[inscripcion.estado]}
          />
          {formatDate(inscripcion.createdAt)}
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <div className="flex flex-col items-end gap-0.5">
          <Money
            amount={inscripcion.saldoPendiente}
            tone={inscripcion.saldoPendiente > 0 ? 'debt' : undefined}
            className="text-sm font-medium"
          />
          <span className="text-xs text-ink-subtle">{C.COL_PENDIENTE}</span>
        </div>
        <NavChevron />
      </div>
    </div>
  );
}
