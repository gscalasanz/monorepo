'use client';

import { Info, Package, Plus } from 'lucide-react';
import { useState } from 'react';

import { EmptyState } from '@/shared/components/feedback';
import { Button } from '@/shared/components/ui/button';
import { TIPO_EVENTO, type Evento } from '@/shared/domain';
import { notify } from '@/shared/notifications';
import { ProductoCard } from '@/features/eventos/components/producto-card';
import { ProductoDialog } from '@/features/eventos/components/producto-dialog';
import { EVENTOS_COPY } from '@/features/eventos/constants/copy';
import { productosSinCosto } from '@/features/eventos/helpers/evento-detail';
import type { ProductoConVentas } from '@/features/eventos/models/eventos';
import { deleteProducto } from '@/features/eventos/services/ventas-api';

const C = EVENTOS_COPY.productos;

export interface ProductosTabProps {
  readonly evento: Evento;
  readonly productos: readonly ProductoConVentas[];
  readonly onChanged: () => Promise<void>;
}

/** `undefined` = cerrado · `null` = alta · producto = edición. */
type DialogTarget = ProductoConVentas | null | undefined;

function PendientesBanner({
  productos,
}: {
  readonly productos: readonly ProductoConVentas[];
}) {
  return (
    <p className="flex items-start gap-2 rounded-lg bg-info-soft px-3 py-2.5 text-sm text-info">
      <Info aria-hidden className="mt-0.5 size-4 shrink-0" />
      <span>
        {C.pendientesBanner}{' '}
        {productosSinCosto(productos).length > 0
          ? C.pendientesSinCosto
          : C.pendientesListo}
      </span>
    </p>
  );
}

function useProductoDelete(onChanged: () => Promise<void>) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const remove = async (producto: ProductoConVentas): Promise<void> => {
    setDeletingId(producto.id);
    try {
      await deleteProducto(producto.id);
      notify.success(C.deleted);
      await onChanged();
    } catch {
      // El error del backend ya lo muestra el toast global.
    } finally {
      setDeletingId(null);
    }
  };
  return { deletingId, remove };
}

/** Tab Productos: banner de movimientos pendientes, alta/edición y borrado (sin confirmación, como Angular). */
export function ProductosTab({
  evento,
  productos,
  onChanged,
}: ProductosTabProps) {
  const [target, setTarget] = useState<DialogTarget>(undefined);
  const { deletingId, remove } = useProductoDelete(onChanged);
  const readonly = evento.estaCerrado;
  return (
    <div className="flex flex-col gap-4">
      {evento.tipo === TIPO_EVENTO.VENTA && !evento.movimientosHabilitados && (
        <PendientesBanner productos={productos} />
      )}
      {!readonly && (
        <div>
          <Button icon={<Plus aria-hidden />} onClick={() => setTarget(null)}>
            {C.gestionar}
          </Button>
        </div>
      )}
      {productos.length === 0 ? (
        <EmptyState icon={Package} title={C.emptyTitle} hint={C.emptyHint} />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {productos.map((producto) => (
            <ProductoCard
              key={producto.id}
              producto={producto}
              readonly={readonly}
              deleting={deletingId === producto.id}
              onEdit={setTarget}
              onDelete={(p) => void remove(p)}
            />
          ))}
        </div>
      )}
      <ProductoDialog
        key={target === undefined ? 'closed' : (target?.id ?? 'new')}
        open={target !== undefined}
        onOpenChange={(open) => !open && setTarget(undefined)}
        eventoId={evento.id}
        producto={target ?? null}
        preciosBloqueados={evento.movimientosHabilitados}
        onSaved={() => void onChanged()}
      />
    </div>
  );
}
