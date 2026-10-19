import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useFormState } from '@/shared/forms/use-form-state';

const INITIAL = { nombre: 'Ana', monto: null as number | null };

describe('useFormState', () => {
  it('setField devuelve un objeto nuevo sin mutar el anterior', () => {
    const { result } = renderHook(() => useFormState(INITIAL));
    const before = result.current.values;
    act(() => result.current.setField('monto', 500));
    expect(result.current.values).toEqual({ nombre: 'Ana', monto: 500 });
    expect(before).toEqual(INITIAL);
    expect(result.current.values).not.toBe(before);
    expect(result.current.isDirty).toBe(true);
  });

  it('setValues aplica un patch parcial', () => {
    const { result } = renderHook(() => useFormState(INITIAL));
    act(() => result.current.setValues({ nombre: 'Bruno' }));
    expect(result.current.values).toEqual({ nombre: 'Bruno', monto: null });
  });

  it('reset vuelve al inicial o adopta uno nuevo como base', () => {
    const { result } = renderHook(() => useFormState(INITIAL));
    act(() => result.current.setField('nombre', 'X'));
    act(() => result.current.reset());
    expect(result.current.values).toEqual(INITIAL);
    expect(result.current.isDirty).toBe(false);
    act(() => result.current.reset({ nombre: 'Caro', monto: 1 }));
    expect(result.current.values).toEqual({ nombre: 'Caro', monto: 1 });
    expect(result.current.isDirty).toBe(false);
  });
});
