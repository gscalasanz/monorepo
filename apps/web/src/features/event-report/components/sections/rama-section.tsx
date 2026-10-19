'use client';

import { DonutChart } from '@/shared/components/charts';
import { Money, type AppColumnDef } from '@/shared/components/data';
import { Panel } from '@/shared/components/ui/panel';
import { MobileRow } from '@/features/event-report/components/mobile-row';
import {
  NUMERIC_COLUMN_META,
  ReportTable,
} from '@/features/event-report/components/report-table';
import { EVENT_REPORT_COPY } from '@/features/event-report/constants/copy';
import { ramaSlices } from '@/features/event-report/helpers/derived';
import { formatPct } from '@/features/event-report/helpers/format';
import type { ReportePorRama } from '@/features/event-report/models/report';

const COPY = EVENT_REPORT_COPY.rama;
const COLS = EVENT_REPORT_COPY.columns;

const COLUMNS: readonly AppColumnDef<ReportePorRama>[] = [
  { accessorKey: 'grupo', header: COPY.grupo },
  {
    accessorKey: 'vendedores',
    header: COLS.vendedores,
    meta: NUMERIC_COLUMN_META,
  },
  { accessorKey: 'unidades', header: COLS.unidades, meta: NUMERIC_COLUMN_META },
  {
    id: 'recaudado',
    header: COLS.recaudado,
    meta: NUMERIC_COLUMN_META,
    cell: ({ row }) => <Money amount={row.original.recaudado} />,
  },
  {
    id: 'porcentaje',
    header: COLS.porcentaje,
    meta: NUMERIC_COLUMN_META,
    cell: ({ row }) => formatPct(row.original.porcentaje),
  },
];

function mobileRow(r: ReportePorRama) {
  return (
    <MobileRow
      title={r.grupo}
      subtitle={`${r.vendedores} ${COLS.vendedores} · ${r.unidades} ${COLS.unidades} · ${formatPct(r.porcentaje)}`}
      value={<Money amount={r.recaudado} />}
    />
  );
}

/** "Participación por rama": dona (colores de rama) + tabla. */
export function RamaSection({
  porRama,
}: {
  readonly porRama: readonly ReportePorRama[];
}) {
  return (
    <Panel title={COPY.title} meta={COPY.subtitle} flush>
      <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="border-b border-border p-4 md:p-[18px] lg:border-r lg:border-b-0">
          <DonutChart ariaLabel={COPY.chartLabel} data={ramaSlices(porRama)} />
        </div>
        <ReportTable
          ariaLabel={COPY.title}
          columns={COLUMNS}
          data={porRama}
          getRowId={(r) => r.grupo}
          mobileRow={mobileRow}
        />
      </div>
    </Panel>
  );
}
