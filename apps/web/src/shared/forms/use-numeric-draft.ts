'use client';

import { useState } from 'react';

/**
 * Puente entre el texto que se tipea y un valor `number | null` controlado.
 * Mantiene el borrador mientras se escribe (`'1.2'`, `'1234,'`) y solo propaga
 * números finitos o `null` (nunca `NaN`). Si el valor cambia desde afuera, el
 * borrador se resincroniza; al salir del campo se normaliza el formato.
 */
export interface NumericDraftOptions {
  readonly value: number | null;
  readonly onChange: (value: number | null) => void;
  readonly parse: (text: string) => number | null;
  readonly format: (value: number | null) => string;
  readonly sanitize?: (text: string) => string;
}

export interface NumericDraft {
  readonly draft: string;
  readonly handleChange: (text: string) => void;
  readonly handleBlur: () => void;
}

export function useNumericDraft(options: NumericDraftOptions): NumericDraft {
  const { value, onChange, parse, format, sanitize } = options;
  const [draft, setDraft] = useState(() => format(value));
  const [synced, setSynced] = useState<number | null>(value);

  if (!Object.is(value, synced)) {
    setSynced(value);
    if (!Object.is(parse(draft), value)) setDraft(format(value));
  }

  function handleChange(text: string): void {
    const clean = sanitize ? sanitize(text) : text;
    const parsed = parse(clean);
    setDraft(clean);
    setSynced(parsed);
    if (!Object.is(parsed, value)) onChange(parsed);
  }

  function handleBlur(): void {
    setDraft(format(parse(draft)));
  }

  return { draft, handleChange, handleBlur };
}
