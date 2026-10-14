import { FileWarning } from 'lucide-react';

import { formatMoney } from '@/shared/format';
import { REPORTES_COPY as C } from '@/features/reportes/constants/copy';
import {
  countDocsFaltantes,
  debtCards,
} from '@/features/reportes/helpers/deudas';
import type { PersonaDeuda } from '@/features/reportes/models/deudas';

const CHIP =
  'inline-flex items-center gap-1 whitespace-nowrap rounded-md border border-border bg-recessed px-2 py-0.5 text-xs font-medium text-ink';

/** Chips en tinta neutra (el rojo queda solo en el total de la fila): una por deuda + "N docs". */
export function DebtSummaryChips({
  persona,
}: {
  readonly persona: PersonaDeuda;
}) {
  const docs = countDocsFaltantes(persona);
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {debtCards(persona).map((card) => (
        <span key={`${card.label}-${card.ano}-${card.name}`} className={CHIP}>
          <span>{`${card.label} ${card.ano}`}</span>
          <span className="text-ink-muted tabular-nums">
            {formatMoney(card.saldo)}
          </span>
        </span>
      ))}
      {docs > 0 ? (
        <span className={CHIP}>
          <FileWarning aria-hidden className="size-3 text-ink-subtle" />
          {C.DOCS(docs)}
        </span>
      ) : null}
    </div>
  );
}
