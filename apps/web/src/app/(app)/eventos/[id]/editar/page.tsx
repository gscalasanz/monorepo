import { EventoEditView } from '@/features/eventos';

export default async function EditarEventoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EventoEditView id={id} />;
}
