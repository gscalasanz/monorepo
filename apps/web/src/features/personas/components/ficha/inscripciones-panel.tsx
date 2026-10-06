import { ClipboardCheck } from 'lucide-react';

import { Money, StatusBadge } from '@/shared/components/data';
import { EmptyState } from '@/shared/components/feedback';
import { Panel } from '@/shared/components/ui/panel';
import {
  ESTADO_INSCRIPCION_LABELS,
  TIPO_INSCRIPCION_LABELS,
} from '@/shared/domain';
import { FICHA_COPY as C } from '@/features/personas/constants/copy';
import { PERSONA_ROUTES } from '@/features/personas/constants/personas';
import type { PersonaDashboard } from '@/features/personas/models/dashboard-schema';
import { ObligacionItem } from '@/features/personas/components/ficha/obligacion-item';

/** Inscripciones del año (y años anteriores con deuda); click → detalle de la inscripción. */
export function InscripcionesPanel({
  inscripciones,
}: {
  readonly inscripciones: PersonaDashboard['inscripciones'];
}) {
  const deuda = inscripciones.resumen.total;
  return (
    <Panel
      title={C.INSCRIPCIONES}
      meta={deuda > 0 ? <Money amount={deuda} tone="debt" /> : undefined}
      flush
    >
      {inscripciones.items.length === 0 ? (
        <EmptyState icon={ClipboardCheck} title={C.NO_INSCRIPCIONES} />
      ) : (
        <ul className="divide-y divide-border">
          {inscripciones.items.map((item) => (
            <ObligacionItem
              key={item.id}
              href={PERSONA_ROUTES.inscripcion(item.id)}
              icon={ClipboardCheck}
              title={TIPO_INSCRIPCION_LABELS[item.tipo]}
              year={item.ano}
              badges={
                <StatusBadge
                  status={item.estado}
                  label={ESTADO_INSCRIPCION_LABELS[item.estado]}
                />
              }
              pagado={item.montoPagado + item.montoBonificado}
              total={item.montoTotal}
              pendiente={item.saldoPendiente}
            />
          ))}
        </ul>
      )}
    </Panel>
  );
}
