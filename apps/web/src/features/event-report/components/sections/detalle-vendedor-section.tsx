'use client';

import { Money, type AppColumnDef } from '@/shared/components/data';
import { Panel } from '@/shared/components/ui/panel';
import { cn } from '@/shared/lib/utils';
import { MobileRow } from '@/features/event-report/components/mobile-row';
import {
  NUMERIC_COLUMN_META,
  ReportTable,
} from '@/features/event-report/components/report-table';
import { isEducador } from '@/features/event-report/constants/colors';
import { EVENT_REPORT_COPY } from '@/features/event-report/constants/copy';
import { formatPct } from '@/features/event-report/helpers/format';
import type { ReporteVendedor } from '@/features/event-report/models/report';

const COPY = EVENT_REPORT_COPY.detalle;
const COLS = EVENT_REPORT_COPY.columns;

const tipoCorto = (v: ReporteVendedor) =>
  isEducador(v.tipo) ? COPY.educador : COPY.protagonista;

/** Pendiente negativo = se entregó más de lo vendido: se marca en rojo (y con signo). */
function Pendiente({ value }: { readonly value: number }) {
  return (
    <span className={cn(value < 0 && 'font-medium text-danger')}>{value}</span>
  );
}

const COLUMNS: readonly AppColumnDef<ReporteVendedor>[] = [
  { accessorKey: 'nombre', header: COPY.vendedor },
  {
    id: 'tipo',
    header: COPY.tipo,
    cell: ({ row }) => (
      <span className="rounded-sm bg-recessed px-1.5 py-0.5 text-xs text-ink-muted">
        {tipoCorto(row.original)}
      </span>
    ),
  },
  {
    id: 'rama',
    header: COPY.rama,
    cell: ({ row }) => row.original.rama ?? EVENT_REPORT_COPY.emptyValue,
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
  {
    accessorKey: 'entregado',
    header: COPY.entregado,
    meta: NUMERIC_COLUMN_META,
  },
  {
    id: 'pendiente',
    header: COPY.pendiente,
    meta: NUMERIC_COLUMN_META,
    cell: ({ row }) => <Pendiente value={row.original.pendiente} />,
  },
];

function mobileRow(v: ReporteVendedor) {
  return (
    <MobileRow
      title={v.nombre}
      subtitle={`${tipoCorto(v)} · ${v.rama ?? EVENT_REPORT_COPY.emptyValue} · ${v.unidades} ${COLS.unidades} · ${COPY.entregado} ${v.entregado} · ${COPY.pendiente} ${v.pendiente}`}
      value={<Money amount={v.recaudado} />}
    />
  );
}

/** "Detalle por vendedor". */
export function DetalleVendedorSection({
  vendedores,
}: {
  readonly vendedores: readonly ReporteVendedor[];
}) {
  return (
    <Panel title={COPY.title} flush>
      <ReportTable
        ariaLabel={COPY.title}
        columns={COLUMNS}
        data={vendedores}
        getRowId={(v) => v.vendedorId}
        mobileRow={mobileRow}
      />
    </Panel>
  );
}
