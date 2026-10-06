'use client';

import { Package } from 'lucide-react';

import { CantidadInput } from '@/features/eventos/components/cantidad-input';
import { EVENTOS_COPY } from '@/features/eventos/constants/copy';
import type { Cantidades } from '@/features/eventos/helpers/ventas-lote';
import type { ProductoDisponible } from '@/features/eventos/models/eventos';

const C = EVENTOS_COPY.entregaDialog;
const TH = 'py-1.5 font-medium';

interface EntregaCantidadesForm {
  readonly productos: readonly ProductoDisponible[];
  readonly cantidades: Cantidades;
  readonly setCantidad: (productoId: string, value: number | null) => void;
}

export interface EntregaProductosTableProps {
  readonly form: EntregaCantidadesForm;
}

function isInvalid(cantidad: number | null, max: number): boolean {
  return cantidad !== null && (cantidad < 0 || cantidad > max);
}

function ProductoRow({
  form,
  producto,
}: {
  readonly form: EntregaCantidadesForm;
  readonly producto: ProductoDisponible;
}) {
  const cantidad = form.cantidades[producto.productoId] ?? null;
  const invalid = isInvalid(cantidad, producto.cantidadDisponible);
  return (
    <tr className="border-t border-border">
      <td className="py-2 pr-2 text-ink">{producto.productoNombre}</td>
      <td className="py-2 pr-2 text-right text-ink-muted tabular-nums">
        {producto.cantidadDisponible}
      </td>
      <td className="py-2">
        <div className="flex flex-col items-end gap-1">
          <CantidadInput
            label={C.cantidadDe(producto.productoNombre)}
            value={cantidad}
            max={producto.cantidadDisponible}
            invalid={invalid}
            onChange={(value) => form.setCantidad(producto.productoId, value)}
          />
          {invalid && (
            <span className="text-xs text-danger">
              {C.excede(producto.cantidadDisponible)}
            </span>
          )}
        </div>
      </td>
    </tr>
  );
}

function ProductosTable({ form }: EntregaProductosTableProps) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-xs text-ink-subtle">
          <th scope="col" className={TH}>
            {C.colProducto}
          </th>
          <th scope="col" className={`${TH} text-right`}>
            {C.colDisponible}
          </th>
          <th scope="col" className={`${TH} text-right`}>
            {C.colEntregar}
          </th>
        </tr>
      </thead>
      <tbody>
        {form.productos.map((producto) => (
          <ProductoRow
            key={producto.productoId}
            form={form}
            producto={producto}
          />
        ))}
      </tbody>
    </table>
  );
}

/** "Productos a entregar": Producto | Disponible | A entregar (≤ disponible). */
export function EntregaProductosTable({ form }: EntregaProductosTableProps) {
  return (
    <section className="flex flex-col gap-2">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-ink">
        <Package aria-hidden className="size-4 text-ink-muted" />
        {C.productos}
      </h3>
      {form.productos.length === 0 ? (
        <p className="text-sm text-ink-muted">{C.sinStock}</p>
      ) : (
        <ProductosTable form={form} />
      )}
    </section>
  );
}
