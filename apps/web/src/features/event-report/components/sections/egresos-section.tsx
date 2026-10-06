'use client';

import { Money, type AppColumnDef } from '@/shared/components/data';
import { formatMoney } from '@/shared/format';
import { Panel } from '@/shared/components/ui/panel';
import { MobileRow } from '@/features/event-report/components/mobile-row';
import {
  NUMERIC_COLUMN_META,
  ReportTable,
} from '@/features/event-report/components/report-table';
import { EVENT_REPORT_COPY } from '@/features/event-report/constants/copy';
import { sumMontos } from '@/features/event-report/helpers/derived';
import { medioPagoLabel } from '@/features/event-report/helpers/format';
import type { ReporteEgreso } from '@/features/event-report/models/report';

const TABLE = EVENT_REPORT_COPY.egresosTable;
const EMPTY = EVENT_REPORT_COPY.emptyValue;

const COLUMNS: readonly AppColumnDef<ReporteEgreso>[] = [
  { accessorKey: 'descripcion', header: TABLE.concepto },
  {
    id: 'responsable',
    header: TABLE.responsable,
    cell: ({ row }) => row.original.responsableNombre ?? EMPTY,
  },
  {
    id: 'medio',
    header: TABLE.medio,
    cell: ({ row }) => (
      <span className="rounded-sm bg-recessed px-1.5 py-0.5 text-xs text-ink-muted">
        {medioPagoLabel(row.original.medioPago)}
      </span>
    ),
  },
  {
    id: 'monto',
    header: TABLE.monto,
    meta: NUMERIC_COLUMN_META,
    cell: ({ row }) => <Money amount={row.original.monto} />,
  },
];

function mobileRow(e: ReporteEgreso) {
  return (
    <MobileRow
      title={e.descripcion}
      subtitle={`${medioPagoLabel(e.medioPago)} · ${e.responsableNombre ?? EMPTY}`}
      value={<Money amount={e.monto} />}
    />
  );
}

export interface EgresosSectionProps {
  readonly title: string;
  readonly totalLabel: string;
  readonly egresos: readonly ReporteEgreso[];
}

/** Tabla de egresos con total ("Egresos del evento" y "Pendiente de pago"). */
export function EgresosSection({
  title,
  totalLabel,
  egresos,
}: EgresosSectionProps) {
  const total = sumMontos(egresos);
  return (
    <Panel title={title} meta={formatMoney(total)} flush>
      <ReportTable
        ariaLabel={title}
        columns={COLUMNS}
        data={egresos}
        mobileRow={mobileRow}
        footer={{ label: totalLabel, value: <Money amount={total} /> }}
      />
    </Panel>
  );
}
