import { act, renderHook } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import {
  formatMoneyInput,
  parseMoneyInput,
  sanitizeMoneyInput,
} from '@/shared/forms/numeric-input';
import { useNumericDraft } from '@/shared/forms/use-numeric-draft';

function setup(initial: number | null = null) {
  const onChange = vi.fn();
  const hook = renderHook(() => {
    const [value, setValue] = useState<number | null>(initial);
    return useNumericDraft({
      value,
      onChange: (next) => {
        onChange(next);
        setValue(next);
      },
      parse: parseMoneyInput,
      format: formatMoneyInput,
      sanitize: sanitizeMoneyInput,
    });
  });
  return { hook, onChange };
}

describe('useNumericDraft (montos)', () => {
  it.each([
    ['500,', 500, '500'],
    ['1.234,', 1234, '1.234'],
    ['1.234,5', 1234.5, '1.234,5'],
    ['12.5', 12.5, '12,5'],
    ['', null, ''],
  ])('%j → onChange(%j) y al salir muestra %j', (typed, parsed, formatted) => {
    const { hook, onChange } = setup(typed === '' ? 7 : null);
    act(() => hook.result.current.handleChange(typed));
    expect(hook.result.current.draft).toBe(typed);
    expect(onChange).toHaveBeenLastCalledWith(parsed);
    act(() => hook.result.current.handleBlur());
    expect(hook.result.current.draft).toBe(formatted);
  });
});
