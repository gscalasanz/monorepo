'use client';

import { useCallback, useMemo, useState } from 'react';

/**
 * Estado de un formulario como objeto inmutable. `setField` devuelve siempre un
 * objeto nuevo (nunca muta); `isDirty` compara superficialmente contra el inicial.
 */
export interface FormState<T extends object> {
  readonly values: T;
  readonly setField: <K extends keyof T>(name: K, value: T[K]) => void;
  readonly setValues: (patch: Partial<T>) => void;
  readonly reset: (next?: T) => void;
  readonly isDirty: boolean;
}

function shallowEqual<T extends object>(a: T, b: T): boolean {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  return [...keys].every((key) =>
    Object.is(Reflect.get(a, key), Reflect.get(b, key)),
  );
}

export function useFormState<T extends object>(initial: T): FormState<T> {
  const [baseline, setBaseline] = useState<T>(initial);
  const [values, setValuesState] = useState<T>(initial);

  const setField = useCallback(<K extends keyof T>(name: K, value: T[K]) => {
    setValuesState((prev) => ({ ...prev, [name]: value }));
  }, []);

  const setValues = useCallback((patch: Partial<T>) => {
    setValuesState((prev) => ({ ...prev, ...patch }));
  }, []);

  const reset = useCallback(
    (next?: T) => {
      const target = next ?? baseline;
      setBaseline(target);
      setValuesState(target);
    },
    [baseline],
  );

  const isDirty = useMemo(
    () => !shallowEqual(values, baseline),
    [values, baseline],
  );

  return { values, setField, setValues, reset, isDirty };
}
