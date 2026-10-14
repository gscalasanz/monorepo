import { KeyValueList, Money } from '@/shared/components/data';
import { TIPO_INSCRIPCION_LABELS, type Inscripcion } from '@/shared/domain';
import { FORM_COPY as C } from '@/features/inscripciones/constants/copy';
import { FormSection } from '@/features/inscripciones/components/form/form-section';

/** "Datos de la Inscripción" en edición: persona, tipo, año y monto no se modifican. */
export function InscripcionSummary({
  inscripcion,
}: {
  readonly inscripcion: Inscripcion;
}) {
  const items = [
    {
      label: C.PERSONA_LABEL,
      value: inscripcion.persona?.nombre ?? inscripcion.personaId,
    },
    { label: C.TIPO, value: TIPO_INSCRIPCION_LABELS[inscripcion.tipo] },
    { label: C.ANO, value: inscripcion.ano },
    { label: C.MONTO_TOTAL, value: <Money amount={inscripcion.montoTotal} /> },
  ];
  return (
    <FormSection title={C.SECTION_DATOS} description={C.EDIT_READONLY}>
      <KeyValueList items={items} columns={2} />
    </FormSection>
  );
}
