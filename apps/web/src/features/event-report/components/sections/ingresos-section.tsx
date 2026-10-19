'use client';

import { Money, type AppColumnDef } from '@/shared/components/data';
import { EmptyState } from '@/shared/components/feedback';
import { Panel } from '@/shared/components/ui/panel';
import { DATE_FORMATS, formatDate } from '@/shared/time';
import { MobileRow } from '@/features/event-report/components/mobile-row';
import {
  NUMERIC_COLUMN_META,
  ReportTable,
} from '@/features/event-report/components/report-table';
import { EVENT_REPORT_COPY } from '@/features/event-report/constants/copy';
import type { ReporteIngreso } from '@/features/event-report/models/report';

const COPY = EVENT_REPORT_COPY.ingresos;
const TABLE = EVENT_REPORT_COPY.egresosTable;
const EMPTY = EVENT_REPORT_COPY.emptyValue;

const fecha = (i: ReporteIngreso) => formatDate(i.fecha, DATE_FORMATS.date);

const COLUMNS: readonly AppColumnDef<ReporteIngreso>[] = [
  { accessorKey: 'descripcion', header: TABLE.concepto },
  {
    id: 'responsable',
    header: TABLE.responsable,
    cell: ({ row }) => row.original.responsableNombre ?? EMPTY,
  },
  { id: 'fecha', header: COPY.fecha, cell: ({ row }) => fecha(row.original) },
  {
    id: 'monto',
    header: TABLE.monto,
    meta: NUMERIC_COLUMN_META,
    cell: ({ row }) => <Money amount={row.original.monto} sign="in" />,
  },
];

function mobileRow(i: ReporteIngreso) {
  return (
    <MobileRow
      title={i.descripcion}
      subtitle={`${fecha(i)} · ${i.responsableNombre ?? EMPTY}`}
      value={<Money amount={i.monto} sign="in" />}
    />
  );
}

/** "Ingresos del evento" (eventos de grupo: ingresos manuales itemizados). */
export function IngresosSection({
  ingresos,
}: {
  readonly ingresos: readonly ReporteIngreso[];
}) {
  return (
    <Panel title={COPY.title} flush>
      <ReportTable
        ariaLabel={COPY.title}
        columns={COLUMNS}
        data={ingresos}
        getRowId={(i) => `${i.fecha}-${i.descripcion}-${i.monto}`}
        mobileRow={mobileRow}
        emptyState={<EmptyState title={COPY.empty} />}
      />
    </Panel>
  );
}
