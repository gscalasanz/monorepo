'use client';

import { InputControl } from '@/shared/components/ui/form';
import { parseNumberInput } from '@/shared/forms';

export interface CantidadInputProps {
  /** Nombre accesible (la celda no tiene label visible). */
  readonly label: string;
  readonly value: number | null;
  readonly onChange: (value: number | null) => void;
  readonly max?: number;
  readonly invalid?: boolean;
  readonly describedBy?: string;
}

const PLACEHOLDER = '0';

/** Input entero ≥ 0 para tablas de cantidades (ventas en lote, entregas). */
export function CantidadInput({
  label,
  value,
  onChange,
  max,
  invalid,
  describedBy,
}: CantidadInputProps) {
  return (
    <InputControl
      type="number"
      inputMode="numeric"
      min={0}
      max={max}
      step={1}
      aria-label={label}
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
      invalid={invalid}
      placeholder={PLACEHOLDER}
      value={value ?? ''}
      onChange={(event) => onChange(parseNumberInput(event.target.value))}
      className="w-24 text-right tabular-nums"
    />
  );
}
