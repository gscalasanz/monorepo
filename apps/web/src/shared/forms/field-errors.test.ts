import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import { collectFieldErrors } from '@/shared/forms/field-errors';

const schema = z.object({
  nombre: z.string().min(1, 'Ingresá el nombre'),
  email: z.string().email('Ingresá un email válido'),
  monto: z
    .number()
    .positive('El monto tiene que ser mayor a 0')
    .max(10, 'Máximo 10'),
});

describe('collectFieldErrors', () => {
  it('toma el primer mensaje de cada campo inválido', () => {
    const result = schema.safeParse({ nombre: '', email: 'mal', monto: -1 });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(collectFieldErrors(result.error)).toEqual({
      nombre: 'Ingresá el nombre',
      email: 'Ingresá un email válido',
      monto: 'El monto tiene que ser mayor a 0',
    });
  });

  it('no inventa errores para campos válidos', () => {
    const result = schema.safeParse({ nombre: 'Ana', email: 'mal', monto: 5 });
    if (result.success) throw new Error('debería fallar');
    expect(Object.keys(collectFieldErrors(result.error))).toEqual(['email']);
  });
});
