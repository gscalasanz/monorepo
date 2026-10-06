import { CheckboxField } from '@/shared/components/ui/form';
import { TIPO_INSCRIPCION } from '@/shared/domain';
import { FORM_COPY as C } from '@/features/inscripciones/constants/copy';
import { SECTION_MARKERS } from '@/features/inscripciones/constants/inscripciones';
import {
  montoAPagarCreate,
  usarTodoSaldo,
  type CreateFormValues,
} from '@/features/inscripciones/helpers/create-form';
import { CuentaPersonalPanel } from '@/features/inscripciones/components/form/cuenta-personal-panel';
import { FormSection } from '@/features/inscripciones/components/form/form-section';
import { ImportesFields } from '@/features/inscripciones/components/form/importes-fields';
import { MontosSummary } from '@/features/inscripciones/components/form/montos-summary';

interface ImportesSectionProps {
  readonly values: CreateFormValues;
  readonly saldoFondo: number;
  readonly saldoPersonal: number;
  readonly saldoLoading: boolean;
  readonly fondoBajo: boolean;
  readonly exceden: boolean;
  readonly onChange: <K extends keyof CreateFormValues>(
    name: K,
    value: CreateFormValues[K],
  ) => void;
  readonly onPersonaNuevaChange: (esNueva: boolean) => void;
}

/** 02 "Importes" del alta: persona nueva, montos, cuenta personal y resumen. */
export function ImportesSection(props: ImportesSectionProps) {
  const { values, onChange } = props;
  return (
    <FormSection marker={SECTION_MARKERS.IMPORTES} title={C.SECTION_IMPORTES}>
      {values.tipo === TIPO_INSCRIPCION.SCOUT_ARGENTINA ? (
        <CheckboxField
          label={C.PERSONA_NUEVA}
          description={C.PERSONA_NUEVA_DESC}
          value={values.personaNueva}
          onChange={props.onPersonaNuevaChange}
        />
      ) : null}
      <ImportesFields
        values={values}
        saldoFondo={props.saldoFondo}
        fondoBajo={props.fondoBajo}
        onChange={onChange}
      />
      {values.personaId ? (
        <CuentaPersonalPanel
          saldo={props.saldoPersonal}
          loading={props.saldoLoading}
          value={values.montoConSaldoPersonal}
          locked={values.personaNueva}
          onChange={(value) => onChange('montoConSaldoPersonal', value)}
          onUsarTodo={() =>
            onChange(
              'montoConSaldoPersonal',
              usarTodoSaldo(props.saldoPersonal, values.montoTotal),
            )
          }
        />
      ) : null}
      <MontosSummary
        total={values.montoTotal}
        saldoPersonal={values.montoConSaldoPersonal ?? 0}
        bonificacion={values.montoBonificado ?? 0}
        aPagar={montoAPagarCreate(values)}
        exceden={props.exceden}
      />
    </FormSection>
  );
}
