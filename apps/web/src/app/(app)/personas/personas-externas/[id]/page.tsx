import { PersonaExternaDetailView } from '@/features/personas';

export default async function PersonasExternasDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PersonaExternaDetailView id={id} />;
}
