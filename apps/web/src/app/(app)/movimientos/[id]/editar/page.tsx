import { MovimientoEditView } from '@/features/movimientos';

export default async function EditarMovimientoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <MovimientoEditView id={id} />;
}
