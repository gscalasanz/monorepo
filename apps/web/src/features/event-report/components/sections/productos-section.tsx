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
import { productoSlices } from '@/features/event-report/helpers/derived';
import { formatPct } from '@/features/event-report/helpers/format';
import type { ReporteProducto } from '@/features/event-report/models/report';

const COPY = EVENT_REPORT_COPY.productos;
const COLS = EVENT_REPORT_COPY.columns;

const COLUMNS: readonly AppColumnDef<ReporteProducto>[] = [
  { accessorKey: 'nombre', header: COPY.producto },
  {
    id: 'costo',
    header: COPY.costo,
    meta: NUMERIC_COLUMN_META,
    cell: ({ row }) => <Money amount={row.original.precioCosto} />,
  },
  {
    id: 'venta',
    header: COPY.venta,
    meta: NUMERIC_COLUMN_META,
    cell: ({ row }) => <Money amount={row.original.precioVenta} />,
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

function mobileRow(p: ReporteProducto) {
  return (
    <MobileRow
      title={p.nombre}
      subtitle={`${p.unidades} ${COLS.unidades} · ${formatPct(p.porcentaje)}`}
      value={<Money amount={p.recaudado} />}
    />
  );
}

/** "Productos": tabla de recaudación por producto + dona. */
export function ProductosSection({
  productos,
}: {
  readonly productos: readonly ReporteProducto[];
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
      <Panel title={COPY.title} flush>
        <ReportTable
          ariaLabel={COPY.title}
          columns={COLUMNS}
          data={productos}
          getRowId={(p) => p.nombre}
          mobileRow={mobileRow}
        />
      </Panel>
      <Panel title={COPY.chartLabel}>
        <DonutChart
          ariaLabel={COPY.chartLabel}
          data={productoSlices(productos)}
        />
      </Panel>
    </div>
  );
}
