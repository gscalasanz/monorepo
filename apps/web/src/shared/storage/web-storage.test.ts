import { readItem, removeItem, writeItem } from '@/shared/storage';

describe('web storage SSR-safe', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    sessionStorage.clear();
  });

  it('lee, escribe y borra en local y session', () => {
    expect(writeItem('local', { key: 'k', value: 'v' })).toBe(true);
    expect(writeItem('session', { key: 'k', value: 's' })).toBe(true);
    expect(readItem('local', 'k')).toBe('v');
    expect(readItem('session', 'k')).toBe('s');
    removeItem('local', 'k');
    expect(readItem('local', 'k')).toBeNull();
  });

  it('storage bloqueado o lleno: no explota', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new Error('SecurityError');
    });
    expect(writeItem('local', { key: 'k', value: 'v' })).toBe(false);
    expect(() => removeItem('local', 'k')).not.toThrow();
  });

  it('sin window (SSR) todo es vacío', () => {
    vi.stubGlobal('window', undefined);
    expect(readItem('local', 'k')).toBeNull();
    expect(writeItem('local', { key: 'k', value: 'v' })).toBe(false);
    vi.unstubAllGlobals();
  });
});
