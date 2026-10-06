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
  SECTION_MARKERS,
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
  /** Editar: persona, tipo y año no se modifican. */
  readonly disabled?: boolean;
  readonly onPersonaChange?: (personaId: string | null) => void;
  readonly onTipoChange?: (tipo: TipoInscripcion) => void;
  readonly onAnoChange?: (ano: number | null) => void;
}

const noop = () => undefined;

/** 01 "Datos de la Inscripción": persona, tipo y año. */
export function DatosSection(props: DatosSectionProps) {
  const { errors = {}, disabled = false } = props;
  return (
    <FormSection marker={SECTION_MARKERS.DATOS} title={C.SECTION_DATOS}>
      <ComboboxField
        label={C.PERSONA}
        required
        disabled={disabled}
        options={props.personaOptions}
        value={props.personaId}
        onChange={props.onPersonaChange ?? noop}
        placeholder={C.PERSONA_PLACEHOLDER}
        emptyText={C.PERSONA_EMPTY}
        error={errors.personaId}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField<TipoInscripcion>
          label={C.TIPO}
          required
          disabled={disabled}
          options={TIPO_OPTIONS}
          value={props.tipo}
          onChange={(tipo) => (tipo ? props.onTipoChange?.(tipo) : undefined)}
          placeholder={C.TIPO_PLACEHOLDER}
          error={errors.tipo}
        />
        <NumberField
          label={C.ANO}
          required
          disabled={disabled}
          min={ANO_MIN}
          max={ANO_MAX}
          value={props.ano}
          onChange={props.onAnoChange ?? noop}
          error={errors.ano}
        />
      </div>
    </FormSection>
  );
}
