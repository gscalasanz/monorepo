# REGISTRY — índice de lo reutilizable (monorepo)

> **Buscá acá antes de crear** (en web, después ReUI vía MCP; recién después, código propio).
> Si creás o instalás algo reutilizable, registralo en el **mismo commit** (CLAUDE.md §5).
> El detalle por categoría vive en `REGISTRY-detail/` (`domain`, `api`, `ui`, `testing`).
> Crece **on-miss**: solo lo que existe y se reusa; nada aspiracional.

## Routing por categoría

| Categoría | Qué hay | Detail |
| --- | --- | --- |
| `domain` | `@scout/shared` (enums + `time`), adaptadores de web, schemas zod, formatos, validadores, settings | [domain](./REGISTRY-detail/domain.md) |
| `api` | `apps/api/src/common` + decoradores de auth (backend) · cliente HTTP, auth, cache y lecturas de web | [api](./REGISTRY-detail/api.md) |
| `ui` | Componentes, hooks y layout de `apps/web/src/shared` | [ui](./REGISTRY-detail/ui.md) |
| `testing` | Fakes y fixtures | [testing](./REGISTRY-detail/testing.md) |

## Índice alfabético

| Símbolo | Categoría | Ubicación |
| --- | --- | --- |
| `@Public()` · `IS_PUBLIC_KEY` · `@CurrentUser()` · `JwtAuthGuard` (global) | api (backend/auth) | `apps/api/src/modules/auth/{decorators,guards}/` → [api](./REGISTRY-detail/api.md#backend-auth) |
| `@scout/shared/enums` — `CajaType`, `ConceptoMovimiento`, `PersonaType`, `Rama`… (20 enums + constantes) | domain (shared) | `packages/shared/src/enums/<dominio>.ts` → [domain](./REGISTRY-detail/domain.md#scoutsharedenums) |
| `@scout/shared/time` — `nowInstant`, `todayBsAs`, `formatDate`, `DATE_FORMATS`, `BSAS_TIME_ZONE`, `Instant`/`LocalDate`… | domain (shared/time) | `packages/shared/src/time/` → [domain](./REGISTRY-detail/domain.md#scoutsharedtime) |
| `@/shared/domain` — enums de web (`CAJA_TYPE`, `CONCEPTO_MOVIMIENTO`, `RAMA`…, re-export de `@scout/shared/enums`) + `*_LABELS` | domain (web) | `apps/web/src/shared/domain/<dominio>/enums.ts` → [domain](./REGISTRY-detail/domain.md#web-shareddomain) |
| `@/shared/domain` — schemas zod de respuestas (`movimientoSchema`, `cajaResponseSchema`, `reporteEventoSchema`…) | domain (web) | `apps/web/src/shared/domain/<dominio>/schemas.ts` → [domain](./REGISTRY-detail/domain.md#web-shareddomain) |
| `@/shared/time` (re-export de `@scout/shared/time` + `localDateSchema` · `instantSchema`) | domain (web/time) | `apps/web/src/shared/time/` → [domain](./REGISTRY-detail/domain.md#web-sharedtime) |
| `@/shared/validators` (`positiveNumber`, `decimalPlaces`, `safeText`, `dateRange`, `saldoSuficiente`, `personaAReembolsar*`, `refineWith`, `VALIDATION_MESSAGES`…) | domain (web/validators) | `apps/web/src/shared/validators/` → [domain](./REGISTRY-detail/domain.md#validators) |
| `ActionsMenu` | ui (datos) | `apps/web/src/shared/components/data/actions-menu.tsx` → [ui](./REGISTRY-detail/ui.md#actionsmenu--sharedcomponentsdataactions-menutsx) |
| `ApiError` · `isApiError` · `extractErrorMessage` · `nestMessageOf` | api (web) | `apps/web/src/shared/api/api-error.ts` → [api](./REGISTRY-detail/api.md#errores) |
| `API_ENDPOINTS` · `QUERY_PARAMS` · `HTTP_CONFIG` · `buildUrl` · `API_BASE_URL` | api (web) | `apps/web/src/shared/api/` → [api](./REGISTRY-detail/api.md#endpoints) |
| `apiClient` (`get`/`post`/`patch`/`delete`/`getBlob`/`getText`) · `createApiClient` | api (web) | `apps/web/src/shared/api/api-client.ts` → [api](./REGISTRY-detail/api.md#cliente) |
| `APP_ROUTES` · `PERSONA_TYPE_ROUTES` · `cajasHref` · `movimientosHref` · `personaHref` · `movimientoEditHref` · `CAJAS_TAB` · `MOVIMIENTOS_LIST_PARAMS` · `UI_CONFIG` · `LOCALE` · `CURRENCY` | domain (web/constants) | `apps/web/src/shared/constants/` → [domain](./REGISTRY-detail/domain.md#links-entre-pantallas) |
| `APP_TIMEZONE` (alias de `BSAS_TIME_ZONE`) | api (backend/constants) | `apps/api/src/common/constants/app.constants.ts` → [api](./REGISTRY-detail/api.md#backend-common) |
| `appCache` · `createMemoryCache` · `CACHE_CONFIG` · `CacheEntry` | api (web/cache) | `apps/web/src/shared/cache/` → [api](./REGISTRY-detail/api.md#cache) |
| `AppDataGrid` (`expandable`/`ExpandToggle`) · `InitialsAvatar` · `sortableHeader` · `Money` · `StatusBadge` · `RamaChip` · `DirectionTile` · `KeyValueList` · `SegmentedTabs`/`ButtonTabs` · `FilterBar` · `ListPanel`/`ListToolbar` · `TotalsBar` · `useMediaQuery` | ui (datos) | `apps/web/src/shared/components/data/` → [ui](./REGISTRY-detail/ui.md#datos--sharedcomponentsdata) |
| `AppShell` · `SessionGate` · `PageHeader` · `ThemeToggle` · `NAV_GROUPS` · `pageMetaFor` · `isFormRoute` | ui (layout) | `apps/web/src/shared/layout/` → [ui](./REGISTRY-detail/ui.md#layout--sharedlayout) |
| `BackLink` · `useGoBack` · `NavigationTracker` | ui (navegación) | `apps/web/src/shared/navigation/` → [ui](./REGISTRY-detail/ui.md#navegación--sharednavigation) |
| `BarChartCard` · `DonutChart` · `Sparkline` · `KpiStrip` · `ProgressTrack` · `StatCard` · `DistributionBar` · `ChartLegend` · `SERIES_COLORS` | ui (gráficos) | `apps/web/src/shared/components/charts/` → [ui](./REGISTRY-detail/ui.md#gráficos--sharedcomponentscharts) |
| `BaseEntity` (UUID, timestamps, soft delete) | api (backend) | `apps/api/src/common/entities/base.entity.ts` → [api](./REGISTRY-detail/api.md#backend-common) |
| `Button` | ui | `apps/web/src/shared/components/ui/button.tsx` → [ui](./REGISTRY-detail/ui.md#button--sharedcomponentsuibuttontsx) |
| `calculateEventProfit` · `calculateProfitBySeller` | domain (web/evento) | `apps/web/src/shared/domain/evento/profit.ts` |
| `cn` | ui (lib) | `apps/web/src/shared/lib/utils.ts` → [ui](./REGISTRY-detail/ui.md#cn--sharedlibutilsts) |
| `confirmDialog` · `ConfirmDialogHost` · `errorHintFor` | ui (feedback) | `apps/web/src/shared/confirm/` → [ui](./REGISTRY-detail/ui.md#confirmación--sharedconfirm) |
| `createFakeFetch` | testing | `apps/web/src/shared/api/testing/fake-fetch.ts` → [testing](./REGISTRY-detail/testing.md) |
| `dateOnlyTransformer` (columnas `date`) | api (backend) | `apps/api/src/common/utils/date-only.transformer.ts` → [api](./REGISTRY-detail/api.md#backend-common) |
| `decimalSchema` · `nullableField` · `paginatedSchema` · `PaginatedResponse<T>` | domain (web/common) | `apps/web/src/shared/domain/common/` → [domain](./REGISTRY-detail/domain.md#common) |
| `decodeJwt` · `isTokenValid` · `getAccessToken` · `setTokens` · `clearTokens` · `sessionStore` · `createSingleFlight` | api (web/auth) | `apps/web/src/shared/auth/` → [api](./REGISTRY-detail/api.md#auth) |
| `DeletionValidatorService` · `DeletionCheckResult` | api (backend) | `apps/api/src/common/services/deletion-validator.service.ts` → [api](./REGISTRY-detail/api.md#backend-common) |
| `EmptyState` · `LoadingState` · `ErrorState` · `NotFoundView` | ui (feedback) | `apps/web/src/shared/components/feedback/` → [ui](./REGISTRY-detail/ui.md#feedback--sharedcomponentsfeedback) |
| `esMayorDeEdad` | api (backend) | `apps/api/src/common/utils/papeles.util.ts` → [api](./REGISTRY-detail/api.md#backend-common) |
| `escapeLikePattern` | api (backend) | `apps/api/src/common/utils/sql-like.utils.ts` → [api](./REGISTRY-detail/api.md#backend-common) |
| `evaluateAuthGuard` · `evaluateNoAuthGuard` · `saveRedirectUrl` · `consumeRedirectUrl` | api (web/auth) | `apps/web/src/shared/auth/` → [api](./REGISTRY-detail/api.md#auth) |
| `fetchPersonasActivas` · `fetchCajas` · `fetchFondoSolidario` · `fetchSaldoPersonal` · `cajaLabel` · `personaOptions` | api (web/lecturas) | `apps/web/src/shared/queries/` → [api](./REGISTRY-detail/api.md#lecturas-transversales--sharedqueries) |
| `filterMovimientos` · `CONCEPTOS_MANUALES_POR_TIPO` | domain (web/movimiento) | `apps/web/src/shared/domain/movimiento/helpers.ts` |
| `formatMoney` · `humanize` · `initialsOf` · `resolveStatusTone` · `STATUS_TONE` | domain (web/format) | `apps/web/src/shared/format/` → [domain](./REGISTRY-detail/domain.md#format) |
| `FormDialogShell` · `useDialogSubmit` | ui (finanzas) | `apps/web/src/shared/components/finanzas/` → [ui](./REGISTRY-detail/ui.md#finanzas--sharedcomponentsfinanzas) |
| `FormField` · `TextField` · `PasswordField` · `PhoneField` · `NumberField` · `MoneyField` · `TextareaField` · `SelectField` · `ComboboxField` · `CheckboxField` · `SwitchField` · `RadioCardsField` · `DateField` · `DateTimeField` · `TimeField` · `DaysOfWeekField` · `FormActions` · `InputControl` · `useFieldChrome` | ui (formularios) | `apps/web/src/shared/components/ui/form/` → [ui](./REGISTRY-detail/ui.md#formularios--sharedforms--sharedcomponentsuiform) |
| `isPersonaDisabled` · `onlyEnabled` · `ramaFromTabKey` | domain (web/persona) | `apps/web/src/shared/domain/persona/` |
| `loadInscripcionConfig` · `updateInscripcionConfig` · `saveInscripcionConfig` · `montoByTipo` | domain (web/settings) | `apps/web/src/shared/settings/` → [domain](./REGISTRY-detail/domain.md#settings) |
| `login` · `logout` · `register` · `changePassword` · `changeEmail` · `initializeSession` · `refreshSession` | api (web/auth) | `apps/web/src/shared/auth/session.ts` → [api](./REGISTRY-detail/api.md#auth) |
| `makeJwt` · `tokenExpiringIn` | testing | `apps/web/src/shared/auth/testing/jwt.ts` → [testing](./REGISTRY-detail/testing.md) |
| `MESSAGES` | domain (web/copy) | `apps/web/src/shared/copy/` |
| `MovimientoCard` · `MovimientosTable` · `MovimientoConcepto` · `EstadoPagoBadge` · `MovimientoFilterTabs` · `filterMovimientosBy` · `confirmPagarReembolso` · `GastoFormDialog` · `IngresoFormDialog` · `toGastoDto`/`toGastoEventoDto`/`toIngresoDto` | ui (finanzas) | `apps/web/src/shared/components/finanzas/` → [ui](./REGISTRY-detail/ui.md#finanzas--sharedcomponentsfinanzas) |
| `notify` · `AppToaster` | ui (feedback) | `apps/web/src/shared/notifications/` → [ui](./REGISTRY-detail/ui.md#notificaciones--sharednotifications) |
| `Panel` · `NavChevron` · `InfoHint` · `FormCard` · `ButtonLink` | ui | `apps/web/src/shared/components/ui/` → [ui](./REGISTRY-detail/ui.md#panel--sharedcomponentsuipaneltsx) |
| `pathSegment` | api (web) | `apps/web/src/shared/api/path-segment.ts` → [api](./REGISTRY-detail/api.md#endpoints) |
| `publishGlobalError` · `useGlobalErrors` · `dismissGlobalError` · `globalErrorStore` | api (web) | `apps/web/src/shared/api/global-errors.ts` → [api](./REGISTRY-detail/api.md#errores-globales) |
| `readItem` · `writeItem` · `removeItem` | domain (web/storage) | `apps/web/src/shared/storage/` (Web Storage SSR-safe) |
| `registerAuthBridge` · `setActivityListener` · `bearerHeaders` | api (web) | `apps/web/src/shared/api/registry.ts` → [api](./REGISTRY-detail/api.md#cliente) |
| ReUI/shadcn vendorizado (`button`, `select`, `dialog`, `sheet`, `data-grid`…) | ui (vendor) | `apps/web/src/shared/components/reui/` → [ui](./REGISTRY-detail/ui.md#reui--shadcn-vendorizado--sharedcomponentsreui) |
| `RowActionsMenu` · `RowAction` | ui (datos) | `apps/web/src/shared/components/data/row-actions-menu.tsx` → [ui](./REGISTRY-detail/ui.md#rowactionsmenu--sharedcomponentsdatarow-actions-menutsx) |
| Fixtures de dominio (`MOVIMIENTO_FIXTURE`, `PROTAGONISTA_FIXTURE`… + `omitKeys`) | testing | `apps/web/src/shared/domain/testing/fixtures.ts` → [testing](./REGISTRY-detail/testing.md) |
| `useAsyncData` | ui (hooks) | `apps/web/src/shared/hooks/use-async-data.ts` → [ui](./REGISTRY-detail/ui.md#useasyncdata--sharedhooksuse-async-datats) |
| `useFieldValidation` · `collectFieldErrors` · `SaveResult` · `useFormState` · `useNumericDraft` · `parseMoneyInput` · `formatMoneyInput` · `maskPhone` · `phoneValueFromInput` · `toggleDay` | ui (formularios) | `apps/web/src/shared/forms/` → [ui](./REGISTRY-detail/ui.md#formularios--sharedforms--sharedcomponentsuiform) |
| `useHasTokens` | api (web/auth) | `apps/web/src/shared/auth/use-has-tokens.ts` (¿hay tokens? sin guard ni redirect; `null` en SSR) |
| `useKeepAlive` · `createKeepAlive` · `KEEP_ALIVE_MS` | api (web) | `apps/web/src/shared/api/keep-alive.ts`, `use-keep-alive.ts` → [api](./REGISTRY-detail/api.md#keep-alive) |
| `useSessionBootstrap` · `useSession` · `useRequireSession` · `useRedirectIfAuthenticated` | api (web/auth) | `apps/web/src/shared/auth/hooks.ts` → [api](./REGISTRY-detail/api.md#auth) |
| `useTheme` · `setThemeMode` · `toggleThemeMode` · `THEME_INIT_SCRIPT` | ui (tema) | `apps/web/src/shared/theme/` → [ui](./REGISTRY-detail/ui.md#tema--sharedtheme) |
