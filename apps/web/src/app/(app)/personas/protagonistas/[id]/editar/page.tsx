import { ProtagonistaFormView } from '@/features/personas';

export default async function ProtagonistasEditarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProtagonistaFormView id={id} />;
}
