/** `@/shared/navigation` — "Volver" que respeta el historial real del navegador. */
export { BackLink, type BackLinkProps } from './back-link';
export { NavigationTracker } from './navigation-tracker';
export { useGoBack } from './use-go-back';
export { canGoBackInApp, markHistoryPop, recordNavigation, resetNavigationHistory } from './history';
