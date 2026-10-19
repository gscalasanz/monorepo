import {
  ComboboxField,
  NumberField,
  SelectField,
} from '@/shared/components/ui/form';
import type { TipoInscripcion } from '@/shared/domain';
import type { SelectOption } from '@/shared/queries';
import { FORM_COPY as C } from '@/features/inscripciones/constants/copy';
import {
  ANO_MAX,
  ANO_MIN,
  TIPO_OPTIONS,
} from '@/features/inscripciones/constants/inscripciones';
import type { CreateFieldErrors } from '@/features/inscripciones/helpers/create-form';
import { FormSection } from '@/features/inscripciones/components/form/form-section';

interface DatosSectionProps {
  readonly personaId: string | null;
  readonly tipo: TipoInscripcion;
  readonly ano: number | null;
  readonly personaOptions: readonly SelectOption[];
  readonly errors?: CreateFieldErrors;
  readonly onPersonaChange: (personaId: string | null) => void;
  readonly onTipoChange: (tipo: TipoInscripcion) => void;
  readonly onAnoChange: (ano: number | null) => void;
}

/** "Datos de la Inscripción" del alta: persona, tipo y año. */
export function DatosSection(props: DatosSectionProps) {
  const { errors = {} } = props;
  return (
    <FormSection title={C.SECTION_DATOS}>
      <ComboboxField
        label={C.PERSONA}
        required
        options={props.personaOptions}
        value={props.personaId}
        onChange={props.onPersonaChange}
        placeholder={C.PERSONA_PLACEHOLDER}
        emptyText={C.PERSONA_EMPTY}
        error={errors.personaId}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField<TipoInscripcion>
          label={C.TIPO}
          required
          options={TIPO_OPTIONS}
          value={props.tipo}
          onChange={(tipo) => (tipo ? props.onTipoChange(tipo) : undefined)}
          placeholder={C.TIPO_PLACEHOLDER}
          error={errors.tipo}
        />
        <NumberField
          label={C.ANO}
          required
          min={ANO_MIN}
          max={ANO_MAX}
          value={props.ano}
          onChange={props.onAnoChange}
          error={errors.ano}
        />
      </div>
    </FormSection>
  );
}
