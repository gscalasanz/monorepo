# Reporte de la consolidación — Scout monorepo

**Fecha:** 2026-10-20 · **Repo:** `Desktop/scout-monorepo` (local, **sin remoto, sin push**)
**Bitácora y evidencia completa:** [`MONOREPO.md`](../MONOREPO.md)

Scout pasó de dos repos (`scout-back` NestJS/npm y `scout-front-react` Next/pnpm) a **un
monorepo pnpm + Turborepo**, con el historial de los dos adentro, el vocabulario de dominio
definido una sola vez y gates de calidad que hoy están en verde. **No cambió ningún comportamiento**:
mismas rutas, payloads, códigos, CORS, puertos, esquema de DB y UI. La única excepción son 5 bugs de
zona horaria del api (§3), cada uno con un test que falló primero.

Los repos originales (`scout/backend`, `scout/frontend`, `frontend-deprecated`) y `mi-tienda`
**no se tocaron**. Producción sigue saliendo de los repos viejos.

---

## 1. Qué hay ahora

```
apps/api        @scout/api   NestJS 11 (historial de scout-back, 175 commits)
apps/web        @scout/web   Next 16   (historial de scout-front-react, 110 commits)
packages/shared @scout/shared  enums de dominio (./enums) + fechas (./time), CJS
packages/config @scout/config  tsconfig base/nextjs/nestjs + eslint (fronteras, no-new-date)
docs/           principios, flujo-confiable, estructuras, adr/, producto/, deploy.md
CLAUDE.md · REGISTRY.md (+ REGISTRY-detail/) · MONOREPO.md · .github/ · .husky/
```

| Fase | Resultado |
| --- | --- |
| 0 Baseline | Medido en clones (tabla abajo) + snapshot de los 25 valores de wire |
| 1 Git | `filter-repo` a `apps/api` y `apps/web`. `git log --follow` y `blame` funcionan |
| 2 Workspace | pnpm 10.33 + turbo 2; scripts uniformes; `.nvmrc` 24.19; puertos 4201/3001 intactos |
| 3 `@scout/config` | Presets compartidos; config efectiva de tsconfig/eslint idéntica; dist del api byte-idéntico |
| 4 `@scout/shared` | 20 enums duplicados → 1 definición (ADR 0001). Contrato de wire 25/25. OpenAPI byte-idéntico. `BSAS_TIME_ZONE` única |
| 5 Gobierno | `CLAUDE.md` hub + por app, REGISTRY, docs adaptados al stack real, `setup-worktree.sh`, `.claude/` |
| 6 Gates | husky + lint-staged + commitlint, CI (quality + security), dependabot, lint del api en 0 (ADR 0003), audit con ADR 0002 |
| 7 Deploy | [`docs/deploy.md`](./deploy.md) (Vercel, Render, checklist, cutover). **No ejecutado** |
| 8 Fechas | 28 usos de `new Date()`/`Date.now()` del api → `@scout/shared/time`. `no-new-date` en `error` |

### Antes / después

| | Baseline (repos originales) | Monorepo |
| --- | --- | --- |
| api build | ✓ `dist/src/main.js` | ✓ mismo entrypoint |
| api tests | 34 suites / 593 | 37 suites / **622** (+29 de caracterización y de bugs TZ) |
| api lint | ✗ 462 errores, 94 warnings | ✓ **0 errores, 0 warnings** (ADR 0003) |
| web typecheck / build | ✓ / ✓ | ✓ / ✓ |
| web lint | ✗ 1 error (`segmented-tabs`) | ✓ (hook extraído, sin cambio de UI) |
| web tests | 108 archivos / 1033 | 103 / 968 en web + **65 tests de `time` movidos** a `@scout/shared` (= 1033) |
| shared / config tests | — | 107 (incluye contrato de wire) / 22 (fronteras + no-new-date) |
| `turbo run typecheck lint test build` | — | 13/13 ✓; segunda corrida **FULL TURBO** (13/13 cached) |

ADRs: [0001 enums `as const`](./adr/0001-representacion-enums.md) ·
[0002 excepciones de `pnpm audit`](./adr/0002-excepciones-pnpm-audit.md) ·
[0003 lint del api en specs](./adr/0003-lint-del-api-en-specs.md).

---

## 2. Condición de cumplido (corrida final, 2026-10-20)

| # | Chequeo | Resultado |
| --- | --- | --- |
| 1 | `git status` | limpio (0 líneas) |
| 2 | Commits | total 346+; `-- apps/api` 204 (≥175), `-- apps/web` 125 (≥110) |
| 3 | Install limpio | `rm -rf node_modules… && pnpm install --frozen-lockfile` ✓; 0 `package-lock.json`/`yarn.lock` versionados |
| 4 | Pipeline | `pnpm turbo run typecheck lint test build` 13/13 ✓; tests ≥ baseline (ver tabla) |
| 5 | Cache | segunda corrida `13 cached, 13 total` → **FULL TURBO** |
| 6 | Enums | definiciones solo en `packages/shared/src/enums`; contrato 25/25 (`apps/api/docs/types.ts`, que era una copia vieja y desactualizada, ahora re-exporta) |
| 6b | Fronteras | `@scout/config` 22/22 (monorepo, features, no-new-date en web/api/packages) |
| 8 | Fechas | `grep "new Date(\|Date.now(" apps/api/src` sin specs ni migraciones → **0**; ESLint `no-new-date` en `error` sin hits |
| 7 | `migration:generate` | **Genera un archivo** (borrado, nunca ejecutado) con el **mismo SQL que el backend original**: es un drift previo de 64 sentencias. Ver §4 |
| 10 | Smoke local | Puertos 3101/4301, porque 3001/4201 los ocupan tus servers de dev, que no se tocaron. `GET /api/v1` → `Hello World!` (igual que el original en :3001); `/personas` sin token → 401; OpenAPI **idéntico**; CORS de `localhost:4201` OK; web `/login` → 200. Antes de levantar el api: `migration:show` 15/15 aplicadas, 0 pendientes |
| 10b | e2e de web | **No corrido**: las credenciales están en `.env.local` (no se lee) y el e2e pega contra el api y la base de dev. Correlo vos: `pnpm --filter @scout/web test:e2e` |
| 9 | Docs | `CLAUDE.md`, `apps/*/CLAUDE.md`, `REGISTRY*`, `docs/*`, ADRs, `deploy.md`, este reporte |
| 11 | `MONOREPO.md` | sin `- [ ]`, salvo los ítems de §Bloqueos |

