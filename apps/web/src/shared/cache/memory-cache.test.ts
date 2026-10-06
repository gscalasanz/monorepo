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
    cache.set('user:1', { nombre: 'Ana' });
    expect(cache.get<{ nombre: string }>('user:1')).toEqual({ nombre: 'Ana' });
    expect(cache.has('user:1')).toBe(true);
    expect(cache.get('nada')).toBeUndefined();
    expect(cache.has('nada')).toBe(false);
  });

  it('vence pasado el TTL por defecto y lo borra', () => {
    const clock = { now: 0 };
    const cache = cacheAt(clock);
    cache.set('k', 1);
    clock.now = CACHE_CONFIG.DEFAULT_TTL_MS;
    expect(cache.get('k')).toBe(1);
    clock.now = CACHE_CONFIG.DEFAULT_TTL_MS + 1;
    expect(cache.has('k')).toBe(false);
    expect(cache.getStats().size).toBe(0);
  });

  it('TTL propio por entrada (0 usa el default, como el Angular)', () => {
    const clock = { now: 0 };
    const cache = cacheAt(clock);
    cache.set('corto', 1, 1000);
    cache.set('cero', 2, 0);
    clock.now = 1001;
    expect(cache.get('corto')).toBeUndefined();
    expect(cache.get('cero')).toBe(2);
  });

  it('lleno: desaloja la entrada más vieja (orden de inserción) al agregar una clave nueva', () => {
    const cache = cacheAt({ now: 0 }, 2);
    cache.set('a', 1);
    cache.set('b', 2);
    cache.get('a');
    cache.set('c', 3);
    expect(cache.getStats().keys).toEqual(['b', 'c']);
  });

  it('pisar una clave existente con el cache lleno no desaloja', () => {
    const cache = cacheAt({ now: 0 }, 2);
    cache.set('a', 1);
    cache.set('b', 2);
    cache.set('a', 10);
    expect(cache.getStats().keys).toEqual(['a', 'b']);
    expect(cache.get('a')).toBe(10);
  });

  it('delete, clear, invalidate por patrón y cleanup de vencidos', () => {
    const clock = { now: 0 };
    const cache = cacheAt(clock);
    cache.set('movimientos:caja:1', 1);
    cache.set('movimientos:caja:2', 2, 10);
    cache.set('user:1', 3);
    expect(cache.delete('user:1')).toBe(true);
    clock.now = 11;
    expect(cache.cleanup()).toBe(1);
    cache.set('movimientos:caja:3', 3);
    expect(cache.invalidate('movimientos:caja:')).toBe(2);
    cache.set('x', 1);
    cache.clear();
    expect(cache.getStats()).toEqual({ size: 0, maxSize: 100, keys: [] });
  });

  it('appCache es una instancia compartida con los defaults', () => {
    appCache.set('k', 1);
    expect(appCache.get('k')).toBe(1);
    appCache.clear();
  });
});
