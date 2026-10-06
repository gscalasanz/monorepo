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

- **Lecturas exigen `schema`** (zod en el borde). Respuesta que no cumple → `ApiError` `kind: 'contract'`.
- Mutaciones sin `schema` resuelven `void` (el backend responde body vacío en muchos 200/201/204).
- Params `undefined`/`null`/`''` se descartan (como `HttpService`).
- Orden de capas = interceptores de Angular: **keep-alive → error global → auth → retry → fetch**.
  - **Error global:** todo error final se publica en el bus (salvo `skipGlobalError` o abort del caller).
  - **Auth:** agrega `Bearer` (salvo `auth/login|register|refresh` y `skipAuth`); ante 401 con token
    pide token nuevo al `AuthBridge` registrado por `@/shared/auth` (cola de refresh) y reintenta una vez.
    Un 401 resuelto así **no** dispara error global.
  - **Retry:** GET/HEAD/OPTIONS ante 502/503/504/0; mutaciones ante 503/0; nunca `auth/refresh`; nunca
    offline. 3 reintentos, backoff `1s·2^n + jitter(≤300ms)`.
  - **Keep-alive:** cada request (salvo `isKeepAlive`) avisa actividad al listener registrado.
- `registerAuthBridge` / `setActivityListener` (`registry.ts`) rompen el ciclo api ↔ auth: no usarlos
  desde features.
- `createApiClient(deps)` para tests (inyectar `fetchFn`, `sleep`, `random`, `isOnline`…).

## endpoints

`API_ENDPOINTS` (constantes + builders con id: `persona(id)`, `saldoPersonal(personaId)`,
`eventoReportePublico(id)`, `producto(productoId)`…), `QUERY_PARAMS.SOLO_ACTIVOS`, `HTTP_CONFIG`.
`API_BASE_URL` sale de `NEXT_PUBLIC_API_URL`, validada con zod al importar (fail fast).

## errores

`ApiError { kind: 'http' | 'network' | 'contract', status, method, url, body, message }`.
`message` ya es el texto para el usuario: el `message` de NestJS (string o array unido con `". "`), o
el fallback en español por status (port literal de `ErrorHandlerService`). `extractErrorMessage(e,
fallback?)` para cualquier valor lanzado.

## errores globales

Store zustand vanilla: `publishGlobalError(msg)`, `dismissGlobalError(id)`, `useGlobalErrors()` (hook
para la futura UI de toasts), `globalErrorStore` (fuera de React / tests).
