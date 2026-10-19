import { Money } from '@/shared/components/data';
import { DASHBOARD_COPY as C } from '@/features/inscripciones/constants/copy';
import type { DebtorCategory } from '@/features/inscripciones/helpers/consolidado';
import { RamaBreakdown } from '@/features/inscripciones/components/dashboard/rama-breakdown';

/** Una categoría de deudores: nombre + ramas, cantidad y (si aplica) monto en columnas fijas. */
export function DebtorRow({ category }: { readonly category: DebtorCategory }) {
  return (
    <li className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-6 gap-y-2 px-4 py-3 md:grid-cols-[minmax(0,1fr)_96px_120px] md:px-[18px]">
      <div className="grid min-w-0 gap-1">
        <span className="text-sm font-medium text-ink">{category.label}</span>
        <span className="text-xs text-ink-subtle">{category.description}</span>
        <RamaBreakdown items={category.breakdown} />
      </div>
      <span className="flex items-baseline justify-end gap-1.5 text-right">
        <span className="text-lg font-semibold text-ink tabular-nums">
          {category.count}
        </span>
        <span className="text-[13px] text-ink-muted">{C.PERSONAS}</span>
      </span>
      <span className="col-span-2 text-right md:col-span-1">
        {category.monto ? (
          <Money
            amount={category.monto}
            tone="debt"
            className="text-sm font-medium"
          />
        ) : null}
      </span>
    </li>
  );
}
