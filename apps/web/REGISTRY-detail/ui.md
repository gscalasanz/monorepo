# REGISTRY-detail — UI (`src/shared`)

Primitivas y helpers de UI compartidos entre features. Consumen **solo** tokens del contrato
(`src/shared/styles/TOKENS-CONTRACT.md`). Importar por su ruta en `shared`, nunca duplicar.

## `cn` — `shared/lib/utils.ts`

Combina clases con `clsx` + `tailwind-merge`. Es el helper que esperan los componentes de ReUI.

## ReUI / shadcn vendorizado — `shared/components/reui/`

Instalado con `pnpm dlx shadcn@latest add` (style `base-nova`, `@base-ui/react`) y movido acá.
Primitivos: `button`, `input`, `label`, `textarea`, `select`, `combobox`, `checkbox`, `switch`,
`radio-group`, `field`, `input-group`, `dialog`, `alert-dialog`, `sheet`, `popover`, `tooltip`,
`dropdown-menu`, `tabs`, `card`, `separator`, `skeleton`, `spinner`, `table`, `calendar`, `sonner`.
ReUI: `data-grid/*` (TanStack Table **v9**; sin variantes dnd/virtual), `alert`, `badge`,
`icon-tile`, `timeline`. Parches (`PATCH Scout`): `sonner.tsx` usa `@/shared/theme` y tokens de
marca; overlays `bg-black/10` → `bg-ink/30`; un `!` por `noUncheckedIndexedAccess` en
`data-grid-cell-selection.tsx`. `time-picker` de ReUI descartado (no compila con TS strict): se usa
`<input type="time">` nativo. No usar estos archivos directo en features si hay un primitivo de
marca en `shared/components/ui` o un componente en `shared/components/{data,charts,feedback}`.

## `Button` — `shared/components/ui/button.tsx`

Botón de marca sobre el de ReUI. `variant`: `primary` (un CTA por vista) · `secondary` · `ghost` ·
`danger` · `danger-soft` · `link`. `size`: `md` (44px mobile / 38px desktop) · `sm` · `icon` ·
`icon-sm`. `loading` deshabilita y muestra spinner; `icon` antepone un ícono.

## Tema — `shared/theme/`

`useTheme()` → `{ mode, toggle }`; `setThemeMode`, `toggleThemeMode`, `initializeTheme`. Persiste
en `localStorage['scout-theme-preference']` (misma clave que Angular) y aplica `[data-theme]` en
`<html>`. `THEME_INIT_SCRIPT` va inline en `<head>` del root layout (sin flash).

## Notificaciones — `shared/notifications/`

`notify.success|error|warning|info(message)` (fachada de sonner; errores duran el doble).
`<AppToaster/>` va una vez en el root layout y además muestra los errores globales de `apiClient`.

## Confirmación — `shared/confirm/`

`confirmDialog.confirm({ title, message, confirmText?, destructive?, details?, warning? })` →
`Promise<boolean>`; `confirmDialog.confirmDelete(entidad)`; modo async con estados
(confirmar → procesando → éxito/error con pista): `confirmDialog.run({ ..., action })` y
`confirmDialog.runDelete(entidad, { action, warning? })` → `Promise<{ confirmed, error? }>`.
`<ConfirmDialogHost/>` va una vez en el root layout.

## Layout — `shared/layout/`

`AppShell` (sidebar indigo colapsable ≥md; top bar + drawer + bottom-nav con "+" a nuevo
movimiento en mobile; el bottom-nav se oculta en rutas de formulario, `isFormRoute`),
`SessionGate` (bootstrap de sesión + guard; lo usa `app/(app)/layout.tsx`), `PageHeader`
(`title`, `subtitle`, `actions`, `backHref`), `ThemeToggle`, `NAV_GROUPS`, `PAGE_META`,
`pageMetaFor(pathname)`, `isActivePath`.

## Datos — `shared/components/data/`

Importar de `@/shared/components/data`.

