import { Suspense } from 'react';

import { MovimientosListView } from '@/features/movimientos';

/** Paridad: Angular no tiene detalle ruteado; `/movimientos/:id` muestra la lista. */
export default function MovimientoDetailPage() {
  return (
    <Suspense>
      <MovimientosListView />
    </Suspense>
  );
}
