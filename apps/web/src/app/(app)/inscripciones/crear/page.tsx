import { Suspense } from 'react';

import { InscripcionCreateView } from '@/features/inscripciones';

export default function CrearInscripcionPage() {
  return (
    <Suspense>
      <InscripcionCreateView />
    </Suspense>
  );
}
