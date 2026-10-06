/** Adaptador de validadores puros a `superRefine` de zod. */
import { z } from 'zod';

import type { Validator } from '@/shared/validators/types';

export interface RefineOptions {
  /** Campo donde reportar el error (validadores de objeto). */
  readonly path?: readonly (string | number)[];
}

export function refineWith<T>(
  validate: Validator<T>,
  { path = [] }: RefineOptions = {},
): (value: T, ctx: z.RefinementCtx) => void {
  return (value, ctx) => {
    const message = validate(value);
    if (message !== null) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message, path: [...path] });
    }
  };
}
