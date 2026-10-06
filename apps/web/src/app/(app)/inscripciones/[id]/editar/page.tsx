import { InscripcionEditView } from '@/features/inscripciones';

export default async function EditarInscripcionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <InscripcionEditView id={id} />;
}
