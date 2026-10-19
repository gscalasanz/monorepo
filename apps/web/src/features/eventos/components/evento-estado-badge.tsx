import { Lock } from 'lucide-react';

import { StatusBadge } from '@/shared/components/data';
import type { Evento } from '@/shared/domain';
import { EVENTOS_COPY } from '@/features/eventos/constants/copy';

const C = EVENTOS_COPY.detail;

/** "En curso" / "Cerrado" (ícono + texto, nunca solo color). */
export function EventoEstadoBadge({ evento }: { readonly evento: Evento }) {
  return evento.estaCerrado ? (
    <StatusBadge label={C.cerrado} tone="neutral" icon={Lock} />
  ) : (
    <StatusBadge label={C.enCurso} tone="brand" />
  );
}
