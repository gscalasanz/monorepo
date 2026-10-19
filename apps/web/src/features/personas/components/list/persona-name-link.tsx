import Link from 'next/link';

import { RamaChip } from '@/shared/components/data';
import { CARGO_EDUCADOR_LABELS, PERSONA_TYPE } from '@/shared/domain';
import { PERSONA_ROUTES } from '@/features/personas/constants/personas';
import type { ListedPersona } from '@/features/personas/helpers/list';

/** Sub-línea: rama (protagonistas/educadores), cargo (educadores) o contacto (externas). */
function detailOf(persona: ListedPersona): string | null {
  if (persona.tipo === PERSONA_TYPE.EDUCADOR)
    return persona.cargo ? CARGO_EDUCADOR_LABELS[persona.cargo] : null;
  if (persona.tipo === PERSONA_TYPE.EXTERNA) return persona.contacto;
  return null;
}

/** Nombre (link a la ficha; no dispara el clic de la fila) con rama y detalle como sub-línea. */
export function PersonaNameLink({
  persona,
}: {
  readonly persona: ListedPersona;
}) {
  const rama = persona.tipo === PERSONA_TYPE.EXTERNA ? null : persona.rama;
  const detail = detailOf(persona);
  return (
    <div className="flex min-w-0 flex-col items-start gap-1">
      <Link
        href={PERSONA_ROUTES.detail({ tipo: persona.tipo, id: persona.id })}
        onClick={(event) => event.stopPropagation()}
        className="max-w-full truncate font-medium text-ink hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
      >
        {persona.nombre}
      </Link>
      {rama || detail ? (
        <span className="flex min-w-0 items-center gap-2 text-xs text-ink-subtle">
          {rama ? <RamaChip rama={rama} variant="dot" /> : null}
          {detail ? <span className="truncate">{detail}</span> : null}
        </span>
      ) : null}
    </div>
  );
}
