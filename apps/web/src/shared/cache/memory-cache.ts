/**
 * Cache en memoria con TTL y tope de entradas (port de `CacheService`).
 * Paridad exacta con Angular: el "LRU" desaloja por **orden de inserción** (un
 * `get` no refresca la posición) y un `ttl` 0/omitido usa el default. Las
 * entradas vencidas se borran al leerlas o con `cleanup()` (sin timer global:
 * SSR-safe).
 */
import { MS_PER_MINUTE, nowMs } from '@/shared/time';

const DEFAULT_TTL_MINUTES = 5;

export const CACHE_CONFIG = {
  DEFAULT_TTL_MS: DEFAULT_TTL_MINUTES * MS_PER_MINUTE,
  MAX_SIZE: 100,
} as const;

interface CacheItem {
  readonly data: unknown;
  readonly timestamp: number;
  readonly ttl: number;
}

export interface CacheStats {
  readonly size: number;
  readonly maxSize: number;
  readonly keys: readonly string[];
}

export interface CacheEntry {
  readonly key: string;
  readonly data: unknown;
  /** 0 u omitido = TTL por defecto (paridad con Angular). */
  readonly ttlMs?: number;
}

export interface MemoryCache {
  set(entry: CacheEntry): void;
  /**
   * `unknown` a propósito: el cache no puede garantizar el tipo; el caller lo
   * valida (schema zod o type guard). Claves namespaced: `'user:123'`.
   */
  get(key: string): unknown;
  has(key: string): boolean;
  delete(key: string): boolean;
  clear(): void;
  /** Borra vencidos; devuelve cuántos. */
  cleanup(): number;
  /** Borra las claves que contienen `pattern`; devuelve cuántas. */
  invalidate(pattern: string): number;
  getStats(): CacheStats;
}

export interface MemoryCacheOptions {
  readonly now?: () => number;
  readonly maxSize?: number;
  readonly defaultTtlMs?: number;
}

function removeWhere(
  items: Map<string, CacheItem>,
  predicate: (key: string, item: CacheItem) => boolean,
): number {
  const keys = [...items].filter(([k, v]) => predicate(k, v)).map(([k]) => k);
  keys.forEach((key) => items.delete(key));
  return keys.length;
}

export function createMemoryCache({
  now = nowMs,
  maxSize = CACHE_CONFIG.MAX_SIZE,
  defaultTtlMs = CACHE_CONFIG.DEFAULT_TTL_MS,
}: MemoryCacheOptions = {}): MemoryCache {
  const items = new Map<string, CacheItem>();
  const isExpired = (item: CacheItem): boolean =>
    now() - item.timestamp > item.ttl;

  const liveItem = (key: string): CacheItem | undefined => {
    const item = items.get(key);
    if (item && isExpired(item)) items.delete(key);
    return item && !isExpired(item) ? item : undefined;
  };

  const set = ({ key, data, ttlMs }: CacheEntry): void => {
    const oldestKey = items.keys().next().value;
    if (items.size >= maxSize && !items.has(key) && oldestKey !== undefined) {
      items.delete(oldestKey);
    }
    items.set(key, { data, timestamp: now(), ttl: ttlMs || defaultTtlMs });
  };

  return {
    set,
    get: (key) => liveItem(key)?.data,
    has: (key) => liveItem(key) !== undefined,
    delete: (key) => items.delete(key),
    clear: () => items.clear(),
    cleanup: () => removeWhere(items, (_key, item) => isExpired(item)),
    invalidate: (pattern) => removeWhere(items, (key) => key.includes(pattern)),
    getStats: () => ({ size: items.size, maxSize, keys: [...items.keys()] }),
  };
}

/** Instancia compartida de la app (lo que hoy cachea `CacheService`). */
export const appCache: MemoryCache = createMemoryCache();
