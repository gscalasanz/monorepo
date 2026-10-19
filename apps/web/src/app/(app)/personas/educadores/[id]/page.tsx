import { PersonaFichaView } from '@/features/personas';

export default async function EducadoresDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PersonaFichaView id={id} />;
}
