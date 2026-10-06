import { CheckboxField } from '@/shared/components/ui/form';
import { FORM_COPY as C } from '@/features/inscripciones/constants/copy';
import {
  AUTORIZACIONES,
  SECTION_MARKERS,
  type AutorizacionKey,
  type Autorizaciones,
} from '@/features/inscripciones/constants/inscripciones';
import { FormSection } from '@/features/inscripciones/components/form/form-section';

interface AutorizacionesSectionProps {
  readonly values: Autorizaciones;
  readonly onChange: (key: AutorizacionKey, value: boolean) => void;
}

/** 03 "Autorizaciones" (solo Scout Argentina). */
export function AutorizacionesSection({
  values,
  onChange,
}: AutorizacionesSectionProps) {
  return (
    <FormSection
      marker={SECTION_MARKERS.AUTORIZACIONES}
      title={C.SECTION_AUTORIZACIONES}
      description={C.AUTORIZACIONES_DESC}
    >
      <div className="grid gap-2 sm:grid-cols-2">
        {AUTORIZACIONES.map((item) => (
          <CheckboxField
            key={item.key}
            label={item.label}
            description={item.description}
            value={values[item.key]}
            onChange={(checked) => onChange(item.key, checked)}
          />
        ))}
      </div>
    </FormSection>
  );
}
