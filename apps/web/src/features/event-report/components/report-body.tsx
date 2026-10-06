import type { ReporteEvento } from '@/shared/domain';
import { EgresosSection } from '@/features/event-report/components/sections/egresos-section';
import { IngresosSection } from '@/features/event-report/components/sections/ingresos-section';
import { IntegridadSection } from '@/features/event-report/components/sections/integridad-section';
import { ReportHeader } from '@/features/event-report/components/sections/report-header';
import { ReportKpis } from '@/features/event-report/components/sections/report-kpis';
import { ResultadoSection } from '@/features/event-report/components/sections/resultado-section';
import { VentaSections } from '@/features/event-report/components/venta-sections';
import { EVENT_REPORT_COPY } from '@/features/event-report/constants/copy';
import {
  isReporteVenta,
  pendientesDePago,
} from '@/features/event-report/helpers/derived';
import { kpisFor } from '@/features/event-report/helpers/kpis';

/**
 * Secciones del reporte según la variante (port de `sectionsFor`):
 * header · KPIs · resultado · [venta: productos…rama, ganancia] | [grupo: ingresos]
 * · [pendiente de pago] · egresos · integridad.
 */
export function ReportBody({ reporte }: { readonly reporte: ReporteEvento }) {
  const pendientes = pendientesDePago(reporte.egresos);
  return (
    <article className="grid gap-4 md:gap-6">
      <ReportHeader evento={reporte.evento} />
      <ReportKpis kpis={kpisFor(reporte)} />
      <ResultadoSection kpis={reporte.kpis} />
      {isReporteVenta(reporte) ? (
        <VentaSections reporte={reporte} />
      ) : (
        <IngresosSection ingresos={reporte.ingresosItemizados} />
      )}
      {pendientes.length > 0 ? (
        <EgresosSection
          title={EVENT_REPORT_COPY.pendientePago.title}
          totalLabel={EVENT_REPORT_COPY.pendientePago.total}
          egresos={pendientes}
        />
      ) : null}
      <EgresosSection
        title={EVENT_REPORT_COPY.egresos.title}
        totalLabel={EVENT_REPORT_COPY.egresos.total}
        egresos={reporte.egresos}
      />
      <IntegridadSection flags={reporte.integridad} />
    </article>
  );
}
