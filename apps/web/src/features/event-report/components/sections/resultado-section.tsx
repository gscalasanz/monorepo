import { Money } from '@/shared/components/data';
import { Panel } from '@/shared/components/ui/panel';
import { EVENT_REPORT_COPY } from '@/features/event-report/constants/copy';
import type { ReporteKpis } from '@/features/event-report/models/report';

const COPY = EVENT_REPORT_COPY.resultado;

/** "Resultado económico": recaudación − egresos = neto. */
export function ResultadoSection({ kpis }: { readonly kpis: ReporteKpis }) {
  return (
    <Panel title={COPY.title}>
      <dl className="grid gap-2 text-sm">
        <div className="flex items-center justify-between gap-3">
          <dt className="text-ink-muted">{COPY.recaudacion}</dt>
          <dd>
            <Money amount={kpis.recaudacionBruta} sign="in" />
          </dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="text-ink-muted">{COPY.egresos}</dt>
          <dd>
            <Money amount={kpis.egresos} sign="out" />
          </dd>
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-border pt-2 font-semibold">
          <dt className="text-ink">{COPY.neto}</dt>
          <dd>
            <Money amount={kpis.netoReal} sign="auto" />
          </dd>
        </div>
      </dl>
    </Panel>
  );
}
