import { PersonaExternaFormView } from '@/features/personas';

export default async function PersonasExternasEditarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PersonaExternaFormView id={id} />;
}
