# MIGRATION.md — Angular → React (Next.js 16 + ReUI)

> **Fuente de verdad del avance.** `/goal` trabaja tachando ítems de acá. Si la sesión se corta,
> la próxima retoma leyendo este archivo + `git log`. Reglas en `CLAUDE.md`.
>
> Referencia funcional: `../frontend` (Angular, solo lectura). API: `../backend` (solo lectura).

## Cómo trabajar este archivo

1. Tomar el **primer módulo no tachado** en orden (las fases dependen de las anteriores).
2. **Antes de codear el módulo:** leer el Angular del módulo completo y **expandir su checklist de
   paridad** acá abajo (rutas, pantallas, acciones, diálogos, filtros, validaciones, reglas de
   negocio, endpoints). Commitear esa expansión (`docs(migration): paridad <modulo>`).
3. Implementar siguiendo `CLAUDE.md §9`. Tachar cada ítem **solo** cuando está verificado.
4. Cerrar el módulo con su commit. Anotar en **Bitácora** una línea (fecha, módulo, hash, notas).
5. Bloqueos (algo requiere backend, ambigüedad de negocio) → **§Bloqueos** y pasar al siguiente
   ítem posible. No inventar reglas.

---

## Fase 0 — Cimientos (hecha en sesión interactiva, antes del /goal)

- [x] Proyecto Next.js 16 + pnpm + TS strict + Tailwind 4, `pnpm dev` en puerto 4201
- [x] `components.json` de ReUI (style `base-nova`, aliases a `@/shared/...`) + MCP `reui` operativo
- [x] ESLint: `no-explicit-any`, `feature-boundaries`, `no-new-date` (copiados de mi-tienda)
- [x] Prettier + husky + lint-staged (typecheck + lint en pre-commit) + commitlint
- [x] Vitest + Testing Library + Playwright configurados (un test trivial de cada uno en verde)
- [x] `docs/DESIGN.md` + tokens en `globals.css` (light/dark, ramas) + `reui-bridge.css` — **aprobado por el usuario** (eligió «insignia», commit 625da2d)
- [x] Mockups aprobados de 3 pantallas clave (dashboard, persona-dashboard, evento-detalle) — `design-directions/insignia/screens/`, aprobados con la elección de la dirección
- [x] `CLAUDE.md`, `REGISTRY.md`, `REGISTRY-detail/`, `.claude/settings.json` (permisos pnpm + hook de formato)

## Fase 1 — Plataforma compartida

- [x] `shared/time` (now, today BsAs, formatos de fecha que hoy usa `dateFormat`)
- [x] `shared/domain`: enums y tipos portados de `frontend/src/app/shared/{enums,models,constants}` + schemas zod
- [x] `shared/api`: client fetch (base URL por env), `ApiError` + extracción de `message` NestJS, `PaginatedResponse`
- [x] Retry con backoff (reglas de `retry.interceptor.ts`) + opt-out de error global
- [x] Keep-alive 14 min
- [x] Cache en memoria TTL 5 min / LRU 100
- [x] `shared/auth`: token storage, decode JWT, refresh con cola, logout, `useSession`, guard con `redirectUrl`
- [x] Notificaciones (toast) + `ConfirmDialog` (ReUI)
- [x] Formatos: dinero ARS, humanize, status config (equivalentes de las pipes)
- [x] Kit de forms: `useFieldValidation` + campos (texto, número, fecha, fecha-hora, hora, email, teléfono con máscara, password, select, textarea, checkbox, días, time-picker) — ReUI primero
- [x] Validadores portados (bonificación, comprobante, fechas campamento, reembolso, positivo, rama, safe-text, saldo suficiente)
- [x] Filtros genéricos (equivalente a `generic-filters` + `chips-filter`) — ReUI primero
- [x] DataGrid (ReUI) con paginación, orden, vacío y loading
- [x] Gráficos (recharts): barra y donut; KPI/stat cards
- [x] Empty state, loading, not-found
- [x] AppShell en `src/app/(app)/layout.tsx` (monta `useSessionBootstrap()` + `useRequireSession()`, ver docs/HALLAZGOS.md): sidebar colapsable, header con título/subtítulo por ruta, menú de identidad, toggle de tema, nav mobile

## Fase 2 — Módulos (en este orden)

