import { InscripcionEditView } from '@/features/inscripciones';

/** Paridad con Angular: `:id/pago` abre el mismo form de edición. */
export default async function PagoInscripcionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <InscripcionEditView id={id} />;
}
