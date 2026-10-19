'use client';

import { CalendarClock } from 'lucide-react';

import { BarChartCard } from '@/shared/components/charts';
import { EmptyState } from '@/shared/components/feedback';
import { Panel } from '@/shared/components/ui/panel';
import { EVENT_REPORT_COPY } from '@/features/event-report/constants/copy';
import {
  HORARIOS_SERIES_KEY,
  franjaPico,
  fueraDeDiaSummary,
  horarioBars,
} from '@/features/event-report/helpers/derived';
import type { ReporteHorarios } from '@/features/event-report/models/report';

const COPY = EVENT_REPORT_COPY.horarios;
const SERIES = [{ key: HORARIOS_SERIES_KEY, label: COPY.series }] as const;

/** "Horarios de entrega": porciones por franja de 30 min del día principal. */
export function HorariosSection({
  horarios,
}: {
  readonly horarios: ReporteHorarios;
}) {
  const subtitle = COPY.subtitle(horarios.diaPrincipal);
  const pico = franjaPico(horarios);
  const fuera = fueraDeDiaSummary(horarios);
  const note = fuera ? (
    <p className="px-1 text-xs text-ink-muted">
      {COPY.fueraDeDia(fuera.total, fuera.dias)}
    </p>
  ) : null;
  if (pico === null) {
    return (
      <Panel title={COPY.title} meta={subtitle}>
        <EmptyState icon={CalendarClock} title={COPY.empty} />
        {note}
      </Panel>
    );
  }
  return (
    <div className="grid gap-2">
      <BarChartCard
        title={COPY.title}
        action={<span className="text-[13px] text-ink-subtle">{subtitle}</span>}
        ariaLabel={COPY.chartLabel(pico)}
        data={horarioBars(horarios)}
        series={SERIES}
      />
      {note}
    </div>
  );
}
