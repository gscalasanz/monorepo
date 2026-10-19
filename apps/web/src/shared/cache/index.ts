/** `@/shared/cache` — cache en memoria TTL 5 min / 100 entradas. */
export {
  CACHE_CONFIG,
  appCache,
  createMemoryCache,
  type CacheEntry,
  type CacheStats,
  type MemoryCache,
  type MemoryCacheOptions,
} from './memory-cache';
