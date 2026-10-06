# REGISTRY-detail — api

## cliente

`src/shared/api/` — `import { apiClient, API_ENDPOINTS } from '@/shared/api'`.

```ts
const cajas = await apiClient.get(API_ENDPOINTS.CAJAS, { schema: cajasResponseSchema, params: { tipo } });
await apiClient.post(API_ENDPOINTS.campamento(id) + '/gastos', { body: dto });           // → void
const venta = await apiClient.post(url, { body: dto, schema: ventaSchema });              // → Venta
const reporte = await apiClient.get(API_ENDPOINTS.eventoReportePublico(id), { schema: reporteEventoSchema, skipGlobalError: true });
const zip = await apiClient.getBlob(API_ENDPOINTS.BACKUPS_DOWNLOAD);
```

- **Lecturas exigen `schema`** (zod en el borde). Respuesta que no cumple → `ApiError` `kind: 'contract'`
  con `issues: { path, message }[]` (p. ej. `{ path: '1.monto', … }`); en dev además se loguea
  `[api] Respuesta fuera de contrato en GET <endpoint>` con los issues en la consola.
- Mutaciones sin `schema` resuelven `undefined` aunque el backend mande body (si se necesita la
  respuesta, pasar `schema`).
- Params `undefined`/`null`/`''` se descartan (como `HttpService`).
- Orden de capas = interceptores de Angular: **keep-alive → error global → auth → retry → fetch**.
  - **Error global:** todo error final se publica en el bus (salvo `skipGlobalError` o abort del caller).
  - **Auth:** agrega `Bearer` (salvo `auth/login|register|refresh` y `skipAuth`); ante 401 con token
    pide token nuevo al `AuthBridge` registrado por `@/shared/auth` (cola de refresh) y reintenta una vez.
    Un 401 resuelto así **no** dispara error global.
  - **Retry:** GET/HEAD/OPTIONS ante 502/503/504/0; mutaciones ante 503/0; nunca `auth/refresh`; nunca
    offline. 3 reintentos, backoff `1s·2^n + jitter(≤300ms)`.
  - **Keep-alive:** cada request (salvo `isKeepAlive`) avisa actividad al listener registrado.
- `registerAuthBridge` / `setActivityListener` (`registry.ts`): los usan `auth/register.ts` y el
  keep-alive; no usarlos desde features.
- `createApiClient(deps)` para tests (inyectar `fetchFn`, `sleep`, `random`, `isOnline`…).
- `bearerHeaders(token | null)`: único armado del `Authorization: Bearer` (lo reusa `logoutRequest`
  con `skipAuth`); `{}` sin token.

## endpoints

`API_ENDPOINTS` (constantes + builders con id: `persona(id)`, `saldoPersonal(personaId)`,
`eventoReportePublico(id)`, `producto(productoId)`…), `QUERY_PARAMS.SOLO_ACTIVOS`, `HTTP_CONFIG`.
**Todo id interpolado en un path pasa por `pathSegment(id)`** (`encodeURIComponent`; rechaza `''`,
`.`, `..`): un id de la URL como `../backups/download` no puede saltar a otro endpoint con el Bearer
del usuario. Además `buildUrl` rechaza endpoints con segmentos `.`/`..` o que resuelvan fuera de la base.
`API_BASE_URL` sale de `NEXT_PUBLIC_API_URL`, validada con zod al importar (fail fast).

## errores

`ApiError { kind: 'http' | 'network' | 'contract', status, method, url, body, message }`.
`message` ya es el texto para el usuario: el `message` de NestJS (string o array unido con `". "`), o
el fallback en español por status (port literal de `ErrorHandlerService`). `extractErrorMessage(e,
fallback?)` para cualquier valor lanzado.

## errores globales

Store zustand vanilla: `publishGlobalError(msg)`, `dismissGlobalError(id)`, `useGlobalErrors()` (hook
para la futura UI de toasts), `globalErrorStore` (fuera de React / tests).

## keep-alive

