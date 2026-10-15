import type { ReactNode } from 'react';

import { Money, RamaChip } from '@/shared/components/data';
import { TIPO_INSCRIPCION_LABELS, type Inscripcion } from '@/shared/domain';
import { FORM_COPY as C } from '@/features/inscripciones/constants/copy';
import { FormSection } from '@/features/inscripciones/components/form/form-section';

function Fact({
  label,
  children,
}: {
  readonly label: string;
  readonly children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 bg-surface px-4 py-3.5">
      <dt className="text-[13px] text-ink-muted">{label}</dt>
      <dd className="text-lg leading-7 font-semibold text-ink tabular-nums">
        {children}
      </dd>
    </div>
  );
}

/** "Datos de la Inscripción" en edición: persona destacada + tipo, año y monto en grande (no se modifican). */
export function InscripcionSummary({
  inscripcion,
}: {
  readonly inscripcion: Inscripcion;
}) {
  const { persona } = inscripcion;
  return (
    <FormSection title={C.SECTION_DATOS} description={C.EDIT_READONLY}>
      <div className="flex flex-col gap-1.5 rounded-lg bg-recessed px-4 py-3.5">
        <span className="text-[13px] text-ink-muted">{C.PERSONA_LABEL}</span>
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <span className="text-lg leading-7 font-semibold text-ink">
            {persona?.nombre ?? inscripcion.personaId}
          </span>
          {persona?.rama ? <RamaChip rama={persona.rama} /> : null}
        </span>
      </div>
      <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-[minmax(0,1.6fr)_minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <Fact label={C.TIPO}>{TIPO_INSCRIPCION_LABELS[inscripcion.tipo]}</Fact>
        <Fact label={C.ANO}>{inscripcion.ano}</Fact>
        <Fact label={C.MONTO_TOTAL}>
          <Money amount={inscripcion.montoTotal} />
        </Fact>
      </dl>
    </FormSection>
  );
}
