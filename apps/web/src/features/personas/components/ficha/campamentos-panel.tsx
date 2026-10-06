import { FileWarning, Tent } from 'lucide-react';

import { Money, StatusBadge } from '@/shared/components/data';
import { EmptyState } from '@/shared/components/feedback';
import { Panel } from '@/shared/components/ui/panel';
import { FICHA_COPY as C } from '@/features/personas/constants/copy';
import { PERSONA_ROUTES } from '@/features/personas/constants/personas';
import type { PersonaDashboard } from '@/features/personas/models/dashboard-schema';
import { ObligacionItem } from '@/features/personas/components/ficha/obligacion-item';

/** Campamentos del año (y anteriores con deuda); "Falta autorización" si no la entregó. */
export function CampamentosPanel({
  campamentos,
}: {
  readonly campamentos: PersonaDashboard['campamentos'];
}) {
  const deuda = campamentos.resumen.total;
  return (
    <Panel
      title={C.CAMPAMENTOS}
      meta={deuda > 0 ? <Money amount={deuda} tone="debt" /> : undefined}
      flush
    >
      {campamentos.items.length === 0 ? (
        <EmptyState icon={Tent} title={C.NO_CAMPAMENTOS} />
      ) : (
        <ul className="divide-y divide-border">
          {campamentos.items.map((item) => (
            <ObligacionItem
              key={item.id}
              href={PERSONA_ROUTES.campamento(item.id)}
              icon={Tent}
              title={item.nombre}
              year={item.ano}
              badges={
                item.autorizacionEntregada ? null : (
                  <StatusBadge
                    label={C.FALTA_AUTORIZACION}
                    tone="warning"
                    icon={FileWarning}
                  />
                )
              }
              pagado={item.montoPagado}
              total={item.montoTotal}
              pendiente={item.saldoPendiente}
            />
          ))}
        </ul>
      )}
    </Panel>
  );
}
