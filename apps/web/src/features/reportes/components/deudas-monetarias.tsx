import { ProgressTrack } from '@/shared/components/charts';
import { Money } from '@/shared/components/data';
import { REPORTES_COPY as C } from '@/features/reportes/constants/copy';
import type { DebtCard } from '@/features/reportes/helpers/deudas';
import type { PersonaDeuda } from '@/features/reportes/models/deudas';

const CARD =
  'flex flex-col overflow-hidden rounded-lg border border-border bg-surface';
const TITLE =
  'border-b border-border px-4 py-2.5 text-xs font-semibold tracking-wide text-ink-muted uppercase';

/** Una deuda: concepto + año · "Pagó $A de $B" con barra · saldo en rojo. */
function DeudaItem({ card }: { readonly card: DebtCard }) {
  return (
    <li className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1.5 px-4 py-3">
      <span className="min-w-0 truncate text-sm font-medium text-ink">
        {card.concepto}{' '}
        <span className="font-normal text-ink-muted tabular-nums">
          {card.ano}
        </span>
      </span>
      <Money
        amount={card.saldo}
        tone="debt"
        className="row-span-2 text-base font-semibold"
      />
      <span className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-muted tabular-nums">
        <ProgressTrack
          value={card.pagado}
          max={card.aPagar}
          color="var(--color-success)"
          className="w-16 shrink-0"
        />
        <span>
          {C.PAGO_PREFIX} <Money amount={card.pagado} /> {C.PAGO_DE}{' '}
          <Money amount={card.aPagar} />
        </span>
      </span>
    </li>
  );
}

/** "Deudas monetarias": una fila por deuda con su avance y el total al pie. */
export function DeudasMonetarias({
  persona,
  cards,
}: {
  readonly persona: PersonaDeuda;
  readonly cards: readonly DebtCard[];
}) {
  return (
    <section className={CARD}>
      <h3 className={TITLE}>{C.SECTION_MONETARIAS}</h3>
      <ul
        aria-label={C.deudasDe(persona.nombre)}
        className="divide-y divide-border"
      >
        {cards.map((card) => (
          <DeudaItem
            key={`${card.label}-${card.ano}-${card.name}`}
            card={card}
          />
        ))}
      </ul>
      <p className="flex items-center justify-between gap-4 border-t border-border bg-recessed px-4 py-2.5 text-sm">
        <span className="font-medium text-ink">{C.TOTAL_DEUDA}</span>
        <Money
          amount={persona.deudaTotal}
          tone="debt"
          className="font-semibold"
        />
      </p>
    </section>
  );
}
