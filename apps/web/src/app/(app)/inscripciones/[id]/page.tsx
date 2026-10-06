import { InscripcionDetailView } from '@/features/inscripciones';

export default async function InscripcionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <InscripcionDetailView id={id} />;
}
