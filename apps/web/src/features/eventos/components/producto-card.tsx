'use client';

import { Pencil, ShoppingBag, Trash2 } from 'lucide-react';
import type { ReactNode } from 'react';

import { Money } from '@/shared/components/data';
import { Button } from '@/shared/components/ui/button';
import { EVENTOS_COPY } from '@/features/eventos/constants/copy';
import { gananciaUnitaria } from '@/features/eventos/helpers/evento-detail';
import type { ProductoConVentas } from '@/features/eventos/models/eventos';

const C = EVENTOS_COPY.productos;

export interface ProductoCardProps {
  readonly producto: ProductoConVentas;
  readonly readonly: boolean;
  readonly deleting: boolean;
  readonly onEdit: (producto: ProductoConVentas) => void;
  readonly onDelete: (producto: ProductoConVentas) => void;
}

function Stat({
  label,
  children,
}: {
  readonly label: string;
  readonly children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-ink-subtle">{label}</span>
      <span className="text-sm">{children}</span>
    </div>
  );
}

function CardActions({
  producto,
  deleting,
  onEdit,
  onDelete,
}: ProductoCardProps) {
  return (
    <div className="flex shrink-0 gap-1">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={C.editar}
        onClick={() => onEdit(producto)}
      >
        <Pencil aria-hidden className="size-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={C.eliminar}
        loading={deleting}
        onClick={() => onDelete(producto)}
        className="hover:text-danger"
      >
        {deleting ? null : <Trash2 aria-hidden className="size-4" />}
      </Button>
    </div>
  );
}

/** Producto: precio de venta, costo, ganancia unitaria y unidades vendidas. */
export function ProductoCard(props: ProductoCardProps) {
  const { producto } = props;
  const ganancia = gananciaUnitaria(producto);
  return (
    <article className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 shadow-xs">
      <header className="flex items-start justify-between gap-2">
        <h3 className="min-w-0 text-sm font-semibold break-words text-ink">
          {producto.nombre}
        </h3>
        {!props.readonly && <CardActions {...props} />}
      </header>
      <p className="flex flex-col">
        <Money amount={producto.precioVenta} size="figure-md" />
        <span className="text-xs text-ink-subtle">{C.precioVenta}</span>
      </p>
      <div className="grid grid-cols-2 gap-3 border-t border-border pt-3">
        <Stat label={C.costo}>
          {producto.precioCosto === null ? (
            <span className="font-medium text-warning">{C.sinCosto}</span>
          ) : (
            <Money amount={producto.precioCosto} />
          )}
        </Stat>
        <Stat label={C.ganancia}>
          {ganancia === null ? (
            <span className="text-ink-subtle">{C.sinGanancia}</span>
          ) : (
            <Money amount={ganancia} sign="auto" />
          )}
        </Stat>
      </div>
      <p className="flex items-center gap-1.5 text-[13px] text-ink-muted">
        <ShoppingBag aria-hidden className="size-4" />
        {C.vendidas(producto.cantidadVendida)}
      </p>
    </article>
  );
}
