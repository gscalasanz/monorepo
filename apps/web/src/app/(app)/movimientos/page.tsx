import { Suspense } from 'react';

import { MovimientosListView } from '@/features/movimientos';

export default function MovimientosPage() {
  return (
    <Suspense>
      <MovimientosListView />
    </Suspense>
  );
}
