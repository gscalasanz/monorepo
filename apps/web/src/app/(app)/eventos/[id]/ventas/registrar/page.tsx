import { VentasLoteView } from '@/features/eventos';

export default async function RegistrarVentasPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <VentasLoteView id={id} />;
}
