'use client';

import { Info } from 'lucide-react';

import type { AppColumnDef } from '@/shared/components/data';
import { Panel } from '@/shared/components/ui/panel';
import { MobileRow } from '@/features/event-report/components/mobile-row';
import {
  NUMERIC_COLUMN_META,
  ReportTable,
} from '@/features/event-report/components/report-table';
import { EVENT_REPORT_COPY } from '@/features/event-report/constants/copy';
import { stockPendientePct } from '@/features/event-report/helpers/derived';
import type {
  ReporteStock,
  ReporteStockProducto,
} from '@/features/event-report/models/report';

const COPY = EVENT_REPORT_COPY.stock;

const COLUMNS: readonly AppColumnDef<ReporteStockProducto>[] = [
  { accessorKey: 'nombre', header: COPY.producto },
  { accessorKey: 'vendido', header: COPY.vendido, meta: NUMERIC_COLUMN_META },
  {
    accessorKey: 'entregado',
    header: COPY.entregado,
    meta: NUMERIC_COLUMN_META,
  },
  {
    accessorKey: 'pendiente',
    header: COPY.pendiente,
    meta: NUMERIC_COLUMN_META,
  },
];

function mobileRow(p: ReporteStockProducto) {
  return (
    <MobileRow
      title={p.nombre}
      subtitle={`${COPY.vendido} ${p.vendido} · ${COPY.entregado} ${p.entregado}`}
      value={`${COPY.pendiente} ${p.pendiente}`}
    />
  );
}

/** "Vendido vs. entregado": stock pendiente de retiro por producto + total. */
export function StockSection({ stock }: { readonly stock: ReporteStock }) {
  const totals = `${COPY.vendido} ${stock.totalVendido} · ${COPY.entregado} ${stock.totalEntregado} · ${COPY.pendiente} ${stock.totalPendiente}`;
  return (
    <Panel title={COPY.title} meta={COPY.subtitle} flush>
      <ReportTable
        ariaLabel={COPY.title}
        columns={COLUMNS}
        data={stock.productos}
        getRowId={(p) => p.nombre}
        mobileRow={mobileRow}
        footer={{ label: COPY.total, value: totals }}
      />
      {stock.totalPendiente > 0 ? (
        <p className="flex items-start gap-2 border-t border-border bg-info-soft px-4 py-3 text-[13px] text-ink md:px-[18px]">
          <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-info" />
          {COPY.note(stock.totalPendiente, stockPendientePct(stock))}
        </p>
      ) : null}
    </Panel>
  );
}
