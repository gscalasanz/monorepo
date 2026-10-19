import { TextField } from '@/shared/components/ui/form';
import { FORM_COPY as F } from '@/features/personas/constants/form-copy';
import { PERSONA_LIMITS } from '@/features/personas/constants/personas';

export interface NombreFieldProps {
  readonly value: string;
  readonly error?: string;
  readonly valid?: boolean;
  readonly onChange: (value: string) => void;
  readonly onBlur: () => void;
}

/** Campo "Nombre" común a los tres formularios. */
export function NombreField(props: NombreFieldProps) {
  return (
    <TextField
      label={F.NOMBRE}
      name="nombre"
      required
      autoComplete="off"
      placeholder={F.NOMBRE_PLACEHOLDER}
      maxLength={PERSONA_LIMITS.NOMBRE_MAX}
      {...props}
    />
  );
}
