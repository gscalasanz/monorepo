# Deploy — Scout monorepo

> **Estado:** el monorepo vive en `gscalasanz/monorepo` y se deploya como **un proyecto de
> Vercel con dos servicios** (`api` + `web`, `vercel.json` de la raíz). Los repos viejos
> (`MartinOfi/scout-back` → Render, `MartinOfi/scout-front-react` → Vercel) siguen como estaban
> y son el rollback hasta verificar el nuevo deploy.

## 0. Antes de empezar

- [ ] `main` del monorepo en verde en CI (`quality` + `security`).
- [ ] Proyecto de Vercel conectado a `gscalasanz/monorepo` con **Root Directory vacío** (raíz del
      repo): el `vercel.json` de la raíz define los servicios.
- [ ] Variables de entorno del api cargadas en Vercel (§2) **antes** del primer deploy: sin
      `DATABASE_URL` el api no arranca.

---

## 1. Un proyecto, dos servicios (Vercel Services)

`vercel.json` (raíz) declara dos servicios en el **mismo dominio**:

| Servicio | Root | Framework | Público en | Build |
| --- | --- | --- | --- | --- |
| `api` | `.` (contexto de la imagen) | contenedor (`apps/api/Dockerfile.vercel`) | `/api/*` (incluye `/api/v1/*` y Swagger en `/api/docs`) | `docker build`: `pnpm install` + `turbo build` + `pnpm deploy --prod`; corre `node dist/src/main.js` en el puerto 80 |
| `web` | `apps/web` | `nextjs` | todo lo demás (`/(.*)`) | `cd ../.. && pnpm turbo run build --filter=@scout/web` |

- **Por qué el api va en contenedor:** como función Node (`framework: nestjs`) Vercel traza los
  archivos a incluir y con el layout de pnpm (symlinks a `node_modules/.pnpm`) se pierde
  dependencias (`Cannot find module '@nestjs/core'`); además empaqueta a `.cjs` y los globs de
  TypeORM (`*.entity{.ts,.js}`, `migrations/*`) dejan de encontrar archivos. El contenedor
  corre **exactamente** lo mismo que Render: `dist/` compilado + `node_modules` de producción
  reales (`pnpm deploy`). `.dockerignore` deja afuera todo `.env*`, `node_modules` y builds.
- web instala con `pnpm install --frozen-lockfile` y buildea con turbo (`@scout/shared` primero
  por `^build`).
- Vercel le pasa al servicio la **ruta original**: `GET /api/v1/personas` llega al api como
  `/api/v1/personas`, que es el prefijo global de Nest. No hubo que tocar rutas.
- **Sin bindings:** web llama al api **solo desde el navegador** (tokens en `localStorage`); el
  servidor de Next no le hace requests. Un binding solo sirve para llamadas server-side.
- Los headers de seguridad (`nosniff`, `DENY`, `Referrer-Policy`, `Permissions-Policy`) están en
  el servicio `web`, como antes en `apps/web/vercel.json` (que se eliminó: en modo services
  `framework`/`buildCommand`/`installCommand` no van a nivel raíz).
- Node: 24.x (`.nvmrc` = 24.19). pnpm: el de `packageManager`.

### Cómo encuentra web al api

`apps/web/next.config.ts` inlinea `API_URL` en build. En Vercel (`VERCEL=1`), si no se cargó
`API_URL`, usa **`/api/v1`**: el api del mismo deploy (producción y cada preview apuntan a su
propio api, sin configurar nada). Si alguna vez se carga `API_URL` en Vercel, esa gana. Fuera de
Vercel no hay default: sin `API_URL` el build falla rápido (`shared/api/env.ts`).

Como web y api comparten origen, el navegador no hace requests cross-origin: CORS
(`FRONTEND_URL`) deja de intervenir en producción. Se mantiene para dev (`localhost:4201`).

---

## 2. Variables de entorno (Vercel → Settings → Environment Variables)

Las mismas que tenía el servicio de Render, sin cambios: `DATABASE_URL` (en Neon, preferir la
URL **con pooling**: cada instancia de la función abre su pool), `JWT_*` y el resto. `PORT` no
hace falta (la imagen usa 80). `FRONTEND_URL` es opcional (mismo origen). `API_URL` **no** hace falta (§1).

