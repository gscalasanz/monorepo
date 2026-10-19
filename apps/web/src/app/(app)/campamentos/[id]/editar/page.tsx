import { CampamentoFormView } from '@/features/campamentos';

export default async function EditarCampamentoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CampamentoFormView id={id} />;
}
