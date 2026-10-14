import { Check } from 'lucide-react';

import { cn } from '@/shared/lib/utils';
import { LIST_COPY as C } from '@/features/inscripciones/constants/copy';
import { AUTORIZACION_KEYS } from '@/features/inscripciones/constants/inscripciones';
import { missingAutorizaciones } from '@/features/inscripciones/helpers/list';
import type { Autorizaciones } from '@/features/inscripciones/constants/inscripciones';

/** Contador de papeles (3/5): el detalle de cuáles faltan va en el título y para lectores. */
export function PapelesCell({
  autorizaciones,
}: {
  readonly autorizaciones: Autorizaciones;
}) {
  const faltan = missingAutorizaciones(autorizaciones);
  const total = AUTORIZACION_KEYS.length;
  const complete = faltan.length === 0;
  return (
    <span
      title={complete ? C.PAPELES_COMPLETOS : C.papelesFaltan(faltan)}
      className={cn(
        'inline-flex items-center gap-1 text-sm tabular-nums',
        complete ? 'text-success' : 'text-ink-muted',
      )}
    >
      {complete ? <Check aria-hidden className="size-4" /> : null}
      {total - faltan.length}/{total}
      <span className="sr-only">
        {complete ? C.PAPELES_COMPLETOS : C.papelesFaltan(faltan)}
      </span>
    </span>
  );
}
