'use client';

import { Money } from '@/shared/components/data';
import { CantidadInput } from '@/features/eventos/components/cantidad-input';
import { EVENTOS_COPY } from '@/features/eventos/constants/copy';
import {
  subtotalOf,
  totalGeneral,
  type Cantidades,
} from '@/features/eventos/helpers/ventas-lote';
import type { ProductoConVentas } from '@/features/eventos/models/eventos';

const C = EVENTOS_COPY.lote;
const TH = 'py-1.5 font-medium';
const PRECIO_COL = 'hidden text-right sm:table-cell';

export interface CantidadesTableProps {
  readonly productos: readonly ProductoConVentas[];
  readonly cantidades: Cantidades;
  readonly onChange: (cantidades: Cantidades) => void;
}

function TableHead() {
  return (
    <thead>
      <tr className="text-left text-xs text-ink-subtle">
        <th scope="col" className={TH}>
          {C.colProducto}
        </th>
        <th scope="col" className={`${TH} ${PRECIO_COL}`}>
          {C.colPrecio}
        </th>
        <th scope="col" className={`${TH} text-right`}>
          {C.colCantidad}
        </th>
        <th scope="col" className={`${TH} text-right`}>
          {C.colSubtotal}
        </th>
      </tr>
    </thead>
  );
}

function ProductoRow({
  producto,
  cantidades,
  onChange,
}: Omit<CantidadesTableProps, 'productos'> & {
  readonly producto: ProductoConVentas;
}) {
  return (
    <tr className="border-t border-border">
      <td className="py-2 pr-2 text-ink">
        {producto.nombre}
        <span className="block text-xs text-ink-subtle sm:hidden">
          <Money amount={producto.precioVenta} />
        </span>
      </td>
      <td className={`py-2 pr-2 ${PRECIO_COL}`}>
        <Money amount={producto.precioVenta} />
      </td>
      <td className="py-2 pr-2">
        <div className="flex justify-end">
          <CantidadInput
            label={C.cantidadDe(producto.nombre)}
            value={cantidades[producto.id] ?? null}
            onChange={(value) =>
              onChange({ ...cantidades, [producto.id]: value })
            }
          />
        </div>
      </td>
      <td className="py-2 text-right">
        <Money amount={subtotalOf({ producto, cantidades })} />
      </td>
    </tr>
  );
}

/** Producto | Precio Unit. | Cantidad | Subtotal + "Total General" (a precio de venta). */
export function CantidadesTable({
  productos,
  cantidades,
  onChange,
}: CantidadesTableProps) {
  if (productos.length === 0)
    return <p className="text-sm text-ink-muted">{C.sinProductos}</p>;
  return (
    <table className="w-full text-sm">
      <TableHead />
      <tbody>
        {productos.map((producto) => (
          <ProductoRow
            key={producto.id}
            producto={producto}
            cantidades={cantidades}
            onChange={onChange}
          />
        ))}
      </tbody>
      <tfoot>
        <tr className="border-t border-border-strong font-semibold">
          <td colSpan={3} className="py-2 text-ink">
            {C.totalGeneral}
          </td>
          <td className="py-2 text-right" aria-live="polite">
            <Money amount={totalGeneral({ productos, cantidades })} />
          </td>
        </tr>
      </tfoot>
    </table>
  );
}
