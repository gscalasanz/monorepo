import type { InscripcionesConsolidado } from '@/shared/domain';
import { DATE_FORMATS, formatDate } from '@/shared/time';
import { DASHBOARD_COPY as C } from '@/features/inscripciones/constants/copy';
import { CobradoProgress } from '@/features/inscripciones/components/dashboard/cobrado-progress';
import { DashboardHero } from '@/features/inscripciones/components/dashboard/dashboard-hero';
import { DebtorsPanel } from '@/features/inscripciones/components/dashboard/debtors-panel';
import { FinancialSummary } from '@/features/inscripciones/components/dashboard/financial-summary';

/** Cuerpo del dashboard (equivale a `app-kpi-dashboard`). */
export function DashboardContent({
  consolidado,
}: {
  readonly consolidado: InscripcionesConsolidado;
}) {
  return (
    <>
      <DashboardHero consolidado={consolidado} />
      <div className="grid gap-4 md:gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <FinancialSummary financiero={consolidado.financiero} />
        <CobradoProgress financiero={consolidado.financiero} />
      </div>
      <DebtorsPanel deudores={consolidado.deudores} />
      <p className="text-xs text-ink-subtle">
        {C.updated(formatDate(consolidado.fecha, DATE_FORMATS.dateTimeCompact))}
      </p>
    </>
  );
}
