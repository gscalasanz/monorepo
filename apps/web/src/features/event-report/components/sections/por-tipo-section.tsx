'use client';

import { DistributionBar } from '@/shared/components/charts';
import { Money, type AppColumnDef } from '@/shared/components/data';
import { Panel } from '@/shared/components/ui/panel';
import { MobileRow } from '@/features/event-report/components/mobile-row';
import {
  NUMERIC_COLUMN_META,
  ReportTable,
} from '@/features/event-report/components/report-table';
import { EVENT_REPORT_COPY } from '@/features/event-report/constants/copy';
import { porTipoSegments } from '@/features/event-report/helpers/derived';
import { formatPct } from '@/features/event-report/helpers/format';
import type { ReportePorTipo } from '@/features/event-report/models/report';

const COPY = EVENT_REPORT_COPY.porTipo;
const COLS = EVENT_REPORT_COPY.columns;

const COLUMNS: readonly AppColumnDef<ReportePorTipo>[] = [
  { accessorKey: 'label', header: COPY.tipo },
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

function mobileRow(t: ReportePorTipo) {
  return (
    <MobileRow
      title={t.label}
      subtitle={`${t.vendedores} ${COLS.vendedores} · ${t.unidades} ${COLS.unidades} · ${formatPct(t.porcentaje)}`}
      value={<Money amount={t.recaudado} />}
    />
  );
}

/** "Recaudación por tipo de persona": barra de distribución + tabla. */
export function PorTipoSection({
  porTipo,
}: {
  readonly porTipo: readonly ReportePorTipo[];
}) {
  return (
    <Panel title={COPY.title} flush>
      <div className="border-b border-border p-4 md:p-[18px]">
        <DistributionBar
          ariaLabel={COPY.chartLabel}
          segments={porTipoSegments(porTipo)}
        />
      </div>
      <ReportTable
        ariaLabel={COPY.title}
        columns={COLUMNS}
        data={porTipo}
        getRowId={(t) => t.tipo}
        mobileRow={mobileRow}
      />
    </Panel>
  );
}
