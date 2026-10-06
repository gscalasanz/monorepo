import { CircleCheck, CircleSlash } from 'lucide-react';

import { RamaChip, StatusBadge } from '@/shared/components/data';
import {
  CARGO_EDUCADOR_LABELS,
  ESTADO_PERSONA_LABELS,
  PERSONA_TYPE_LABELS,
  isPersonaDisabled,
} from '@/shared/domain';
import type { PersonaDashboard } from '@/features/personas/models/dashboard-schema';

/** Rama · tipo · cargo · estado (Activo / Deshabilitado con ícono). */
export function PersonaBadges({
  persona,
}: {
  readonly persona: PersonaDashboard['persona'];
}) {
  const disabled = isPersonaDisabled(persona);
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {persona.rama ? <RamaChip rama={persona.rama} /> : null}
      <StatusBadge
        label={PERSONA_TYPE_LABELS[persona.tipo]}
        tone="neutral"
        hideIcon
      />
      {persona.cargo ? (
        <StatusBadge
          label={CARGO_EDUCADOR_LABELS[persona.cargo]}
          tone="neutral"
          hideIcon
        />
      ) : null}
      <StatusBadge
        label={ESTADO_PERSONA_LABELS[persona.estado]}
        tone={disabled ? 'danger' : 'success'}
        icon={disabled ? CircleSlash : CircleCheck}
      />
    </div>
  );
}