`useKeepAlive()` — ya lo monta `useSessionBootstrap()`; no montarlo aparte. Mientras está montado, cada
request real reinicia una cuenta de **14 min** (`KEEP_ALIVE_MS`); al vencer hace `GET /` (público)
con `isKeepAlive` (no reinicia el timer) y reprograma, haya funcionado o no. Al desmontar cancela.
`createKeepAlive({ ping, delayMs? })` es el módulo puro (tests/composición).

## cache

`appCache` (`@/shared/cache`): `set({ key, data, ttlMs? })`, `get(key): unknown` (validar con schema/type guard al leer), `has`, `delete`, `clear`,
`invalidate(pattern)` (claves que contienen el patrón), `cleanup()`, `getStats()`. TTL 5 min, 100
entradas. Paridad con `CacheService`: desaloja por orden de inserción (un `get` no refresca) y
`ttl` 0 = default. Sin timer global: los vencidos se borran al leerlos o con `cleanup()`.
Claves namespaced (`'movimientos:caja:<id>'`). `clearSession`/`logout` lo vacían (no mostrar
datos de otro usuario).

## auth

`@/shared/auth` — sesión JWT propia del backend. El refresh reactivo se cablea solo en `apiClient`
(`api-client.ts` importa `@/shared/auth/register`): cualquier uso de `apiClient` adjunta el token.
No toca `window` al importarse.

**Montaje:** en el layout `(app)`, una vez: `useSessionBootstrap()` (initializeSession + keep-alive +
`router.replace` como navegador de la sesión) y `const { status } = useRequireSession()`.

- **Tokens:** `localStorage` con las claves de Angular (`accessToken`, `refreshToken`). Storage no
  disponible = sin sesión (no rompe). `decodeJwt` valida `{sub,email,tipo,iat,exp}` con zod.
- **Operaciones** (`session.ts`): `login`, `register` (guardan tokens + usuario), `logout()` (POST
  `auth/logout` fire-and-forget con Bearer + refreshToken actuales, limpia, va a `/login`),
  `changePassword` (invalida sesiones → limpia y a `/login`), `changeEmail` (actualiza el email del
  usuario), `initializeSession()` (llamar al montar la app: restaura con `auth/me`, refrescando si el
  access venció; cualquier fallo → anónimo), `refreshSession()` (single-flight).
- **Refresh ante 401:** N requests concurrentes → **un** `auth/refresh`, luego se reintentan todas
  con el token nuevo; un 401 que llega después de otro refresh reusa el token vigente; si el refresh
  falla → **un** `logout()` y todas rechazan (en Angular quedaban colgadas). Con la sesión ya
  cerrada (sin refresh token) un 401 rechaza con `AUTH_COPY.NO_REFRESH_TOKEN` sin repetir logout.
- `setTokens` devuelve `boolean`; si no se pueden guardar, login/register/refresh fallan con
  `AUTH_COPY.STORAGE_UNAVAILABLE`.
- **Guards:** `useRequireSession()` en el layout `(app)` → `{ status: 'checking'|'allowed'|'redirecting' }`,
  re-evaluado en cada navegación (`usePathname`) como `canActivate` (pasa con access **o** refresh válido; si no guarda `redirectUrl` en sessionStorage y va a
  `/login`). `useRedirectIfAuthenticated()` en `/login`. Post-login: `router.replace(consumeRedirectUrl())` (default `/dashboard`,
  solo paths internos).
- **Estado:** `useSession()` → `{ user, isAuthenticated, isLoading, initialized }`; `sessionStore` fuera de React.

## Lecturas transversales — `shared/queries/`

`fetchPersonasActivas` (`?soloActivos=true`, para selectores), `fetchPersonasTodas`, `fetchCajas`,
`fetchFondoSolidario`, `fetchSaldoFondoSolidario`, `fetchSaldoPersonal(personaId)`. Etiquetas:
`cajaLabel(caja)` ("Cuenta de X", "Fondo Manada", "Caja {id8}"), `cajaOptions`, `personaOptions`.
Cada feature mantiene en sus `services/` lo que es solo suyo.
