import { PersonaFichaView } from '@/features/personas';

export default async function ProtagonistasDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PersonaFichaView id={id} />;
}
