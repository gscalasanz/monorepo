import { CircleCheck, CircleSlash } from 'lucide-react';

import { RamaChip, StatusBadge } from '@/shared/components/data';
import {
  CARGO_EDUCADOR_LABELS,
  ESTADO_PERSONA_LABELS,
  PERSONA_TYPE_LABELS,
  isPersonaDisabled,
} from '@/shared/domain';
import type { PersonaDashboard } from '@/features/personas/models/dashboard-schema';

/** Rama · tipo · cargo (si no repite el tipo) · estado (Activo / Deshabilitado con ícono). */
export function PersonaBadges({
  persona,
}: {
  readonly persona: PersonaDashboard['persona'];
}) {
  const disabled = isPersonaDisabled(persona);
  const tipoLabel = PERSONA_TYPE_LABELS[persona.tipo];
  const cargoLabel = persona.cargo
    ? CARGO_EDUCADOR_LABELS[persona.cargo]
    : null;
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {persona.rama ? <RamaChip rama={persona.rama} /> : null}
      <StatusBadge label={tipoLabel} tone="neutral" hideIcon />
      {cargoLabel && cargoLabel !== tipoLabel ? (
        <StatusBadge label={cargoLabel} tone="neutral" hideIcon />
      ) : null}
      <StatusBadge
        label={ESTADO_PERSONA_LABELS[persona.estado]}
        tone={disabled ? 'danger' : 'success'}
        icon={disabled ? CircleSlash : CircleCheck}
      />
    </div>
  );
}
