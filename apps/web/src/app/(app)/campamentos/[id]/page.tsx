import { CampamentoDetailView } from '@/features/campamentos';

export default async function CampamentoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CampamentoDetailView id={id} />;
}
