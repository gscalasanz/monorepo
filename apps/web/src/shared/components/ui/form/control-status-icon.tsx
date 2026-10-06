import { Check, Lock } from 'lucide-react';

import { FORM_COPY } from '@/shared/components/ui/form/copy';

export interface ControlStatusIconProps {
  readonly disabled?: boolean;
  readonly valid?: boolean;
}

/**
 * Ícono de estado dentro del control (DESIGN.md): candado si está deshabilitado,
 * check verde si es válido. No dibuja nada en otro caso. El significado también
 * va como texto para lectores de pantalla (nunca solo color/ícono).
 */
export function ControlStatusIcon({ disabled, valid }: ControlStatusIconProps) {
  if (disabled) {
    return (
      <span className="flex size-6 items-center justify-center text-ink-subtle">
        <Lock aria-hidden className="size-4" />
        <span className="sr-only">{FORM_COPY.disabledHint}</span>
      </span>
    );
  }
  if (!valid) return null;
  return (
    <span className="flex size-6 items-center justify-center text-success">
      <Check aria-hidden className="size-4" strokeWidth={2.5} />
      <span className="sr-only">{FORM_COPY.validHint}</span>
    </span>
  );
}

/** Cuántos adornos de estado se van a mostrar (para el padding del input). */
export function statusIconCount({
  disabled,
  valid,
}: ControlStatusIconProps): number {
  return disabled || valid ? 1 : 0;
}
