import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import { useFieldValidation } from '@/shared/forms/use-field-validation';

const schema = z.object({
  email: z.string().trim().email('Ingresá un email válido'),
  password: z.string().min(1, 'Ingresá tu contraseña'),
});

describe('useFieldValidation', () => {
  it('on blur con valor inválido: setea el error del campo', () => {
    const { result } = renderHook(() => useFieldValidation(schema));
    act(() => result.current.onBlur('email', 'no-es-email'));
    expect(result.current.errors.email).toMatch(/email válido/i);
    expect(result.current.valid.email).toBe(false);
  });

  it('on blur con valor válido: sin error y marca válido', () => {
    const { result } = renderHook(() => useFieldValidation(schema));
    act(() => result.current.onBlur('email', 'ana@example.com'));
    expect(result.current.errors.email).toBeUndefined();
    expect(result.current.valid.email).toBe(true);
  });

  it('on blur de un campo que no está en el schema: no hace nada', () => {
    const { result } = renderHook(() => useFieldValidation(schema));
    act(() => result.current.onBlur('otro', 'x'));
    expect(result.current.errors).toEqual({});
    expect(result.current.valid).toEqual({});
  });

  it('on change: limpia el error del campo en vivo', () => {
    const { result } = renderHook(() => useFieldValidation(schema));
    act(() => result.current.onBlur('email', 'malo'));
    expect(result.current.errors.email).toBeTruthy();
    act(() => result.current.onChange('email', 'ma'));
    expect(result.current.errors.email).toBeUndefined();
  });

  it('on change: marca válido en vivo cuando el formato pasa a ser correcto', () => {
    const { result } = renderHook(() => useFieldValidation(schema));
    act(() => result.current.onChange('email', 'ana@example.com'));
    expect(result.current.valid.email).toBe(true);
    act(() => result.current.onChange('email', 'ana@'));
    expect(result.current.valid.email).toBe(false);
  });

  it('validateAll inválido: llena todos los errores y devuelve false', () => {
    const { result } = renderHook(() => useFieldValidation(schema));
    let ok = true;
    act(() => {
      ok = result.current.validateAll({ email: 'malo', password: '' });
    });
    expect(ok).toBe(false);
    expect(result.current.errors.email).toBeTruthy();
    expect(result.current.errors.password).toBeTruthy();
  });

  it('validateAll válido: sin errores, todo válido, devuelve true', () => {
    const { result } = renderHook(() => useFieldValidation(schema));
    let ok = false;
    act(() => {
      ok = result.current.validateAll({
        email: 'ana@example.com',
        password: 'x',
      });
    });
    expect(ok).toBe(true);
    expect(result.current.errors).toEqual({});
    expect(result.current.valid).toEqual({ email: true, password: true });
  });

  it('reset limpia errores y válidos', () => {
    const { result } = renderHook(() => useFieldValidation(schema));
    act(() => {
      result.current.validateAll({ email: 'malo', password: '' });
    });
    act(() => result.current.reset());
    expect(result.current.errors).toEqual({});
    expect(result.current.valid).toEqual({});
  });
});
