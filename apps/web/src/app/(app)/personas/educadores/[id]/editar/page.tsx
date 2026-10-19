import { EducadorFormView } from '@/features/personas';

export default async function EducadoresEditarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EducadorFormView id={id} />;
}
