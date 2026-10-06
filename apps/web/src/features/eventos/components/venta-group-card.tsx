'use client';

import { Clock, Wallet, X } from 'lucide-react';

import { Money, StatusBadge } from '@/shared/components/data';
import { Button } from '@/shared/components/ui/button';
import { DATE_FORMATS, formatDate } from '@/shared/time';
import { EVENTOS_COPY } from '@/features/eventos/constants/copy';
import type { VentaGroup } from '@/features/eventos/models/eventos';

const C = EVENTOS_COPY.ventas;

export interface VentaGroupCardProps {
  readonly group: VentaGroup;
  readonly readonly: boolean;
  readonly cobrando: boolean;
  readonly onDelete: (group: VentaGroup) => void;
  readonly onCobrar: (group: VentaGroup) => void;
}

function CobroRow({
  group,
  readonly,
  cobrando,
  onCobrar,
}: VentaGroupCardProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <StatusBadge label={C.aCobrar} tone="warning" icon={Clock} />
      {!readonly && (
        <Button
          size="sm"
          variant="secondary"
          loading={cobrando}
          icon={<Wallet aria-hidden />}
          onClick={() => onCobrar(group)}
        >
          {C.registrarCobro}
        </Button>
      )}
    </div>
  );
}

function GroupHeader({ group, readonly, onDelete }: VentaGroupCardProps) {
  return (
    <header className="flex items-start justify-between gap-2">
      <div className="flex min-w-0 flex-col">
        <span className="truncate text-sm font-semibold text-ink">
          {group.vendedorNombre}
        </span>
        <span className="text-xs text-ink-subtle tabular-nums">
          {formatDate(group.fecha, DATE_FORMATS.dayMonth)}
        </span>
      </div>
      {!readonly && (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={C.eliminar}
          onClick={() => onDelete(group)}
          className="hover:text-danger"
        >
          <X aria-hidden className="size-4" />
        </Button>
      )}
    </header>
  );
}

/** Un lote de ventas: vendedor, fecha, ítems con su ganancia y total si hay más de uno. */
export function VentaGroupCard(props: VentaGroupCardProps) {
  const { group } = props;
  return (
    <article className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 shadow-xs">
      <GroupHeader {...props} />
      {group.aCobrar && <CobroRow {...props} />}
      <ul className="flex flex-col gap-1.5">
        {group.items.map((item) => (
          <li key={item.ventaId} className="flex items-baseline gap-2 text-sm">
            <span
              className="min-w-0 flex-1 truncate text-ink"
              title={item.productoNombre}
            >
              {item.productoNombre}
            </span>
            <span className="text-ink-muted tabular-nums">
              ×{item.cantidad}
            </span>
            <Money amount={item.ganancia} />
          </li>
        ))}
      </ul>
      {!group.isSingleton && (
        <footer className="flex items-baseline gap-2 border-t border-border pt-2 text-sm font-semibold">
          <span className="flex-1 text-ink">{C.total}</span>
          <span className="text-ink-muted tabular-nums">
            {C.unidades(group.totalUnidades)}
          </span>
          <Money amount={group.gananciaTotal} />
        </footer>
      )}
    </article>
  );
}
