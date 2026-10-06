import { FileWarning } from 'lucide-react';

import { formatMoney } from '@/shared/format';
import { cn } from '@/shared/lib/utils';
import { REPORTES_COPY as C } from '@/features/reportes/constants/copy';
import { countDocsFaltantes, debtCards } from '@/features/reportes/helpers/deudas';
import type { PersonaDeuda } from '@/features/reportes/models/deudas';

const CHIP = 'inline-flex items-baseline gap-1 whitespace-nowrap rounded-md border px-2 py-0.5 text-xs font-medium';

/** Chips inline de la fila: una por deuda monetaria + contador de docs faltantes. */
export function DebtSummaryChips({ persona }: { readonly persona: PersonaDeuda }) {
  const docs = countDocsFaltantes(persona);
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {debtCards(persona).map((card) => (
        <span key={`${card.label}-${card.ano}-${card.name}`} className={cn(CHIP, 'border-danger/30 bg-danger-soft text-danger')}>
          {card.label} {card.ano}
          <span className="font-semibold tabular-nums">{formatMoney(card.saldo)}</span>
        </span>
      ))}
      {docs > 0 ? (
        <span className={cn(CHIP, 'items-center border-warning/30 bg-warning-soft text-warning')}>
          <FileWarning aria-hidden className="size-3" />
          {C.DOCS(docs)}
        </span>
      ) : null}
    </div>
  );
}
