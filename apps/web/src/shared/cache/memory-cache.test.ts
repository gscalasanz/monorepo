import { CACHE_CONFIG, appCache, createMemoryCache } from '@/shared/cache';

function cacheAt(clock: { now: number }, maxSize?: number) {
  return createMemoryCache({ now: () => clock.now, maxSize });
}

describe('createMemoryCache (port de CacheService)', () => {
  it('defaults: TTL 5 min, 100 entradas', () => {
    expect(CACHE_CONFIG.DEFAULT_TTL_MS).toBe(5 * 60 * 1000);
    expect(CACHE_CONFIG.MAX_SIZE).toBe(100);
  });

  it('guarda y devuelve datos', () => {
    const cache = cacheAt({ now: 0 });
    cache.set({ key: 'user:1', data: { nombre: 'Ana' } });
    // `get` devuelve unknown: el caller lo valida (p. ej. con su schema zod).
    const cached: unknown = cache.get('user:1');
    expect(cached).toEqual({ nombre: 'Ana' });
    expectTypeOf(cache.get('user:1')).toEqualTypeOf<unknown>();
    // @ts-expect-error: sin genérico, no se puede "afirmar" el tipo cacheado.
    cache.get<{ nombre: string }>('user:1');
    expect(cache.has('user:1')).toBe(true);
    expect(cache.get('nada')).toBeUndefined();
    expect(cache.has('nada')).toBe(false);
  });

  it('vence pasado el TTL por defecto y lo borra', () => {
    const clock = { now: 0 };
    const cache = cacheAt(clock);
    cache.set({ key: 'k', data: 1 });
    clock.now = CACHE_CONFIG.DEFAULT_TTL_MS;
    expect(cache.get('k')).toBe(1);
    clock.now = CACHE_CONFIG.DEFAULT_TTL_MS + 1;
    expect(cache.has('k')).toBe(false);
    expect(cache.getStats().size).toBe(0);
  });

  it('TTL propio por entrada (0 usa el default, como el Angular)', () => {
    const clock = { now: 0 };
    const cache = cacheAt(clock);
    cache.set({ key: 'corto', data: 1, ttlMs: 1000 });
    cache.set({ key: 'cero', data: 2, ttlMs: 0 });
    clock.now = 1001;
    expect(cache.get('corto')).toBeUndefined();
    expect(cache.get('cero')).toBe(2);
  });

  it('lleno: desaloja la entrada más vieja (orden de inserción) al agregar una clave nueva', () => {
    const cache = cacheAt({ now: 0 }, 2);
    cache.set({ key: 'a', data: 1 });
    cache.set({ key: 'b', data: 2 });
    cache.get('a');
    cache.set({ key: 'c', data: 3 });
    expect(cache.getStats().keys).toEqual(['b', 'c']);
  });

  it('pisar una clave existente con el cache lleno no desaloja', () => {
    const cache = cacheAt({ now: 0 }, 2);
    cache.set({ key: 'a', data: 1 });
    cache.set({ key: 'b', data: 2 });
    cache.set({ key: 'a', data: 10 });
    expect(cache.getStats().keys).toEqual(['a', 'b']);
    expect(cache.get('a')).toBe(10);
  });

  it('delete, clear, invalidate por patrón y cleanup de vencidos', () => {
    const clock = { now: 0 };
    const cache = cacheAt(clock);
    cache.set({ key: 'movimientos:caja:1', data: 1 });
    cache.set({ key: 'movimientos:caja:2', data: 2, ttlMs: 10 });
    cache.set({ key: 'user:1', data: 3 });
    expect(cache.delete('user:1')).toBe(true);
    clock.now = 11;
    expect(cache.cleanup()).toBe(1);
    cache.set({ key: 'movimientos:caja:3', data: 3 });
    expect(cache.invalidate('movimientos:caja:')).toBe(2);
    cache.set({ key: 'x', data: 1 });
    cache.clear();
    expect(cache.getStats()).toEqual({ size: 0, maxSize: 100, keys: [] });
  });

  it('appCache es una instancia compartida con los defaults', () => {
    appCache.set({ key: 'k', data: 1 });
    expect(appCache.get('k')).toBe(1);
    appCache.clear();
  });
});
