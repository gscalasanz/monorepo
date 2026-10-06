import { FORM_COPY } from '@/shared/components/ui/form/copy';

export interface FieldLabelTextProps {
  readonly label: string;
  readonly required?: boolean;
}

/** Texto del label con la marca de obligatorio (visual `*` + texto para lectores). */
export function FieldLabelText({
  label,
  required = false,
}: FieldLabelTextProps) {
  return (
    <>
      {label}
      {required && (
        <>
          <span aria-hidden className="ml-0.5 text-danger">
            {FORM_COPY.requiredMark}
          </span>
          <span className="sr-only">{FORM_COPY.requiredHint}</span>
        </>
      )}
    </>
  );
}
