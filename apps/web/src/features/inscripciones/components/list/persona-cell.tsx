import Link from 'next/link';

import { RamaChip } from '@/shared/components/data';
import type { Inscripcion } from '@/shared/domain';
import { inscripcionRoutes } from '@/features/inscripciones/constants/routes';
import { personaNombre } from '@/features/inscripciones/helpers/list';

/** Nombre (link al detalle) con la rama como sub-línea. */
export function PersonaCell({
  inscripcion,
}: {
  readonly inscripcion: Inscripcion;
}) {
  const rama = inscripcion.persona?.rama;
  return (
    <div className="flex min-w-0 flex-col items-start gap-1">
      <Link
        href={inscripcionRoutes.detail(inscripcion.id)}
        className="truncate font-medium text-ink hover:underline focus-visible:outline-2 focus-visible:outline-focus"
        onClick={(event) => event.stopPropagation()}
      >
        {personaNombre(inscripcion)}
      </Link>
      {rama ? <RamaChip rama={rama} variant="dot" /> : null}
    </div>
  );
}
