import { Panel } from '@/shared/components/ui/panel';
import { APP_ROUTES } from '@/shared/constants';
import type { InscripcionesConsolidado } from '@/shared/domain';
import { DASHBOARD_COPY as C } from '@/features/inscripciones/constants/copy';
import { debtorCategories } from '@/features/inscripciones/helpers/consolidado';
import { DebtorRow } from '@/features/inscripciones/components/dashboard/debtor-row';

const DEUDAS_HREF = `${APP_ROUTES.REPORTES}/deudas`;

/** "Deudores": dinero, documentación y ambos, con desglose por rama y acceso al reporte. */
export function DebtorsPanel({
  deudores,
}: {
  readonly deudores: InscripcionesConsolidado['deudores'];
}) {
  return (
    <Panel
      title={C.DEUDORES}
      flush
      action={{ label: C.VER_DEUDORES, href: DEUDAS_HREF }}
    >
      <ul className="divide-y divide-border">
        {debtorCategories(deudores).map((category) => (
          <DebtorRow key={category.key} category={category} />
        ))}
      </ul>
    </Panel>
  );
}
