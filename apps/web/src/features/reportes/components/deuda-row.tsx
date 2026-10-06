import { ChevronDown } from 'lucide-react';
import Link from 'next/link';

import { Money } from '@/shared/components/data';
import { PERSONA_TYPE_ROUTES } from '@/shared/constants';
import { cn } from '@/shared/lib/utils';
import { REPORTES_COPY as C } from '@/features/reportes/constants/copy';
import { DebtSummaryChips } from '@/features/reportes/components/debt-summary-chips';
import { DeudaDetail } from '@/features/reportes/components/deuda-detail';
import type { PersonaDeuda } from '@/features/reportes/models/deudas';

export const DEUDA_GRID = 'md:grid md:grid-cols-[minmax(0,11rem)_6rem_minmax(0,1fr)_8rem] md:gap-3';

interface DeudaRowProps {
  readonly persona: PersonaDeuda;
  readonly expanded: boolean;
  readonly onToggle: (personaId: string) => void;
}

/** Fila expandible: el nombre lleva a la ficha; el botón despliega el detalle. */
export function DeudaRow({ persona, expanded, onToggle }: DeudaRowProps) {
  const detailId = `deuda-detail-${persona.personaId}`;
  return (
    <li className={cn('border-b border-border last:border-b-0', expanded && 'bg-recessed')}>
      <div className={cn('flex flex-col gap-2 px-4 py-3 md:items-center', DEUDA_GRID)}>
        <div className="flex items-start justify-between gap-2 md:contents">
          <Link
            href={`${PERSONA_TYPE_ROUTES[persona.tipo]}/${persona.personaId}`}
            aria-label={C.VER_FICHA(persona.nombre)}
            className="min-w-0 truncate rounded-sm py-1 font-semibold text-ink hover:text-brand hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            {persona.nombre}
          </Link>
          <span className="shrink-0 py-1 text-sm text-ink-muted md:text-ink">{persona.rama}</span>
        </div>
        <DebtSummaryChips persona={persona} />
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={detailId}
          onClick={() => onToggle(persona.personaId)}
          className="flex min-h-11 items-center justify-between gap-2 rounded-md text-sm text-ink-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-focus md:justify-end"
        >
          <span className="md:sr-only">{expanded ? C.COLLAPSE : C.EXPAND}</span>
          <span className="flex items-center gap-1">
            {persona.deudaTotal > 0 ? <Money amount={persona.deudaTotal} tone="debt" className="font-semibold" /> : null}
            <ChevronDown aria-hidden className={cn('size-4 transition-transform', expanded && 'rotate-180')} />
          </span>
        </button>
      </div>
      {expanded ? (
        <div id={detailId}>
          <DeudaDetail persona={persona} />
        </div>
      ) : null}
    </li>
  );
}
