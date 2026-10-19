'use client';

import { Money, type AppColumnDef } from '@/shared/components/data';
import { EmptyState } from '@/shared/components/feedback';
import { Panel } from '@/shared/components/ui/panel';
import { MobileRow } from '@/features/event-report/components/mobile-row';
import {
  NUMERIC_COLUMN_META,
  ReportTable,
} from '@/features/event-report/components/report-table';
import { EVENT_REPORT_COPY } from '@/features/event-report/constants/copy';
import type { ReporteGananciaPersona } from '@/features/event-report/models/report';

const COPY = EVENT_REPORT_COPY.ganancia;

const COLUMNS: readonly AppColumnDef<ReporteGananciaPersona>[] = [
  { accessorKey: 'nombre', header: COPY.persona },
  {
    id: 'ganancia',
    header: COPY.ganancia,
    meta: NUMERIC_COLUMN_META,
    cell: ({ row }) => <Money amount={row.original.ganancia} />,
  },
];

function mobileRow(g: ReporteGananciaPersona) {
  return (
    <MobileRow
      title={g.nombre}
      subtitle={COPY.ganancia}
      value={<Money amount={g.ganancia} />}
    />
  );
}

/** "Ganancia por persona" (cuentas personales / mixto). */
export function GananciaSection({
  ganancias,
}: {
  readonly ganancias: readonly ReporteGananciaPersona[];
}) {
  return (
    <Panel title={COPY.title} flush>
      <ReportTable
        ariaLabel={COPY.title}
        columns={COLUMNS}
        data={ganancias}
        getRowId={(g) => g.personaId}
        mobileRow={mobileRow}
        emptyState={<EmptyState title={COPY.empty} />}
      />
    </Panel>
  );
}