> ⚠️ **Preview no debe escribir en la base de producción.** Cargá `DATABASE_URL` de producción
> solo en *Production* y una base aparte (o ninguna) en *Preview*.

### Riesgos a validar en el primer deploy (api como función serverless)

- **Migraciones:** `DatabaseModule` corre con `migrationsRun: true`. El contenedor escala a cero
  (5 min sin tráfico en producción, 30 s en preview), así que corre en **cada arranque en frío**,
  y con varias instancias puede correr en paralelo. Sin migraciones pendientes es un no-op; con
  una migración nueva, conviene correrla a mano antes del deploy.
- **Puerto:** Vercel le manda tráfico al **80** del contenedor; la imagen fija `PORT=80`. No
  cargar `PORT` en el proyecto.
- **Arranque en frío:** después de escalar a cero, el primer request espera el arranque de Nest
  + la conexión a la base (segundos).
- **Duración:** export a Excel y backup corren dentro del límite de duración de la función.
- **Keep-alive** de web (ping cada 14 min, pensado para Render free) ya no hace falta; no molesta.

Render sigue como estaba (no se tocó): hasta que el api en Vercel esté verificado, es el
rollback.

---

## 3. Checklist post-cutover (`curl`)

Con Vercel Services `$API` y `$WEB` son el mismo dominio del deploy.

```bash
# API viva y con el mismo bootstrap
curl -fsS "$API/api/v1"                                  # → Hello World!
curl -fsS -o /dev/null -w '%{http_code}\n' "$API/api/docs-json"   # → 200
# Ruta protegida sigue protegida (guard JWT global)
curl -s -o /dev/null -w '%{http_code}\n' "$API/api/v1/personas"   # → 401
# CORS (solo si web vive en otro dominio; con Services es mismo origen)
curl -s -o /dev/null -D - -X OPTIONS "$API/api/v1/auth/login" \
  -H "Origin: $WEB" -H 'Access-Control-Request-Method: POST' | grep -i access-control-allow-origin
# Web
curl -s -o /dev/null -w '%{http_code}\n' "$WEB/login"     # → 200
curl -sI "$WEB/login" | grep -iE 'x-frame-options|x-content-type-options'   # headers del servicio web
```

Y a mano: login con un usuario real, abrir dashboard, una caja, el reporte de deudas, y
exportar un Excel. Desde la Fase 8 el nombre del archivo muestra la hora de Argentina.

**Rollback:** en Render y Vercel, volver a conectar el repo viejo (o redeployar el último deploy
anterior desde el dashboard). Ninguna de las dos apps cambió esquema de DB ni contrato HTTP, así que
el rollback es inmediato.

---

## 4. Propuesta de cutover de remotos (no ejecutada)

Opciones, de menor a mayor fricción:

1. **Reusar `MartinOfi/scout-back` como repo del monorepo (recomendado).** Render ya está
   conectado a ese repo. Se pushea el monorepo a una rama nueva, se abre un PR contra `main`, y
   al mergear se cambia en Render el Build/Start Command y el Root Directory de §2. El historial
   del back ya está adentro (filter-repo a `apps/api/`), así que no se pierde nada. Conviene
   renombrar el repo a `scout`; GitHub redirige el nombre viejo.
2. **Repo nuevo `MartinOfi/scout`.** Más limpio, pero hay que reconectar Render **y** Vercel, y
   archivar los dos repos viejos.

En las dos opciones:

- `MartinOfi/scout-front-react` y `gscalasanz/front`: **archivar** (read-only) después de
  verificar el cutover de web. `gscalasanz/front` es de otra cuenta: avisarle al dueño y
  acordarlo con él.
- Las ramas sin mergear de los repos originales (MONOREPO.md §Pendientes del usuario) **no
  entraron** al monorepo. Se migran a mano (cherry-pick con `git filter-repo
  --to-subdirectory-filter` en un clon) o se descartan antes de archivar.
- Secrets de GitHub Actions: el CI del monorepo no necesita ninguno.
