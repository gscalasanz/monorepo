import { Panel } from '@/shared/components/ui/panel';
import type { InscripcionesConsolidado } from '@/shared/domain';
import { DASHBOARD_COPY as C } from '@/features/inscripciones/constants/copy';
import { ramaShares } from '@/features/inscripciones/helpers/consolidado';
import { RamaBarRow } from '@/features/inscripciones/components/dashboard/rama-bar-row';

/** "Distribución por Rama": una barra por rama con su cantidad. */
export function RamaDistribution({
  consolidado,
}: {
  readonly consolidado: InscripcionesConsolidado;
}) {
  const shares = ramaShares({
    porRama: consolidado.porRama,
    total: consolidado.total,
  });
  return (
    <Panel title={C.DISTRIBUTION}>
      <ul className="grid gap-2.5">
        {shares.map((share) => (
          <RamaBarRow key={share.key} share={share} />
        ))}
      </ul>
    </Panel>
  );
}
