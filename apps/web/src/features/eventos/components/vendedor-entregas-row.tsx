'use client';

import {
  ChevronRight,
  CircleCheck,
  NotebookPen,
  Plus,
  Trash2,
} from 'lucide-react';
import { useId, useState } from 'react';

import { StatusBadge } from '@/shared/components/data';
import { Button } from '@/shared/components/ui/button';
import type { Entrega } from '@/shared/domain';
import { cn } from '@/shared/lib/utils';
import { EVENTOS_COPY } from '@/features/eventos/constants/copy';
import {
  entregaFechaLabel,
  isEntregaCompleta,
} from '@/features/eventos/helpers/entregas';
import type {
  ProductoEntregaKpi,
  VendedorEntregasRow,
} from '@/features/eventos/models/eventos';

const C = EVENTOS_COPY.entregas;

export interface VendedorEntregasRowProps {
  readonly row: VendedorEntregasRow;
  readonly readonly: boolean;
  readonly onRegistrar: (vendedorId: string) => void;
  readonly onDelete: (entrega: Entrega) => void;
}

function ProductoChip({ producto }: { readonly producto: ProductoEntregaKpi }) {
  const completo = isEntregaCompleta(producto);
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-xs',
        completo
          ? 'bg-success-soft text-success'
          : 'bg-recessed text-ink-muted',
      )}
    >
      {completo && <CircleCheck aria-hidden className="size-3" />}
      {producto.productoNombre}
      <strong className="tabular-nums">
        {producto.cantidadEntregada}/{producto.cantidadVendida}
      </strong>
    </span>
  );
}

function EntregaItem({
  entrega,
  readonly,
  onDelete,
}: Pick<VendedorEntregasRowProps, 'readonly' | 'onDelete'> & {
  readonly entrega: Entrega;
}) {
  const fecha = entregaFechaLabel(entrega);
  return (
    <li className="flex items-start justify-between gap-2 rounded-lg bg-recessed p-3">
      <div className="flex min-w-0 flex-col gap-1 text-sm">
        <span className="text-xs text-ink-subtle tabular-nums">{fecha}</span>
        <ul>
          {entrega.lineas.map((linea) => (
            <li key={linea.id} className="text-ink">
              <span className="font-semibold tabular-nums">
                {linea.cantidad}
              </span>{' '}
              {linea.productoNombre}
            </li>
          ))}
        </ul>
        {entrega.notas && (
          <p className="flex items-start gap-1.5 text-ink-muted">
            <NotebookPen aria-hidden className="mt-0.5 size-3.5 shrink-0" />
            {entrega.notas}
          </p>
        )}
      </div>
      {!readonly && (
        <Button
          variant="ghost"
          size="icon-sm"
          title={C.eliminar}
          aria-label={C.eliminarDel(fecha)}
          onClick={() => onDelete(entrega)}
          className="hover:text-danger"
        >
          <Trash2 aria-hidden className="size-4" />
        </Button>
      )}
    </li>
  );
}

function RowStatus({ row, readonly, onRegistrar }: VendedorEntregasRowProps) {
  if (!row.tieneStockDisponible)
    return (
      <StatusBadge label={C.todoEntregado} tone="success" icon={CircleCheck} />
    );
  if (readonly) return null;
  return (
    <Button
      size="sm"
      icon={<Plus aria-hidden />}
      aria-label={C.registrarPara(row.vendedorNombre)}
      onClick={() => onRegistrar(row.vendedorId)}
    >
      {C.registrar}
    </Button>
  );
}

function EntregasHistorial({
  id,
  row,
  readonly,
  onDelete,
}: VendedorEntregasRowProps & { readonly id: string }) {
  return (
    <div id={id} className="border-t border-border p-3">
      {row.entregas.length === 0 ? (
        <p className="text-sm text-ink-muted">{C.sinEntregas}</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {row.entregas.map((entrega) => (
            <EntregaItem
              key={entrega.id}
              entrega={entrega}
              readonly={readonly}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

/** Vendedor expandible: chips entregado/vendido + historial de entregas. */
export function VendedorEntregasRowItem(props: VendedorEntregasRowProps) {
  const { row } = props;
  const [expanded, setExpanded] = useState(false);
  const detailsId = useId();
  return (
    <li className="rounded-xl border border-border bg-surface shadow-xs">
      <div className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={detailsId}
          onClick={() => setExpanded((prev) => !prev)}
          className="flex min-h-11 min-w-0 flex-1 items-start gap-2 rounded-md text-left focus-visible:outline-2 focus-visible:outline-focus"
        >
          <ChevronRight
            aria-hidden
            className={cn(
              'mt-0.5 size-4 shrink-0 text-ink-muted transition-transform',
              expanded && 'rotate-90',
            )}
          />
          <span className="flex min-w-0 flex-col gap-1.5">
            <span className="text-sm font-semibold text-ink">
              {row.vendedorNombre}
            </span>
            <span className="flex flex-wrap gap-1.5">
              {row.productos.map((producto) => (
                <ProductoChip key={producto.productoId} producto={producto} />
              ))}
            </span>
          </span>
        </button>
        <RowStatus {...props} />
      </div>
      {expanded && <EntregasHistorial id={detailsId} {...props} />}
    </li>
  );
}
