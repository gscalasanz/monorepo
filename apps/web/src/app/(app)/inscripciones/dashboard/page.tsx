import { Suspense } from 'react';

import { InscripcionesDashboardView } from '@/features/inscripciones';

export default function InscripcionesDashboardPage() {
  return (
    <Suspense>
      <InscripcionesDashboardView />
    </Suspense>
  );
}
