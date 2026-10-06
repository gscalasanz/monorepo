import { MoneyField } from '@/shared/components/ui/form';
import { FORM_COPY as C } from '@/features/inscripciones/constants/copy';
import { SECTION_MARKERS } from '@/features/inscripciones/constants/inscripciones';
import { FormSection } from '@/features/inscripciones/components/form/form-section';
import { MontosSummary } from '@/features/inscripciones/components/form/montos-summary';

/** 02 "Importes" en edición: monto total bloqueado y resumen (Total = A pagar). */
export function ImportesReadonlySection({
  montoTotal,
}: {
  readonly montoTotal: number;
}) {
  return (
    <FormSection marker={SECTION_MARKERS.IMPORTES} title={C.SECTION_IMPORTES}>
      <MoneyField
        label={C.MONTO_TOTAL}
        disabled
        value={montoTotal}
        onChange={() => undefined}
      />
      <MontosSummary
        total={montoTotal}
        saldoPersonal={0}
        bonificacion={0}
        aPagar={montoTotal}
        exceden={false}
      />
    </FormSection>
  );
}