Cada módulo: expandir paridad (detalle en `docs/paridad/*.md`) → implementar → tests → e2e → verificación visual → commit.

### auth
- [x] Paridad expandida
  - `/login` (público, sin shell): si ya hay sesión válida → `/dashboard` (`noAuthGuard`).
  - Form: email (requerido + formato) y password (requerido, mín. 6); submit inválido marca todo.
  - Éxito → `redirectUrl` de `sessionStorage` (default `/dashboard`) y se consume.
  - Error → alerta inline: 401 = "Credenciales inválidas. Verifique su email y contraseña."; si no,
    `message` de NestJS; fallback "Error al iniciar sesión. Por favor, intente nuevamente.". El toast
    global también aparece (el login no tiene `SKIP_GLOBAL_ERROR` en Angular).
  - Botón con estado "Ingresando..." deshabilitado mientras carga.
  - Cambio de email y de password viven en `/configuracion` (card "Mi Perfil"): nombre + tipo de
    solo lectura; email: nuevo email (requerido + formato, precargado con el actual) + contraseña
    actual (requerida, mín. 8) → toast "Email actualizado exitosamente" y limpia la contraseña;
    password: actual (mín. 8), nueva (mín. 8), confirmar (requerida, "Las contraseñas no
    coinciden") → toast "Contraseña actualizada. Por favor inicia sesión nuevamente." y la sesión
    se invalida (login forzado). Errores: toast con `message` del backend.
  - Desvío: el link "¿Olvidaste tu contraseña?" de Angular es `href="#"` sin función → no se migra.
  - e2e: no se automatiza el cambio real de email/contraseña (rompería las credenciales E2E de la
    DB compartida); queda cubierto por unit tests con la sesión mockeada.
- [x] Login · cambio de email · cambio de password (invalida sesiones)
- [x] Módulo cerrado (DoD §9) — code review aplicado en `a75c793`

### dashboard
- [x] Paridad expandida
  - Datos: `GET cajas/consolidado` (vía estado de cajas), `GET eventos`, `GET movimientos/recientes`;
    los errores de eventos/recientes se tragan a lista vacía (paridad: `catchError(() => of([]))`).
  - 6 KPIs (en este orden): Caja de Grupo (`cajaGrupo.saldo`), Fondos de Rama (suma de las 4
    ramas de `fondosRama.detalle`), Cuentas Personales (`cuentasPersonales.total`), Reembolsos
    Pendientes (`reembolsosPendientes.total`), Cobros Pendientes (`cobrosPendientes.total`), Fondo
    Solidario (`fondoSolidario.saldo`). Sin consolidado → 0.
  - Acciones rápidas: Registrar Inscripción → `/inscripciones/crear`, Crear Evento →
    `/eventos/crear`, Registrar Gasto → `/movimientos/nuevo`, Deudores → `/reportes/deudas`.
  - Próximos eventos: fecha ≥ hoy, orden ascendente, máx. 3, con categoría Venta/Grupo; click →
    `/eventos/:id`; "Ver todos" → `/eventos`; vacío "No hay eventos próximos".
  - Movimientos recientes: máx. 5; ícono ingreso/egreso; texto `humanize(descripcion ?? concepto)`;
    detalle "responsable (o 'Sistema') • dd/MM/yyyy"; monto con signo (egreso negativo);
    "Ver más" → `/movimientos`; vacío "No hay movimientos recientes".
  - Fondos por rama: una fila por rama presente (Manada, Unidad, Caminantes, Rovers) con saldo;
    vacío "No hay fondos de rama configurados".
  - Desvío visual: los 6 KPIs van en una tira de métricas (DESIGN §KPI) en vez de 6 stat-cards.
- [x] Módulo cerrado (DoD §9)

### personas
- [ ] Paridad expandida
- [ ] Dashboard de personas · protagonistas/educadores crear/editar/detalle · externas crear/detalle/editar
- [ ] Persona-dashboard (cuenta, obligaciones, documentación, timeline) · habilitar/deshabilitar
- [ ] Módulo cerrado (DoD §9)

### cajas
- [ ] Paridad expandida
- [ ] Tabs caja grupo · fondos de rama · cuentas personales · fondo solidario · movimiento rápido
- [ ] Módulo cerrado (DoD §9)

### movimientos
- [ ] Paridad expandida
- [ ] Lista paginada con filtros · nuevo · editar · transferencias · selector de concepto
- [ ] Módulo cerrado (DoD §9)

### inscripciones
- [ ] Paridad expandida
- [ ] Lista · dashboard · crear · detalle · editar · pago · bonificaciones · borrar pagos · config de montos (localStorage)
- [ ] Módulo cerrado (DoD §9)

### campamentos
- [ ] Paridad expandida
- [ ] Lista · crear · detalle · editar · participantes · pagos · gastos · bonificaciones
- [ ] Módulo cerrado (DoD §9)

### eventos
- [ ] Paridad expandida
- [ ] Lista · crear · detalle · editar · productos · ventas en lote · entregas · gastos/ingresos · resumen financiero
- [ ] Módulo cerrado (DoD §9)

### event-report (público)
- [ ] Paridad expandida (las ~16 secciones)
- [ ] Con sesión / anónimo público / anónimo no público (404 → "no disponible")
- [ ] Módulo cerrado (DoD §9)

### reportes
- [x] Paridad expandida (hoy oculto en el sidebar: mantenerlo oculto)
  - `/reportes` → `/reportes/deudas`. Filtros rama (+ Educadores) / año (actual→2020) / tipo, cada
    cambio consulta `GET reportes/deudas`. KPIs: personas, deuda total, con docs faltantes.
  - Filas expandibles de a una: chips por deuda monetaria (saldo > 0, orden año+etiqueta) + "N docs";
    detalle con deudas monetarias, autorizaciones de campamento faltantes y documentación
    (personal + por inscripción). Nombre → ficha según tipo ("Ver ficha de …").
  - Error inline "Error al cargar el reporte…" + Reintentar (sin toast global); vacío "No hay deudas
    pendientes con los filtros seleccionados".
  - Reembolsos / caja / eventos / comprobantes son placeholders en Angular (título + texto): igual.
- [x] Deudas · reembolsos · caja · eventos · comprobantes
- [x] Módulo cerrado (DoD §9)

### configuracion
- [x] Paridad expandida (`docs/paridad/campamentos-reportes-configuracion.md` §configuracion)
  - Desvío: descarga con nombre de fallback (`scout-export.xlsx` / `scout-backup.sql.gz`) porque el
    backend no expone `Content-Disposition` por CORS (Angular terminaba igual); los errores de
    descarga se muestran una sola vez (Angular duplicaba el toast global).
- [x] Configuración · descarga de backups (blob)
- [x] Módulo cerrado (DoD §9)

## Fase 3 — Cierre

- [ ] Recorrido completo de paridad: cada ruta de `frontend/src/app/app.routes.ts` existe y funciona en React
- [ ] Suite e2e completa en verde contra backend local
- [ ] Auditoría visual final (skill `impeccable` audit / `web-design-guidelines`) y fixes
- [ ] Lighthouse/a11y de dashboard y una pantalla de lista sin errores críticos
- [ ] `vercel.json`/config de deploy preparada (sin desplegar) + `README.md`
- [ ] Reporte final en `docs/MIGRATION-REPORT.md` (qué se hizo, desvíos, bloqueos, deuda)

---

## Bloqueos

_(vacío)_

## Bitácora

| Fecha | Módulo | Commit | Notas |
| --- | --- | --- | --- |
| 2026-10-06 | Fase 0 + Fase 1 (no visual) | 44ae287 | Scaffold, 3 direcciones estéticas, plataforma shared con 420 tests; review aplicada salvo #4/#5 (decisión del usuario) |
| 2026-10-06 | Fase 1 (visual) | e043800 | ReUI vendorizado (TanStack v9), tema, toasts, confirm, forms, DataGrid, filtros, gráficos, feedback, AppShell; paridad relevada en docs/paridad/ |
| 2026-10-06 | auth | 1743cb5 | Login + perfil (email/password); review de plataforma+auth aplicado en a75c793 |
| 2026-10-06 | dashboard | e21243a | KPIs en tira de métricas, eventos próximos, movimientos recientes, fondos por rama |
| 2026-10-06 | configuracion | 913c7f3 | Montos de inscripción en localStorage (misma clave), descargas con nombre de fallback |
| 2026-10-06 | reportes | feat(reportes) | Deudas con filtros/expandibles + 4 placeholders; sigue oculto en el sidebar |