---

## 3. Cambios de comportamiento (solo Fase 8, en palabras de usuario)

Render corre en UTC. Entre las 21:00 y las 23:59 de Argentina, el api creía que ya era "mañana".

1. **Dashboard de persona, la noche del 31/12:** desde las 21:00 tomaba el año siguiente como
   "año actual". Ahora usa el año de Argentina.
2. **Campamentos que empiezan el 1/1 (dashboard y reporte de deudas):** con el proceso en
   hora argentina (dev local) se agrupaban en el año anterior y desaparecían del filtro de su año.
   Ahora el año sale de la fecha del campamento, sin pasar por la zona horaria.
3. **Nombre del Excel exportado y del backup:** mostraba la hora UTC (+3 h, y de noche la fecha del
   día siguiente). Ahora muestra la fecha y hora de Argentina (`scout-export-20261231-233000.xlsx`).

El detalle (sitio, test rojo y commit) está en `MONOREPO.md` §Cambios de comportamiento.

---

## 4. Decisiones que te tocan (§Bloqueos)

1. **`next` 16.3.5 → ≥16.3.8 (recomendado: primero de todo).** Tiene un advisory critical (RCE en
   `next/og`) y uno high (SSRF en Image Optimization). La app no usa `next/og` ni imágenes
   remotas y producción tiene la misma versión hoy. No lo subí por la regla de cero cambios. El
   gate los ignora con ADR 0002; al subirlo, sacalos de `ignoreGhsas`.
2. **Drift entidades ↔ esquema** (64 sentencias, preexistente). Viene de FKs, índices y enums
   creados a mano con nombres distintos a los que deriva TypeORM. Opciones: (a) alinear los nombres
   en las entidades (solo código, sin migración); (b) aceptarlo. Mientras exista,
   `migration:generate` no sirve como detector.
3. **Fechas calendario que viajan como instante** (gastos de campamento, entregas): web manda
   `YYYY-MM-DD`, el api guarda la medianoche UTC y web lo compensa. Se conservó así. Pasarlo a
   columnas `date` es cambio de esquema y de contrato.

Deuda menor (lista completa en `MONOREPO.md` §Deuda): 45 errores de tipos en specs del api
(`typecheck` cubre solo la superficie de build), `railway*.json` sin uso, `POST
/campamentos/:id/gastos` sin validar `fecha` (500 en vez de 400), resolución de alias en
`feature-boundaries` de web, `@nestjs/swagger` 11.4 agrega `"type":"object"` en 2 schemas (solo
doc), tres spellings del filtro de educadores en el wire.

---

## 5. Pasos para vos

1. **Revisar y elegir remoto** (`docs/deploy.md` §4). Recomendado: reusar `MartinOfi/scout-back`.
   Pushear a una rama nueva y abrir PR. **No hice ningún push.**
2. **Ver el CI en el PR.** Primera corrida real de `ci.yml` (quality + security).
3. **Cutover de Render y después de Vercel**, siguiendo `docs/deploy.md`. Ojo con
   `apps/web/vercel.json`: el `buildCommand` cambia **el día del cutover**.
4. **Checklist `curl`** de `docs/deploy.md` §3 y prueba manual (login, dashboard, export).
5. **Archivar** `scout-front-react` y `gscalasanz/front` (este último es de otra cuenta:
   acordalo con su dueño) cuando web esté verificado.
6. **Ramas que quedaron afuera** (`MONOREPO.md` §Pendientes del usuario): 6 del back y 3 del
   front + 8 `worktree-agent-*`, más worktrees en `scout-deudas-nav/` y `.claude/worktrees/`.
   Migralas o descartalas antes de archivar.
7. **Bump de `next`** (§4.1).
8. **Opcional: `Co-Authored-By` en 6 commits del monorepo** (`0229a4f`, `2fa8fd6`, `4cbf312`,
   `c4cf28f`, `891a819`, `5f18908`). Se colaron contra tu regla de atribución desactivada. Los
   commits importados de los repos originales ya traían sus propios trailers y no se tocaron.
   Para limpiarlos **antes del primer push** (reescribe hashes, y los citados en `MONOREPO.md`
   quedan desfasados):
   ```bash
   git filter-repo --force --commit-callback '
   if commit.original_id.decode()[:7] in {"0229a4f","2fa8fd6","4cbf312","c4cf28f","891a819","5f18908"}:
       commit.message = b"\n".join(l for l in commit.message.split(b"\n") if not l.startswith(b"Co-Authored-By: Claude"))
   '
   ```
9. **Entorno:** el Escritorio parece sincronizado con iCloud. Durante el trabajo hubo load
   average de 20–100 y timeouts espurios de tests. Mové el repo fuera de `~/Desktop` o excluilo
   de iCloud. Después corré `pnpm install` y `pnpm setup:worktree` en cada worktree nuevo.
