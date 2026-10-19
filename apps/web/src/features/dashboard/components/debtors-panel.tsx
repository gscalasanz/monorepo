import Link from 'next/link';

import { InitialsAvatar, Money, RamaChip } from '@/shared/components/data';
import { EmptyState } from '@/shared/components/feedback';
import { NavChevron } from '@/shared/components/ui/nav-chevron';
import { Panel } from '@/shared/components/ui/panel';
import { DASHBOARD_COPY as C } from '@/features/dashboard/constants/copy';
import { DEBTORS_REPORT_HREF } from '@/features/dashboard/constants/dashboard';
import type { DebtConcept, DebtorRow, DebtorsSummary } from '@/features/dashboard/helpers/debtors';

const CONCEPT_LABEL: Readonly<Record<DebtConcept, string>> = {
  inscripcion: C.DEBT_INSCRIPCION,
  campamento: C.DEBT_CAMPAMENTO,
};

const DEBTOR_LINK_CLASSES =
  'group flex min-h-14 items-center gap-3 px-4 py-2.5 transition-colors hover:bg-recessed focus-visible:outline-2 ' +
  'focus-visible:outline-offset-[-2px] focus-visible:outline-focus md:px-[18px]';

/** Fila de deudor: lleva a la ficha de la persona. */
function Debtor({ row }: { readonly row: DebtorRow }) {
  return (
    <li>
      <Link href={row.href} className={DEBTOR_LINK_CLASSES}>
        <InitialsAvatar name={row.nombre} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-ink">{row.nombre}</p>
          <p className="flex min-w-0 items-center gap-1.5 text-xs text-ink-subtle">
            <RamaChip rama={row.rama} variant="dot" className="text-xs font-normal text-ink-subtle" />
            {row.concepts.length > 0 ? (
              <span className="truncate">{`· ${row.concepts.map((concept) => CONCEPT_LABEL[concept]).join(C.DEBT_SEPARATOR)}`}</span>
            ) : null}
          </p>
        </div>
        <Money amount={row.amount} tone="debt" className="shrink-0 text-sm font-medium" />
        <NavChevron />
      </Link>
    </li>
  );
}

/** Mayores deudores (de `reportes/deudas`) con el total adeudado de todos al pie. */
export function DebtorsPanel({ summary, className }: { readonly summary: DebtorsSummary; readonly className?: string }) {
  return (
    <Panel
      title={C.DEBTORS}
      meta={summary.count > 0 ? C.DEBTORS_COUNT(summary.count) : undefined}
      action={{ label: C.DEBTORS_REPORT, href: DEBTORS_REPORT_HREF }}
      flush
      className={className}
    >
      {summary.rows.length === 0 ? (
        <EmptyState title={C.NO_DEBTORS} />
      ) : (
        <>
          <ul className="divide-y divide-border">
            {summary.rows.map((row) => <Debtor key={row.id} row={row} />)}
          </ul>
          <p className="flex items-center justify-between gap-3 border-t border-border bg-recessed/60 px-4 py-3 text-[13px] text-ink-muted md:px-[18px]">
            {C.DEBTORS_TOTAL}
            <Money amount={summary.total} tone="debt" className="font-medium" />
          </p>
        </>
      )}
    </Panel>
  );
}
