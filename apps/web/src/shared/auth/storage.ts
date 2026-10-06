/**
 * Acceso SSR-safe a Web Storage: nunca toca `window` al importarse y trata un
 * storage no disponible (SSR, modo privado, bloqueado) como vacío en vez de
 * romper la app — equivale a "no hay sesión guardada".
 */
export type StorageKind = 'local' | 'session';

function resolveStorage(kind: StorageKind): Storage | null {
  if (typeof window === 'undefined') return null;
  try {
    return kind === 'local' ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}

export function readItem(kind: StorageKind, key: string): string | null {
  try {
    return resolveStorage(kind)?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

export interface StorageEntry {
  readonly key: string;
  readonly value: string;
}

/** Devuelve `false` si no se pudo escribir (storage lleno o bloqueado). */
export function writeItem(
  kind: StorageKind,
  { key, value }: StorageEntry,
): boolean {
  try {
    resolveStorage(kind)?.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function removeItem(kind: StorageKind, key: string): void {
  try {
    resolveStorage(kind)?.removeItem(key);
  } catch {
    // Storage bloqueado: no hay nada que borrar.
  }
}
