import { LOCALE } from '@/shared/constants';

const MAX_INITIALS = 2;

/** "Valentina Ríos" → "VR"; una sola palabra → su inicial. */
export function initialsOf(nombre: string): string {
  return nombre
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, MAX_INITIALS)
    .map((word) => word.charAt(0).toLocaleUpperCase(LOCALE))
    .join('');
}
