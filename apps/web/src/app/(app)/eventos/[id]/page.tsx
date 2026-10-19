import { Suspense } from 'react';

import { EventoDetailView } from '@/features/eventos';

export default async function EventoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <Suspense>
      <EventoDetailView id={id} />
    </Suspense>
  );
}