- `AppDataGrid<T>` — tabla densa (DataGrid ReUI, TanStack v9): `{ columns: AppColumnDef<T>[], data, isLoading?, emptyState?, pagination?: 'client' (default, `UI_CONFIG.PAGINATION`) | 'none' | { pageIndex, pageSize, total, onChange }, sorting?: { state, onChange, manual? }, initialSorting?, onRowClick?, getRowId?, mobileRow?: (row) => ReactNode, layout?: 'auto'|'table'|'list', ariaLabel? }`. <860px → lista (`mobileRow` o primeras dos columnas). Labels en español (`DATA_GRID_I18N_ES`). `sortableHeader('Fecha')` para headers ordenables; `MONEY_CELL_CLASS` en `meta.cellClassName`/`headerClassName` para montos.
- `Money` — `{ amount, sign?: 'in'|'out'|'auto', tone?: 'debt', size?: 'inline'|'figure-md'|'figure', decimals?, placeholder? }`. `+`/`−` (U+2212), `$` subordinado. Helpers puros `toMoneyParts`, `formatSignedMoney`.
- `StatusBadge` — `{ status?, label?, tone?, icon?, hideIcon? }`; tono vía `resolveStatusTone` + estados de pago de DESIGN (parcial, bonificado, a reembolsar, a cobrar); siempre ícono + texto. `resolveBadgeTone`, `BADGE_TONE`.
- `RamaChip` — `{ rama, variant?: 'chip'|'dot' }` (fuera de las 4 ramas: punto burgundy).
- `DirectionTile` — `{ direction: 'in'|'out', decorative? }` tile 28px con flecha.
- `KeyValueList` — `{ items: { label, value, id? }[], columns?: 1|2|3|4 }` (equivale a `readonly-card`).
- `SegmentedTabs` / `ButtonTabs` — `{ items, value, onValueChange, ariaLabel, semantics?: 'tabs'|'toggle', getPanelId? }` (tablist con flechas).
- `FilterBar` — `{ fields: FilterField[], value: FilterValues, onChange, trailing?, debounceMs? }`; campos `search` (debounce `UI_CONFIG.DEBOUNCE_TIME_MS`), `select` (chip "+ Label" → popover), `chips` (segmentado con "Todos"), `date-range` (`{ from?, to? }` `yyyy-MM-dd`). "Limpiar filtros" emite `{}`. Helpers `setFilterValue`, `hasActiveFilters`, `useDebouncedCommit`.
- `TotalsBar` — `{ count, ingresos, egresos, neto?, countLabel? }` barra hundida con `aria-live="polite"`.
- `useMediaQuery(query)` · `MOBILE_LIST_QUERY` — media query SSR-safe.

## Gráficos — `shared/components/charts/`

Importar de `@/shared/components/charts`. Colores solo `var(--color-data-n)` (`SERIES_COLORS`, `seriesColor(i)`) en orden fijo; `role="img"` + `aria-label` con la conclusión.

- `BarChartCard` — `{ title, ariaLabel, data: { label, values: Record<key, number> }[], series: { key, label, color? }[], orientation?: 'vertical'|'horizontal', format?, height?, action? }` (recharts; serie única o pareada con leyenda).
- `DonutChart` — `{ data: { label, value, color? }[], ariaLabel, format? (default `formatMoney`), centerLabel?, size? }` con total al centro + leyenda con montos.
- `Sparkline` — `{ values, color?, ariaLabel? }` SVG 96×32 (decorativa si no hay `ariaLabel`).
- `KpiStrip` — `{ items: { id, label, value, delta?: { direction, value, comparison?, tone? }, sparkline?, sparklineColor? }[], ariaLabel? }`: un panel, celdas con hairlines. `KpiDelta` suelto.
- `StatCard` — `{ icon, title, value, variant?, format?: 'number'|'currency' }` (paridad `stat-card`).
- `DistributionBar` — `{ segments: { label, value, color? }[], format?, ariaLabel?, showLegend? }` barra segmentada 2px + leyenda.
- `ChartLegend`, `ChartTooltip` — piezas reutilizables para gráficos propios.

## Feedback — `shared/components/feedback/`

Importar de `@/shared/components/feedback`.

- `EmptyState` — `{ title?, hint?, icon?, action? }` tile hundido 36px + frase + pista.
- `LoadingState` — `{ variant?: 'spinner'|'skeleton', rows?, label? }` con `role="status"` y "Cargando…".
- `ErrorState` — `{ message?, title?, onRetry?, retryLabel? }` (`role="alert"` + "Reintentar").
- `NotFoundView` — `{ homeHref? }` contenido 404 (copy de Angular, link a `/dashboard`).

