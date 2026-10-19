# Reporte final — migración Angular → React

> Fecha: 2026-10-06 · Rama: `main` · Estado detallado y bitácora: [`MIGRATION.md`](../MIGRATION.md)

## Resumen

El frontend Angular 21 (`../frontend`) se migró a **Next.js 16 + React 19 + ReUI**, con paridad
funcional y el rediseño visual aprobado (dirección «insignia», `docs/DESIGN.md`). Los 11 módulos
están cerrados según la Definition of Done de `CLAUDE.md §9`. No se tocaron `../frontend` ni
`../backend`.

| Verificación (sobre `main`)                         | Resultado                                                                                         |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `pnpm typecheck` · `pnpm lint`                      | 0 errores · 0 problemas                                                                           |
| `pnpm test` (Vitest)                                | 87 archivos, 826 tests en verde                                                                   |
| `pnpm build` (Turbopack)                            | Verde, 42 rutas                                                                                   |
| `pnpm test:e2e` (Playwright, backend local)         | 40/40: 20 flujos × desktop y Pixel 7, 12 specs                                                    |
| Verificación visual                                 | 24 pantallas × 390/1440 × light/dark (96 capturas): sin overflow-x ni errores de consola o de red |
| Accesibilidad (axe-core, wcag2a/aa + best-practice) | login, dashboard, movimientos y personas, 390/1440, light/dark: 0 violaciones                     |

## Qué se hizo

- **Fase 0, cimientos.**
  - Scaffold con pnpm y TS strict.
  - Reglas de mi-tienda en ESLint: `no-explicit-any`, `feature-boundaries`, `no-new-date` y los
    límites de tamaño.
  - husky, lint-staged y commitlint.
  - Tokens de diseño (light/dark y ramas) y el puente con ReUI.
- **Fase 1, plataforma compartida (`src/shared`).**
  - `time`: zona America/Argentina/Buenos_Aires.
  - `domain`: schemas zod que normalizan los decimales y fechas del backend.
  - `api`:
    - retry con backoff;
    - opt-out del error global;
    - keep-alive;
    - cache con TTL de 5 min y máximo de 100 entradas.
  - `auth`: refresh con cola y guard con `redirectUrl`.
  - Toasts, confirm, kit de forms, DataGrid, filtros, gráficos (recharts) y AppShell.
  - El catálogo de lo reutilizable está en `REGISTRY.md`.
- **Fase 2, módulos.**
  - auth, dashboard, configuración y reportes.
  - personas, cajas, movimientos, inscripciones, campamentos, eventos y el reporte público de
    eventos.
  - Cada módulo tiene su checklist de paridad en `docs/paridad/`, tests unitarios y un e2e del
    flujo principal.
- **Fase 3, cierre.**
  - Recorrido de rutas contra `app.routes.ts`.
  - Suite e2e completa.
  - Auditoría visual y de accesibilidad con sus fixes.
  - `vercel.json` y `README.md`.
  - Este reporte.

## Desvíos respecto de Angular (intencionales)

- **Bugs de Angular que no se replicaron:**
  - El filtro por fechas de movimientos y fondos de rama ahora incluye el día final completo
    (`dayFilterBounds`). Angular mandaba la medianoche y ese día quedaba afuera.
  - Las requests no quedan colgadas si falla el refresh.
  - Los errores de descarga de configuración no se muestran duplicados.
- **Validaciones alineadas con los DTO del backend:**
  - Contraseña de educador: mínimo 8 (Angular pedía 6 y el alta daba 400).
  - Año de inscripción: mínimo 2020.
  - El saldo personal del alta de inscripción no puede superar el disponible.
- **Campamentos:**
  - "Eliminar" del detalle borra de verdad.
  - "Editar pago" pasa a ser "Eliminar pago", porque el endpoint de edición no existe.
  - El filtro "Educadores" se aplica en el cliente.
  - Los errores de los diálogos se muestran adentro del diálogo.
- **Rutas:** las rutas sin hijo de personas redirigen a `/personas` (en Angular daban NotFound). El
  link "¿Olvidaste tu contraseña?" (`href="#"`) no se migró.
- **Visuales** (dentro de `docs/DESIGN.md`):
  - Los KPIs del dashboard van en una tira de métricas.
  - Encabezados y labels en sentence case.

## Rarezas que se mantuvieron por paridad (cambiarlas es decisión de negocio)

- `positiveNumber` deja pasar el 0 y `safeText` rechaza apóstrofes ("O'Connor").
- Al editar un movimiento no se puede vaciar la descripción, porque el DTO no acepta string vacío.
- Si falla el ping de keep-alive, aparece un toast aunque el usuario esté inactivo. Se cambia con
  `skipGlobalError` en `use-keep-alive.ts`.
- El cache "LRU" desaloja por orden de inserción, igual que en Angular.

## Bloqueos y decisiones pendientes

El detalle está en [`MIGRATION.md §Bloqueos`](../MIGRATION.md#bloqueos). En resumen:

1. **Editar un pago de campamento:** hace falta el endpoint `PATCH /campamentos/:id/pagos/:movimientoId`, o decidir que no se necesita.
2. **Filtro "Educadores" en campamentos:** confirmar el filtrado en el cliente o sumar `educador`
   al query `rama` del backend.
3. **"Eliminar" campamento desde el detalle:** confirmar con producto que debe borrar.
4. **Selector "Agregar participante" con filtros activos:** devuelve un 400 "ya inscrita" adentro
   del diálogo, igual que en Angular.

## Problemas del backend detectados (no se tocó `../backend`)

- **`POST /inscripciones/:id/pagar` devuelve el `montoPagado` previo al pago.** El front recarga el
  detalle después de cada mutación, como el `reloadDetail` de Angular.
- **`Educador.cargo` se declara no-nullable, pero hay filas con `null`.** La causa es la herencia de
  tabla única, y el front lo tolera.
- **Otros comportamientos a tener en cuenta:**
  - `?soloActivos=false` se interpreta como `true`.
  - `auth/logout` sin `refreshToken` responde 400.
  - "Educadores" tiene 3 grafías distintas según el endpoint.
  - `POST /personas/educadores` devuelve `passwordHash`; zod lo descarta.
- **La deuda de campamento se calcula de 3 formas distintas** según la pantalla. Ver
  `docs/HALLAZGOS.md`.

## Deuda técnica y próximos pasos

- **Performance con Lighthouse:** no se midió. Hace falta el build de producción servido, así que
  queda para el primer deploy. La accesibilidad sí se auditó con axe, que es el mismo motor que usa
  Lighthouse.
- **Deploy:**
  - Definir `API_URL` en Vercel.
  - Apuntar el `FRONTEND_URL` (CORS) del backend al dominio nuevo.
  - Como `localStorage` es por origin, con el dominio nuevo los usuarios inician sesión de nuevo y
    recargan los montos de inscripción.
- **Reporte público con tokens vencidos:** si falla el refresh, el visitante termina en `/login`, igual
  que en Angular. Se podría volver al endpoint público ante un 401.
- **Indicador de scroll en tabs:** en mobile, la tira de tabs de cajas se desplaza en horizontal
  sin indicador más allá del recorte.
- **e2e sobre la DB compartida:** los specs crean datos con el prefijo `E2E ` y los borran al
  terminar. No se automatiza el cambio real de email o contraseña, para no romper las credenciales
  de e2e.
