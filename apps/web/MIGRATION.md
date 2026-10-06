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
- [ ] `docs/DESIGN.md` + tokens en `globals.css` (light/dark, ramas) + `reui-bridge.css` — **aprobado por el usuario**
- [ ] Mockups aprobados de 3 pantallas clave (dashboard, persona-dashboard, evento-detalle)
- [x] `CLAUDE.md`, `REGISTRY.md`, `REGISTRY-detail/`, `.claude/settings.json` (permisos pnpm + hook de formato)

## Fase 1 — Plataforma compartida

- [ ] `shared/time` (now, today BsAs, formatos de fecha que hoy usa `dateFormat`)
- [ ] `shared/domain`: enums y tipos portados de `frontend/src/app/shared/{enums,models,constants}` + schemas zod
- [ ] `shared/api`: client fetch (base URL por env), `ApiError` + extracción de `message` NestJS, `PaginatedResponse`
- [ ] Retry con backoff (reglas de `retry.interceptor.ts`) + opt-out de error global
- [ ] Keep-alive 14 min
- [ ] Cache en memoria TTL 5 min / LRU 100
- [ ] `shared/auth`: token storage, decode JWT, refresh con cola, logout, `useSession`, guard con `redirectUrl`
- [ ] Notificaciones (toast) + `ConfirmDialog` (ReUI)
- [ ] Formatos: dinero ARS, humanize, status config (equivalentes de las pipes)
- [ ] Kit de forms: `useFieldValidation` + campos (texto, número, fecha, fecha-hora, hora, email, teléfono con máscara, password, select, textarea, checkbox, días, time-picker) — ReUI primero
- [ ] Validadores portados (bonificación, comprobante, fechas campamento, reembolso, positivo, rama, safe-text, saldo suficiente)
- [ ] Filtros genéricos (equivalente a `generic-filters` + `chips-filter`) — ReUI primero
- [ ] DataGrid (ReUI) con paginación, orden, vacío y loading
- [ ] Gráficos (recharts): barra y donut; KPI/stat cards
- [ ] Empty state, loading, not-found
- [ ] AppShell: sidebar colapsable, header con título/subtítulo por ruta, menú de identidad, toggle de tema, nav mobile

## Fase 2 — Módulos (en este orden)

Cada módulo: expandir paridad → implementar → tests → e2e → verificación visual → commit.

### auth
- [ ] Paridad expandida
- [ ] Login · cambio de email · cambio de password (invalida sesiones)
- [ ] Módulo cerrado (DoD §9)

### dashboard
- [ ] Paridad expandida
- [ ] Módulo cerrado (DoD §9)

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
- [ ] Paridad expandida (hoy oculto en el sidebar: mantenerlo oculto)
- [ ] Deudas · reembolsos · caja · eventos · comprobantes
- [ ] Módulo cerrado (DoD §9)

### configuracion
- [ ] Paridad expandida
- [ ] Configuración · descarga de backups (blob)
- [ ] Módulo cerrado (DoD §9)

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
