'use client';

import { Pencil, Trash2 } from 'lucide-react';
import { useMemo } from 'react';

import {
  AppDataGrid,
  MONEY_CELL_CLASS,
  Money,
  RowActionsMenu,
  type AppColumnDef,
} from '@/shared/components/data';
import { EVENTOS_COPY } from '@/features/eventos/constants/copy';
import { gananciaUnitaria } from '@/features/eventos/helpers/evento-detail';
import type { ProductoConVentas } from '@/features/eventos/models/eventos';

const C = EVENTOS_COPY.productos;
const MONEY_META = {
  cellClassName: MONEY_CELL_CLASS,
  headerClassName: MONEY_CELL_CLASS,
} as const;
const ACTIONS_WIDTH = 48;

type Column = AppColumnDef<ProductoConVentas>;

export interface ProductosTableProps {
  readonly productos: readonly ProductoConVentas[];
  readonly readonly: boolean;
  readonly onEdit: (producto: ProductoConVentas) => void;
  readonly onDelete: (producto: ProductoConVentas) => void;
}

function CostoCell({ producto }: { readonly producto: ProductoConVentas }) {
  if (producto.precioCosto === null)
    return <span className="font-medium text-warning">{C.sinCosto}</span>;
  return <Money amount={producto.precioCosto} />;
}

function GananciaCell({ producto }: { readonly producto: ProductoConVentas }) {
  const ganancia = gananciaUnitaria(producto);
  if (ganancia === null)
    return <span className="text-ink-subtle">{C.sinGanancia}</span>;
  return <Money amount={ganancia} sign="auto" />;
}

const DATA_COLUMNS: readonly Column[] = [
  {
    id: 'nombre',
    header: C.colProducto,
    cell: ({ row }) => (
      <span className="font-medium text-ink">{row.original.nombre}</span>
    ),
  },
  {
    id: 'precioVenta',
    header: C.colPrecio,
    meta: MONEY_META,
    cell: ({ row }) => <Money amount={row.original.precioVenta} />,
  },
  {
    id: 'costo',
    header: C.colCosto,
    meta: MONEY_META,
    cell: ({ row }) => <CostoCell producto={row.original} />,
  },
  {
    id: 'ganancia',
    header: C.colGanancia,
    meta: MONEY_META,
    cell: ({ row }) => <GananciaCell producto={row.original} />,
  },
  {
    id: 'vendidas',
    header: C.colVendidas,
    meta: MONEY_META,
    cell: ({ row }) => C.vendidas(row.original.cantidadVendida),
  },
];

function actionsColumn(
  params: Pick<ProductosTableProps, 'onEdit' | 'onDelete'>,
): Column {
  return {
    id: 'actions',
    size: ACTIONS_WIDTH,
    header: () => <span className="sr-only">{C.colAcciones}</span>,
    cell: ({ row }) => (
      <RowActionsMenu
        ariaLabel={C.acciones(row.original.nombre)}
        actions={[
          {
            key: 'edit',
            label: C.editarAccion,
            icon: Pencil,
            onSelect: () => params.onEdit(row.original),
          },
          {
            key: 'delete',
            label: C.eliminarAccion,
            icon: Trash2,
            destructive: true,
            onSelect: () => params.onDelete(row.original),
          },
        ]}
      />
    ),
  };
}

function MobileRow({ producto }: { readonly producto: ProductoConVentas }) {
  return (
    <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
      <div className="flex min-w-0 flex-col">
        <span className="truncate text-sm font-medium text-ink">
          {producto.nombre}
        </span>
        <span className="text-xs text-ink-subtle">
          {C.vendidas(producto.cantidadVendida)}
        </span>
      </div>
      <Money amount={producto.precioVenta} className="shrink-0 text-sm" />
    </div>
  );
}

/** Productos del evento: precio, costo, ganancia unitaria y vendidas; ⋯ editar / eliminar. */
export function ProductosTable({
  productos,
  readonly,
  onEdit,
  onDelete,
}: ProductosTableProps) {
  const columns = useMemo(
    () =>
      readonly
        ? DATA_COLUMNS
        : [...DATA_COLUMNS, actionsColumn({ onEdit, onDelete })],
    [readonly, onEdit, onDelete],
  );
  return (
    <AppDataGrid
      columns={columns}
      data={productos}
      ariaLabel={C.tableLabel}
      getRowId={(producto) => producto.id}
      pagination="none"
      mobileRow={(producto) => <MobileRow producto={producto} />}
    />
  );
}
