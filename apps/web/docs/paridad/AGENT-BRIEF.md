# Brief para agentes de módulo (migración Angular → React)

Leé esto completo antes de tocar código. Lo que dice `CLAUDE.md` manda sobre esto.

## Antes de codear (obligatorio, en este orden)

1. `CLAUDE.md` (reglas no negociables §4–§7), `docs/DESIGN.md` (contrato visual), `docs/HALLAZGOS.md`.
2. `REGISTRY.md` + `REGISTRY-detail/*.md`: **reusá** lo que existe. En particular:
   - Layout: `PageHeader` (`@/shared/layout`), `Panel` (`@/shared/components/ui/panel`), `Button`.
   - Datos: `AppDataGrid`, `FilterBar`, `TotalsBar`, `Money`, `StatusBadge`, `RamaChip`,
     `DirectionTile`, `KeyValueList`, `SegmentedTabs` (`@/shared/components/data`).
   - Gráficos: `KpiStrip`, `StatCard`, `DonutChart`, `BarChartCard`, `DistributionBar` (`@/shared/components/charts`).
   - Feedback: `EmptyState`, `LoadingState`, `ErrorState` (`@/shared/components/feedback`), `notify`
     (`@/shared/notifications`), `confirmDialog` (`@/shared/confirm`: `confirm`, `confirmDelete`,
     `run`, `runDelete` con estados de carga/error dentro del diálogo).
   - Forms: `@/shared/components/ui/form` (`TextField`, `MoneyField`, `NumberField`, `SelectField`,
     `ComboboxField`, `DateField`, `CheckboxField`, `SwitchField`, `RadioCardsField`, `TextareaField`,
     `FormActions`…) + `@/shared/forms` (`useFormState`, `useFieldValidation`, `collectFieldErrors`).
   - Diálogos: `@/shared/components/reui/dialog` (vendorizado) con contenido propio.
   - Datos remotos: `useAsyncData({ key, load })` (`@/shared/hooks`), `apiClient` + `API_ENDPOINTS`
     (`@/shared/api`; si falta un endpoint, agregalo en `src/shared/api/endpoints.ts`), schemas zod de
     `@/shared/domain` (todo read valida con schema), lecturas transversales en `@/shared/queries`
     (`fetchPersonasActivas`, `fetchCajas`, `fetchFondoSolidario`, `fetchSaldoPersonal`, `cajaLabel`,
     `personaOptions`), fechas SOLO con `@/shared/time`, formatos con `@/shared/format`.
3. La paridad del módulo en `docs/paridad/<archivo>.md` (relevada del Angular). Ante dudas, leé el
   Angular en `../frontend/src/app/modules/<modulo>` (SOLO LECTURA) y el backend en `../backend/src`
   (SOLO LECTURA). Copy al usuario EXACTO al de Angular (español rioplatense), centralizado en
   `features/<modulo>/constants/copy.ts`.

## Estructura de un feature (ver `src/features/auth` y `src/features/dashboard` como ejemplo)

```
src/features/<modulo>/
  components/  hooks/  services/  helpers/  constants/  models/
  index.ts            # única puerta de entrada
src/app/(app)/<modulo>/**/page.tsx   # ~5 líneas: importa del feature y renderiza
```

- Las `page.tsx` con params: `export default async function Page({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <X id={id} />; }`. Query params en el cliente con `useSearchParams` (envolver en `<Suspense>` en la page).
- Componentes ≤200 líneas, funciones ≤50, ≤2 params posicionales, archivos ≤400. Un componente por archivo.
- Un feature NO importa de otro feature (ESLint lo bloquea). Si algo lo necesitan dos features → `src/shared/...` en **archivos nuevos** + export en el `index.ts` correspondiente.
- Lógica pura (cálculos, mapeos, filtros) en `helpers/` con tests unitarios. Llamadas HTTP en `services/`.
- Sin colores de paleta Tailwind ni hex: solo utilidades de tokens (`bg-surface`, `text-ink-muted`, `text-danger`, `bg-rama-manada-soft`…).
- Mobile-first: a 390px sin overflow horizontal, targets ≥44px, inputs ≥16px. Tablas → lista en mobile (`AppDataGrid` ya lo hace con `mobileRow`). Formularios: `FormActions` (barra fija abajo en mobile).
- Accesibilidad: el estado nunca solo por color (badges con ícono+texto, montos con signo), labels asociados, foco visible.
- Cada pantalla con `PageHeader` (título h1 + subtítulo + acciones; `backHref` en detalle/forms).

## Tests

- Unit (Vitest + Testing Library): helpers, hooks y componentes clave (mockeá `services/` con `vi.mock`). Fixtures de `@/shared/domain/testing/fixtures`.
- E2E (Playwright) en `e2e/<modulo>.spec.ts`: flujo principal contra el backend LOCAL. Usá `loginAsAdmin(page)` y `apiClientFor(tokens)` de `e2e/support/auth.ts`, `E2E_PREFIX` y `uniqueSuffix()` de `e2e/support/env.ts`. Todo dato creado lleva prefijo `"E2E "` y el spec lo borra al final (`test.afterAll` vía API). Selectores por rol/label. Corre en desktop y mobile (Pixel 7): no dependas de la sidebar (en mobile está en un drawer); navegá con `page.goto`.
- **No corras `pnpm dev`, `pnpm test:e2e` ni Playwright MCP** (el puerto 4201 lo usa el orquestador, que corre los e2e y la verificación visual después del merge). Sí corré `pnpm typecheck`, `pnpm lint`, `pnpm test` y `pnpm build`.

## Entrega

- NO edites `MIGRATION.md`, `REGISTRY.md` ni `REGISTRY-detail/*` (los actualiza el orquestador). En tu reporte final listá lo reutilizable que agregaste a `shared` (símbolo, ruta, uso en una línea).
- Al terminar: `pnpm typecheck && pnpm lint && pnpm test && pnpm build` en verde y **un commit** en tu rama: `feat(<modulo>): migrar <modulo> a React` (header ≤100 caracteres; cuerpo breve; última línea `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`). El pre-commit corre typecheck+lint.
- Reporte final (≤60 líneas): rama y hash del commit, rutas implementadas, checklist de paridad con lo que quedó fuera y por qué (desvíos/rarezas), agregados a shared, salida de los 4 comandos (conteos), y cualquier bloqueo que requiera backend o decisión de negocio (NO inventes reglas: anotalo).
