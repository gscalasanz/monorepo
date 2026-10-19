import { cn } from './utils';

describe('cn', () => {
  it('resuelve conflictos de Tailwind quedándose con la última clase', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
  });

  it('ignora valores falsy', () => {
    expect(cn('a', false, undefined, 'b')).toBe('a b');
  });
});
