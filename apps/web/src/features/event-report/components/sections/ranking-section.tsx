import { ChartLegend } from '@/shared/components/charts';
import { Money } from '@/shared/components/data';
import { Panel } from '@/shared/components/ui/panel';
import { cn } from '@/shared/lib/utils';
import { PERSONA_COLORS } from '@/features/event-report/constants/colors';
import { EVENT_REPORT_COPY } from '@/features/event-report/constants/copy';
import {
  rankingRows,
  type RankingRow,
} from '@/features/event-report/helpers/derived';
import { formatPct } from '@/features/event-report/helpers/format';
import type { ReporteVendedor } from '@/features/event-report/models/report';

const COPY = EVENT_REPORT_COPY.ranking;
const PODIUM_SIZE = 3;

const LEGEND = [
  { label: COPY.educador, color: PERSONA_COLORS.educador },
  { label: COPY.protagonista, color: PERSONA_COLORS.protagonista },
] as const;

function RankItem({
  row,
  position,
}: {
  readonly row: RankingRow;
  readonly position: number;
}) {
  return (
    <li className="grid grid-cols-[28px_minmax(0,1fr)] items-center gap-3">
      <span
        aria-label={COPY.position(position)}
        className={cn(
          'grid size-7 place-items-center rounded-md text-xs font-semibold tabular-nums',
          position <= PODIUM_SIZE
            ? 'bg-brand-soft text-brand'
            : 'bg-recessed text-ink-muted',
        )}
      >
        {position}
      </span>
      <div className="grid min-w-0 gap-1.5">
        <div className="flex min-w-0 items-baseline justify-between gap-3 text-[13px]">
          <span className="truncate font-medium text-ink">
            {row.nombre}{' '}
            <span className="text-xs font-semibold text-ink-muted">
              ({row.tag})
            </span>
          </span>
          <span className="shrink-0 tabular-nums">
            <Money amount={row.recaudado} />
            <span className="text-xs text-ink-subtle">
              {' '}
              · {formatPct(row.porcentaje)}
            </span>
          </span>
        </div>
        <div
          aria-hidden
          className="h-1.5 overflow-hidden rounded-sm bg-recessed"
        >
          <div
            className="h-full rounded-sm"
            style={{ width: `${row.width}%`, background: row.color }}
          />
        </div>
      </div>
    </li>
  );
}

/** "Ranking de vendedores": barras relativas al primero, E/P en texto (no solo color). */
export function RankingSection({
  vendedores,
}: {
  readonly vendedores: readonly ReporteVendedor[];
}) {
  const rows = rankingRows(vendedores);
  return (
    <Panel title={COPY.title} meta={COPY.total(vendedores.length)}>
      <div className="grid gap-4">
        <ChartLegend className="flex flex-wrap gap-x-4" items={LEGEND} />
        <ol className="grid gap-3">
          {rows.map((row, index) => (
            <RankItem key={row.vendedorId} row={row} position={index + 1} />
          ))}
        </ol>
      </div>
    </Panel>
  );
}
