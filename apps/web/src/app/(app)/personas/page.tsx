import { Suspense } from 'react';

import { PersonasListView } from '@/features/personas';

export default function PersonasPage() {
  return (
    <Suspense>
      <PersonasListView />
    </Suspense>
  );
}
