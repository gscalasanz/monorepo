# REGISTRY — índice de lo reutilizable

> **Buscá acá antes de crear** (después, ReUI vía MCP; recién después, código propio). Si creás o
> instalás algo reutilizable, registralo en el **mismo commit** (CLAUDE.md §5). El detalle por
> categoría vive en `REGISTRY-detail/` (`ui`, `api`, `domain`, `testing`).

## Índice alfabético

| Símbolo | Categoría | Ubicación |
| --- | --- | --- |
| `cn` | ui (lib) | `src/shared/lib/utils.ts` → [ui](./REGISTRY-detail/ui.md) |
| `@/shared/time` (`nowInstant`, `todayBsAs`, `formatDate`, `DATE_FORMATS`, `toDateInputValue`, `localDateSchema`…) | domain (time) | `src/shared/time/` → [domain](./REGISTRY-detail/domain.md#time) |
| `@/shared/domain` — enums (`CAJA_TYPE`, `CONCEPTO_MOVIMIENTO`, `RAMA`…) + `*_LABELS` | domain | `src/shared/domain/<dominio>/enums.ts` → [domain](./REGISTRY-detail/domain.md#domain) |
| `@/shared/domain` — schemas zod de respuestas (`movimientoSchema`, `cajaResponseSchema`, `reporteEventoSchema`…) | domain | `src/shared/domain/<dominio>/schemas.ts` → [domain](./REGISTRY-detail/domain.md#domain) |
| `decimalSchema` · `nullableField` · `paginatedSchema` · `PaginatedResponse<T>` | domain (common) | `src/shared/domain/common/` → [domain](./REGISTRY-detail/domain.md#common) |
| `filterMovimientos` · `CONCEPTOS_MANUALES_POR_TIPO` | domain (movimiento) | `src/shared/domain/movimiento/helpers.ts` |
| `isPersonaDisabled` · `onlyEnabled` · `ramaFromTabKey` | domain (persona) | `src/shared/domain/persona/` |
| `calculateEventProfit` · `calculateProfitBySeller` | domain (evento) | `src/shared/domain/evento/profit.ts` |
| `APP_ROUTES` · `PERSONA_TYPE_ROUTES` · `UI_CONFIG` · `LOCALE` · `CURRENCY` | constants | `src/shared/constants/` |
| `MESSAGES` | copy | `src/shared/copy/` |
| `apiClient` (`get`/`post`/`patch`/`delete`/`getBlob`/`getText`) · `createApiClient` | api | `src/shared/api/api-client.ts` → [api](./REGISTRY-detail/api.md#cliente) |
| `ApiError` · `isApiError` · `extractErrorMessage` · `nestMessageOf` | api | `src/shared/api/api-error.ts` → [api](./REGISTRY-detail/api.md#errores) |
| `API_ENDPOINTS` · `QUERY_PARAMS` · `HTTP_CONFIG` · `buildUrl` · `API_BASE_URL` | api | `src/shared/api/` → [api](./REGISTRY-detail/api.md#endpoints) |
| `publishGlobalError` · `useGlobalErrors` · `dismissGlobalError` · `globalErrorStore` | api | `src/shared/api/global-errors.ts` → [api](./REGISTRY-detail/api.md#errores-globales) |
| `registerAuthBridge` · `setActivityListener` | api | `src/shared/api/registry.ts` → [api](./REGISTRY-detail/api.md#cliente) |
| `createFakeFetch` | testing | `src/shared/api/testing/fake-fetch.ts` → [testing](./REGISTRY-detail/testing.md) |
| `useKeepAlive` · `createKeepAlive` · `KEEP_ALIVE_MS` | api | `src/shared/api/keep-alive.ts`, `use-keep-alive.ts` → [api](./REGISTRY-detail/api.md#keep-alive) |
| `pathSegment` | api | `src/shared/api/path-segment.ts` → [api](./REGISTRY-detail/api.md#endpoints) |
| `appCache` · `createMemoryCache` · `CACHE_CONFIG` | api (cache) | `src/shared/cache/` → [api](./REGISTRY-detail/api.md#cache) |
| `login` · `logout` · `register` · `changePassword` · `changeEmail` · `initializeSession` · `refreshSession` | api (auth) | `src/shared/auth/session.ts` → [api](./REGISTRY-detail/api.md#auth) |
| `useSession` · `useRequireSession` · `useRedirectIfAuthenticated` | api (auth) | `src/shared/auth/hooks.ts` → [api](./REGISTRY-detail/api.md#auth) |
| `evaluateAuthGuard` · `evaluateNoAuthGuard` · `saveRedirectUrl` · `consumeRedirectUrl` | api (auth) | `src/shared/auth/` → [api](./REGISTRY-detail/api.md#auth) |
| `decodeJwt` · `isTokenValid` · `getAccessToken` · `setTokens` · `clearTokens` · `sessionStore` · `createSingleFlight` | api (auth) | `src/shared/auth/` → [api](./REGISTRY-detail/api.md#auth) |
| `makeJwt` · `tokenExpiringIn` | testing | `src/shared/auth/testing/jwt.ts` |
| `formatMoney` · `humanize` · `resolveStatusTone` · `STATUS_TONE` | domain (format) | `src/shared/format/` → [domain](./REGISTRY-detail/domain.md#format) |
| `@/shared/validators` (`positiveNumber`, `decimalPlaces`, `safeText`, `dateRange`, `saldoSuficiente`, `personaAReembolsar*`, `refineWith`, `VALIDATION_MESSAGES`…) | domain (validators) | `src/shared/validators/` → [domain](./REGISTRY-detail/domain.md#validators) |
