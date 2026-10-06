import { Plus } from 'lucide-react';

import { Money } from '@/shared/components/data';
import { CAJAS_LINKS } from '@/features/cajas/constants/cajas';
import { CAJAS_COPY as C } from '@/features/cajas/constants/copy';
import { LinkButton } from '@/features/cajas/components/link-button';
import type { FondosRamaStats as Stats } from '@/features/cajas/helpers/fondos-rama';

const CELL =
  'grid min-w-0 content-start gap-1.5 bg-surface px-4 py-4 md:px-[18px]';
const FIGURE = 'whitespace-nowrap text-ink';

/** Tira de saldos: total + un fondo por rama con "+" para registrar movimiento. */
export function FondosRamaStats({ stats }: { readonly stats: Stats }) {
  return (
    <dl
      aria-label={C.FONDOS_LABEL}
      className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border shadow-xs sm:grid-cols-2 lg:grid-cols-5"
    >
      <div className={`${CELL} sm:col-span-2 lg:col-span-1`}>
        <dt className="text-[13px] leading-[18px] text-ink-muted">
          {C.TOTAL_FONDOS_RAMA}
        </dt>
        <dd className={FIGURE}>
          <Money amount={stats.total} size="figure-md" />
        </dd>
      </div>
      {stats.fondos.map((fondo) => (
        <div key={fondo.tipo} className={CELL}>
          <dt className="text-[13px] leading-[18px] text-ink-muted">
            {fondo.label}
          </dt>
          <dd className="flex items-end justify-between gap-2">
            <span className={FIGURE}>
              <Money
                amount={fondo.saldo}
                size="figure-md"
                tone={fondo.saldo < 0 ? 'debt' : undefined}
              />
            </span>
            {fondo.cajaId && (
              <LinkButton
                href={CAJAS_LINKS.movimientoNuevo(fondo.cajaId)}
                variant="ghost"
                size="icon-sm"
                aria-label={`${C.REGISTRAR_MOVIMIENTO} (${fondo.label})`}
                title={C.REGISTRAR_MOVIMIENTO}
                icon={<Plus aria-hidden />}
              />
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
