'use client';

import { useCallback, useMemo, useState } from 'react';
import type { ZodObject, ZodRawShape } from 'zod';

import { collectFieldErrors } from '@/shared/forms/field-errors';

/**
 * UX de validación compartida (port de mi-tienda): el **error** aparece al salir
 * del campo (`onBlur`), no en cada tecla, y se **limpia en vivo** apenas el usuario
 * vuelve a escribir (`onChange`). El estado **válido** se recalcula en vivo para
 * dar feedback positivo (check) apenas el formato es correcto.
 *
 * No posee los valores (viven en el form); recibe cada valor al validar.
 * `validateAll` es el gate de submit: llena todos los errores de una.
 */
export interface FieldValidation {
  /** Errores visibles por campo (solo tras blur o submit). */
  readonly errors: Readonly<Record<string, string>>;
  /** Campos con formato válido (para el indicador visual). */
  readonly valid: Readonly<Record<string, boolean>>;
  /** Valida un campo al perder foco: setea error o lo marca válido. */
  readonly onBlur: (name: string, value: unknown) => void;
  /** Al escribir: limpia el error del campo y recalcula su validez en vivo. */
  readonly onChange: (name: string, value: unknown) => void;
  /** Valida todo el objeto (submit). Devuelve `true` si pasa. */
  readonly validateAll: (values: unknown) => boolean;
  /** Vuelve al estado inicial (sin errores ni válidos). */
  readonly reset: () => void;
}

type Schema = ZodObject<ZodRawShape>;
type FlagMap = Readonly<Record<string, boolean>>;
type ErrorMap = Readonly<Record<string, string>>;

interface FieldCheck {
  readonly schema: Schema;
  readonly name: string;
  readonly value: unknown;
}

/** `null` = campo desconocido; `''`… = mensaje de error; `true` = pasa. */
function checkField({ schema, name, value }: FieldCheck): string | true | null {
  const fieldSchema = schema.shape[name];
  if (!fieldSchema) return null;
  const result = fieldSchema.safeParse(value);
  return result.success ? true : (result.error.issues[0]?.message ?? '');
}

function withoutKey(map: ErrorMap, name: string): ErrorMap {
  if (!(name in map)) return map;
  return Object.fromEntries(
    Object.entries(map).filter(([key]) => key !== name),
  );
}

function readField(values: unknown, name: string): unknown {
  if (values === null || typeof values !== 'object') return undefined;
  return Object.entries(values).find(([key]) => key === name)?.[1];
}

function validityOf(schema: Schema, values: unknown): FlagMap {
  return Object.fromEntries(
    Object.keys(schema.shape).map((name) => [
      name,
      checkField({ schema, name, value: readField(values, name) }) === true,
    ]),
  );
}

export function useFieldValidation(schema: Schema): FieldValidation {
  const [errors, setErrors] = useState<ErrorMap>({});
  const [valid, setValid] = useState<FlagMap>({});

  const onBlur = useCallback(
    (name: string, value: unknown): void => {
      const outcome = checkField({ schema, name, value });
      if (outcome === null) return;
      setValid((prev) => ({ ...prev, [name]: outcome === true }));
      setErrors((prev) =>
        outcome === true
          ? withoutKey(prev, name)
          : { ...prev, [name]: outcome },
      );
    },
    [schema],
  );

  const onChange = useCallback(
    (name: string, value: unknown): void => {
      setErrors((prev) => withoutKey(prev, name));
      setValid((prev) => ({
        ...prev,
        [name]: checkField({ schema, name, value }) === true,
      }));
    },
    [schema],
  );

  const validateAll = useCallback(
    (values: unknown): boolean => {
      const result = schema.safeParse(values);
      setValid(validityOf(schema, values));
      setErrors(result.success ? {} : collectFieldErrors(result.error));
      return result.success;
    },
    [schema],
  );

  const reset = useCallback((): void => {
    setErrors({});
    setValid({});
  }, []);

  return useMemo(
    () => ({ errors, valid, onBlur, onChange, validateAll, reset }),
    [errors, valid, onBlur, onChange, validateAll, reset],
  );
}