## Formularios — `shared/forms` + `shared/components/ui/form`

Lógica en `@/shared/forms` (port de mi-tienda); campos de marca en `@/shared/components/ui/form`.
Todos los campos son **controlados** (`value` + `onChange(value)` tipado, `onBlur?`) y comparten
`FieldBaseProps`: `{ label, id?, name?, helper?, error?, valid?, required?, disabled?, className?, onBlur? }`.
Cableado a11y automático (label↔control, `aria-invalid`, `aria-describedby` a ayuda/error, error con
ícono + `role="alert"`, check de válido y candado de deshabilitado dentro del control). Copy en `FORM_COPY`.

**Lógica (`@/shared/forms`)**
- `useFieldValidation(schema)` → `{ errors, valid, onBlur(name, v), onChange(name, v), validateAll(values), reset }`: error al salir del campo, se limpia al tipear, válido en vivo.
- `collectFieldErrors(zodError)` → `Record<campo, primerMensaje>`. `SaveResult` = `{ ok: true } | { ok: false, message }`.
- `useFormState(initial)` → `{ values, setField(name, v), setValues(patch), reset(next?), isDirty }` (inmutable).
- `useNumericDraft({ value, onChange, parse, format, sanitize? })` borrador texto ↔ `number | null` (nunca `NaN`).
- `parseMoneyInput` (`'1.234,56'`/`'1234.5'` → número | null) · `formatMoneyInput` (es-AR) · `parseNumberInput`.
- `maskPhone` (`(11) 1234-5678`) · `phoneValueFromInput({ input, format: 'E164'|'digits' })` · `phoneDisplayFromValue`.
- `toggleDay(selected, day)` alterna manteniendo lunes→domingo.

**Campos (`@/shared/components/ui/form`)**
- `FormField` — `{ ids, label, helper?, error?, required?, as?: 'div'|'fieldset', hideLabel? }` envoltorio base; ids con `useFieldIds({ id, hasHelper, hasError })` o `useFieldChrome(props)` + `controlAria(ids, props)`.
- `TextField` — `type?: 'text'|'email'|'search'|'url'`, `placeholder`, `autoComplete`, `maxLength`.
- `PasswordField` — toggle mostrar/ocultar (`aria-label` + `aria-pressed`), `autoComplete?: 'current-password'|'new-password'`.
- `PhoneField` — máscara AR; `valueFormat?: 'E164'|'digits'` (default E.164 como Angular).
- `NumberField` — `value: number | null`, `min`, `max`, `step`.
- `MoneyField` — `value: number | null`, prefijo `$`, input grande 24px/600 (`size?: 'lg'|'md'`), reformatea es-AR al salir.
- `TextareaField` — `rows?`, `maxLength?` (muestra contador `n/max`).
- `SelectField<T>` — `options: { value, label, disabled? }[]`, `value: T | null`, `placeholder?` (Base UI Select: teclado + táctil).
- `ComboboxField<T>` — igual que Select pero con búsqueda (listas largas: personas); `emptyText?`.
- `CheckboxField` / `SwitchField` — `value: boolean`, `description?`; fila táctil ≥44px.
- `RadioCardsField<T>` — `options` con `description`, `columns?: 1|2|3` (medio de pago).
- `DateField` (`YYYY-MM-DD`) · `DateTimeField` (`YYYY-MM-DDTHH:mm`, `step` 60) · `TimeField` (`HH:mm`, `step` 60) — pickers nativos; convertir con `@/shared/time`.
- `DaysOfWeekField` — `value: readonly DayOfWeek[]`, toggles con `aria-pressed` + "Todos"/"Ninguno".
- `FormActions` — `{ onCancel?, onSave?, saveLabel?, cancelLabel?, saving?, saveDisabled?, form?, extra? }`: barra fija abajo en mobile, estática desde `md`. Sin `onSave` el botón es `type="submit"`.
- Piezas: `InputControl` (input de marca con `prefix`/`suffix`/`size`), `FieldMessage`, `FieldLabelText`, `ControlStatusIcon`, `ChoiceRow`, `RadioCard`, `DayToggle`, `PasswordToggle`, `CONTROL_SURFACE`/`CONTROL_SIZE`.
