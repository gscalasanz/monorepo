import { Suspense } from 'react';

import { CajasView } from '@/features/cajas';

export default function CajasPage() {
  return (
    <Suspense>
      <CajasView />
    </Suspense>
  );
}
