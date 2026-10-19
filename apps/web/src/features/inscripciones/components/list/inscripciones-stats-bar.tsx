import { LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

import { ChartLegend, DistributionBar } from '@/shared/components/charts';
import { Button } from '@/shared/components/ui/button';
import type { InscripcionesConsolidado } from '@/shared/domain';
import { LIST_COPY as C } from '@/features/inscripciones/constants/copy';
import { ramaShares } from '@/features/inscripciones/helpers/consolidado';

interface InscripcionesStatsBarProps {
  readonly consolidado: InscripcionesConsolidado;
  readonly dashboardHref: string;
}

function segmentsOf(consolidado: InscripcionesConsolidado) {
  return ramaShares({ porRama: consolidado.porRama, total: consolidado.total })
    .filter((share) => share.count > 0)
    .map((share) => ({
      label: share.label,
      value: share.count,
      color: share.color,
    }));
}

/** Total de inscriptos + barra segmentada por rama (solo ramas con >0) + acceso al dashboard. */
export function InscripcionesStatsBar({
  consolidado,
  dashboardHref,
}: InscripcionesStatsBarProps) {
  const segments = segmentsOf(consolidado);
  const summary = segments
    .map((segment) => C.ramaTooltip(segment.label, segment.value))
    .join(', ');
  const legend = segments.map((segment) => ({
    ...segment,
    value: String(segment.value),
  }));
  return (
    <section
      aria-label={C.STATS_LABEL}
      className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-4 shadow-xs md:flex-row md:items-center md:gap-6 md:px-[18px]"
    >
      <p className="flex items-baseline gap-2">
        <span className="text-2xl font-semibold tracking-[-0.025em] text-ink tabular-nums">
          {consolidado.total}
        </span>
        <span className="text-sm text-ink-muted">{C.INSCRIPTOS}</span>
      </p>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        {segments.length > 0 ? (
          <DistributionBar
            segments={segments}
            format={String}
            ariaLabel={`${C.STATS_LABEL}: ${summary}`}
            showLegend={false}
          />
        ) : null}
        <ChartLegend
          className="flex flex-wrap gap-x-5 gap-y-1"
          items={legend}
        />
      </div>
      <Button
        variant="secondary"
        icon={<LayoutDashboard aria-hidden />}
        nativeButton={false}
        render={<Link href={dashboardHref} />}
      >
        {C.VIEW_DASHBOARD}
      </Button>
    </section>
  );
}
