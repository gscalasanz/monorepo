import { Money } from '@/shared/components/data';
import { Panel } from '@/shared/components/ui/panel';
import { CONSOLIDADO_COPY as C } from '@/features/reportes/constants/copy';
import type { ConsolidadoDeudas } from '@/features/reportes/models/consolidado';

function Stat({ label, amount }: { readonly label: string; readonly amount: number }) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <dt className="text-[13px] text-ink-muted">{label}</dt>
      <dd>
        <Money amount={amount} tone="debt" size="figure-md" />
      </dd>
    </div>
  );
}

/** Consolidado de deuda de plata (viene del backend): total y desglose por tipo. */
export function DeudasConsolidado({ consolidado: c }: { readonly consolidado: ConsolidadoDeudas }) {
  return (
    <Panel title={C.TITLE} meta={C.META(c.personasConDeuda)}>
      <dl className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat label={C.TOTAL} amount={c.deudaTotal} />
        <Stat label={C.CAMPAMENTOS} amount={c.deudaCampamentos} />
        <Stat label={C.INSCRIPCIONES_SCOUT} amount={c.deudaInscripcionesScout} />
        <Stat label={C.INSCRIPCIONES_GRUPO} amount={c.deudaInscripcionesGrupo} />
      </dl>
    </Panel>
  );
}
