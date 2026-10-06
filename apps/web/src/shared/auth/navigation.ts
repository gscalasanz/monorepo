/**
 * Navegación de la sesión (logout, password cambiada) fuera de React. Los hooks
 * de guard registran `router.replace` de Next; sin navegador registrado se usa
 * `window.location` (y en SSR, nada).
 */
export type AuthNavigator = (path: string) => void;

let navigator: AuthNavigator | null = null;

export function setAuthNavigator(next: AuthNavigator | null): void {
  navigator = next;
}

export function navigateTo(path: string): void {
  if (navigator) {
    navigator(path);
  } else if (typeof window !== 'undefined') {
    window.location.assign(path);
  }
}
