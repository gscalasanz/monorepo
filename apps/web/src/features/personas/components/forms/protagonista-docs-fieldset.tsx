import { CheckboxField } from '@/shared/components/ui/form';
import { RAMA } from '@/shared/domain';
import { FORM_COPY as F } from '@/features/personas/constants/form-copy';
import type { ProtagonistaFormValues } from '@/features/personas/models/form-schemas';

type DocField = 'partidaNacimiento' | 'dni' | 'dniPadres' | 'carnetObraSocial';

const DOC_FIELDS: readonly {
  readonly name: DocField;
  readonly label: string;
}[] = [
  { name: 'partidaNacimiento', label: F.DOC_PARTIDA },
  { name: 'dni', label: F.DOC_DNI },
  { name: 'dniPadres', label: F.DOC_DNI_PADRES },
  { name: 'carnetObraSocial', label: F.DOC_OBRA_SOCIAL },
];

export interface ProtagonistaDocsFieldsetProps {
  readonly values: ProtagonistaFormValues;
  readonly onChange: (name: DocField, value: boolean) => void;
}

/** "Documentación entregada": los Rovers (mayores de edad) no ven "DNI de los padres". */
export function ProtagonistaDocsFieldset({
  values,
  onChange,
}: ProtagonistaDocsFieldsetProps) {
  const fields = DOC_FIELDS.filter(
    (field) => !(values.rama === RAMA.ROVERS && field.name === 'dniPadres'),
  );
  return (
    <fieldset className="flex flex-col gap-1">
      <legend className="mb-2 text-sm font-semibold text-ink">
        {F.DOCS_TITLE}
      </legend>
      {fields.map((field) => (
        <CheckboxField
          key={field.name}
          label={field.label}
          name={field.name}
          value={values[field.name]}
          onChange={(checked) => onChange(field.name, checked)}
        />
      ))}
    </fieldset>
  );
}
