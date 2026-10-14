import { Check, Minus } from 'lucide-react';

import { Panel } from '@/shared/components/ui/panel';
import { cn } from '@/shared/lib/utils';
import {
  AUTH_COPY as C,
  DETAIL_COPY,
} from '@/features/inscripciones/constants/copy';
import {
  AUTORIZACIONES,
  type Autorizaciones,
} from '@/features/inscripciones/constants/inscripciones';

interface AutorizacionesCardProps {
  readonly values: Autorizaciones;
  /** Edición de la inscripción (donde se marcan las autorizaciones). */
  readonly editHref: string;
}

/** Checklist en grilla (como la documentación de la ficha): solo lo que falta lleva texto visible. */
export function AutorizacionesCard({
  values,
  editHref,
}: AutorizacionesCardProps) {
  const entregadas = AUTORIZACIONES.filter((item) => values[item.key]).length;
  return (
    <Panel
      title={C.SECTION_TITLE}
      meta={DETAIL_COPY.AUT_COUNT(entregadas, AUTORIZACIONES.length)}
      action={{ label: DETAIL_COPY.AUT_UPDATE, href: editHref }}
      flush
    >
      <ul className="grid grid-cols-1 sm:grid-cols-2">
        {AUTORIZACIONES.map((item) => {
          const ok = values[item.key];
          const Icon = ok ? Check : Minus;
          return (
            <li
              key={item.key}
              className="flex min-h-12 items-center gap-2.5 border-b border-border px-4 py-2.5 text-sm text-ink sm:odd:border-r md:px-[18px]"
            >
              <span
                aria-hidden
                className={cn(
                  'grid size-5 shrink-0 place-items-center rounded-full',
                  ok
                    ? 'bg-success-soft text-success'
                    : 'bg-warning-soft text-warning',
                )}
              >
                <Icon className="size-3" strokeWidth={2.5} />
              </span>
              <span className="flex-1">{item.label}</span>
              {ok ? (
                <span className="sr-only">{C.PRESENTED}</span>
              ) : (
                <span className="text-xs text-warning">{C.MISSING}</span>
              )}
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}
