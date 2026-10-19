import { Suspense } from 'react';

import { InscripcionesListView } from '@/features/inscripciones';

export default function InscripcionesPage() {
  return (
    <Suspense>
      <InscripcionesListView />
    </Suspense>
  );
}
