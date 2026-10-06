import { Suspense } from 'react';

import { MovimientoCreateView } from '@/features/movimientos';

export default function NuevoMovimientoPage() {
  return (
    <Suspense>
      <MovimientoCreateView />
    </Suspense>
  );
}
