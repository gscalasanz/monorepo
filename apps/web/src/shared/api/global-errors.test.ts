import {
  dismissGlobalError,
  globalErrorStore,
  publishGlobalError,
} from '@/shared/api';

describe('bus de errores globales', () => {
  beforeEach(() => {
    globalErrorStore.setState({ errors: [] });
  });

  it('publica errores en orden con id único', () => {
    publishGlobalError('Uno');
    publishGlobalError('Dos');
    const { errors } = globalErrorStore.getState();
    expect(errors.map((e) => e.message)).toEqual(['Uno', 'Dos']);
    expect(new Set(errors.map((e) => e.id)).size).toBe(2);
  });

  it('dismiss saca solo ese error (sin mutar el array anterior)', () => {
    publishGlobalError('Uno');
    publishGlobalError('Dos');
    const before = globalErrorStore.getState().errors;
    const [first] = before;
    dismissGlobalError(first?.id ?? '');
    expect(globalErrorStore.getState().errors.map((e) => e.message)).toEqual([
      'Dos',
    ]);
    expect(before).toHaveLength(2);
  });

  it('los suscriptores se enteran', () => {
    const listener = vi.fn();
    const unsubscribe = globalErrorStore.subscribe(listener);
    publishGlobalError('Uno');
    unsubscribe();
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
