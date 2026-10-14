import type { InscripcionesConsolidado } from '@/shared/domain';
import { DATE_FORMATS, formatDate } from '@/shared/time';
import { DASHBOARD_COPY as C } from '@/features/inscripciones/constants/copy';
import { CobroPanel } from '@/features/inscripciones/components/dashboard/cobro-panel';
import { DashboardKpis } from '@/features/inscripciones/components/dashboard/dashboard-kpis';
import { DebtorsPanel } from '@/features/inscripciones/components/dashboard/debtors-panel';
import { RamaDistribution } from '@/features/inscripciones/components/dashboard/rama-distribution';

/** Cuerpo del dashboard (equivale a `app-kpi-dashboard`). */
export function DashboardContent({
  consolidado,
}: {
  readonly consolidado: InscripcionesConsolidado;
}) {
  return (
    <>
      <DashboardKpis consolidado={consolidado} />
      <div className="grid gap-4 md:gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <RamaDistribution consolidado={consolidado} />
        <CobroPanel financiero={consolidado.financiero} />
      </div>
      <DebtorsPanel deudores={consolidado.deudores} />
      <p className="text-xs text-ink-subtle">
        {C.updated(formatDate(consolidado.fecha, DATE_FORMATS.dateTimeCompact))}
      </p>
    </>
  );
}
