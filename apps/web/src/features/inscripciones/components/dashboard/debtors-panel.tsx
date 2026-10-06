import { Panel } from '@/shared/components/ui/panel';
import type { InscripcionesConsolidado } from '@/shared/domain';
import { DASHBOARD_COPY as C } from '@/features/inscripciones/constants/copy';
import { debtorCategories } from '@/features/inscripciones/helpers/consolidado';
import { DebtorCard } from '@/features/inscripciones/components/dashboard/debtor-card';

/** "Deudores": dinero, documentación y ambos, con desglose por rama. */
export function DebtorsPanel({
  deudores,
}: {
  readonly deudores: InscripcionesConsolidado['deudores'];
}) {
  return (
    <Panel title={C.DEUDORES}>
      <ul className="grid gap-3 md:grid-cols-3">
        {debtorCategories(deudores).map((category) => (
          <DebtorCard key={category.key} category={category} />
        ))}
      </ul>
    </Panel>
  );
}
