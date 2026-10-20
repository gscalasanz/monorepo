# Deploy — Scout monorepo

> **Estado:** preparado, **no ejecutado**. Hoy producción sigue saliendo de los repos viejos
> (`MartinOfi/scout-back` → Render, `MartinOfi/scout-front-react` → Vercel). Este documento
> dice qué cambiar en cada plataforma **el día del cutover**. Hasta entonces no se toca
> ninguna configuración remota.

## 0. Antes de empezar

- [ ] `main` del monorepo en verde en CI (`quality` + `security`).
- [ ] Remoto del monorepo decidido y pusheado (ver §4). Sin eso no hay nada que conectar.
- [ ] Variables de entorno de producción a mano (se cargan en cada dashboard; **nunca** en el repo).
- [ ] Ventana tranquila: el cutover de cada app es independiente; conviene hacer primero el
      api (Render) y después web (Vercel).

---

## 1. Web → Vercel (`apps/web`, `@scout/web`)

### Configuración del proyecto (dashboard de Vercel → Settings)

| Campo | Valor |
| --- | --- |
| Git repository | el repo del monorepo (§4) |
| Root Directory | `apps/web` |
| "Include files outside the Root Directory" | **activado** (necesita `packages/*` y el lockfile de la raíz) |
| Framework | Next.js |
| Node.js version | 24.x (`.nvmrc` = 24.19) |
| Install Command | lo toma de `apps/web/vercel.json`: `pnpm install --frozen-lockfile` (pnpm instala el workspace entero desde la raíz) |
| Build Command | lo toma de `apps/web/vercel.json` (ver abajo) |
| Output | por defecto (`.next` dentro de `apps/web`) |
| Ignored Build Step | `npx turbo-ignore @scout/web` (no redeploya si el commit no toca web ni sus dependencias de workspace) |

**Cambio de repo necesario:** `apps/web/vercel.json` hoy dice `"buildCommand": "pnpm build"`.
Eso corre solo `next build` y **falla** en el monorepo, porque `@scout/shared` se consume
compilado (`dist/`) y nadie lo buildea antes. Al cutover tiene que quedar así:

```json
"buildCommand": "cd ../.. && pnpm turbo run build --filter=@scout/web"
```

(turbo buildea `@scout/shared` primero por `^build`). Este cambio se commitea **el mismo día**
del cutover, no antes: el `vercel.json` de `scout-front-react` sigue siendo el que deploya.

### Variables de entorno (Production y Preview)

| Variable | Notas |
| --- | --- |
| `API_URL` | URL pública del api de Render, con `/api/v1`. Se **inlinea en build** (`next.config.ts` → `env`), así que cambiarla exige redeploy. turbo la incluye en el hash de cache (`turbo.json` → `build.env`). |
| `NEXT_PUBLIC_*` | Las que tenga hoy el proyecto, mismas que en `scout-front-react`. |

Nunca apuntar Preview a la API de producción si Preview escribe datos. Mantener el criterio actual del proyecto.

### Qué remoto usa hoy Vercel

**No se pudo determinar localmente.** `scout/frontend` no tiene `.vercel/`; el único
`.vercel/project.json` está en `frontend-deprecated` (proyecto `frontend`). Verificalo en el
dashboard (Settings → Git): puede ser `MartinOfi/scout-front-react` o `gscalasanz/front`.

---

## 2. API → Render (`apps/api`, `@scout/api`)

No hay `render.yaml`: todo vive en el dashboard (Web Service). `apps/api/railway.json` y
`railpack.json` son restos de Railway, sin uso (§Deuda), y no afectan a Render.

| Campo | Valor |
| --- | --- |
| Repository / Branch | el repo del monorepo (§4) / `main` |
| Root Directory | *(vacío = raíz del repo)*: el build necesita `packages/*`, `pnpm-workspace.yaml` y el lockfile |
| Runtime | Node |
| Build Command | `corepack enable && pnpm install --frozen-lockfile --prod=false && pnpm turbo run build --filter=@scout/api` |
| Start Command | `pnpm --filter @scout/api start:prod` (→ `node dist/src/main.js`, **mismo entrypoint que hoy**) |
| Build Filters → Included paths | `apps/api/**`, `packages/**`, `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `turbo.json`, `.nvmrc` |
| Health check path | `/api/v1` (público, devuelve `Hello World!`) |

Notas:

- **`--prod=false`:** si el servicio tiene `NODE_ENV=production`, pnpm saltea las
  devDependencies y el build se rompe, porque faltan `@nestjs/cli`, `typescript` y `@scout/config`.
- **Node:** Render lee `.nvmrc` de la raíz (24.19). Si el servicio tiene `NODE_VERSION`
  fijado a mano, actualizalo a `24.19.0` o borralo. El api se probó en Node 24 (baseline y tests).
- **pnpm:** `corepack enable` usa la versión de `packageManager` (`pnpm@10.33.0`).
- **Migraciones:** `DatabaseModule` corre con `migrationsRun: true`. El primer arranque
  aplica las migraciones pendientes a la base de producción, **igual que hoy**. El monorepo no
  agrega migraciones (las 15 son las mismas de `scout-back`).
- **TZ:** Render corre en UTC. Desde la Fase 8 el api ya no depende de la zona del proceso
  (todo pasa por `@scout/shared/time` con `America/Argentina/Buenos_Aires`).

### Variables de entorno

Las mismas que tiene hoy el servicio, sin cambios: `DATABASE_URL`, `JWT_*`, `FRONTEND_URL`
(lista separada por comas para CORS), `PORT` (lo pone Render) y el resto. El monorepo no
agrega variables nuevas.

---

## 3. Checklist post-cutover (`curl`)

Reemplazar `$API` (p. ej. `https://<servicio>.onrender.com`) y `$WEB` (dominio de Vercel).

```bash
# API viva y con el mismo bootstrap
curl -fsS "$API/api/v1"                                  # → Hello World!
curl -fsS -o /dev/null -w '%{http_code}\n' "$API/api/docs-json"   # → 200
# Ruta protegida sigue protegida (guard JWT global)
curl -s -o /dev/null -w '%{http_code}\n' "$API/api/v1/personas"   # → 401
# CORS para el dominio de web
curl -s -o /dev/null -D - -X OPTIONS "$API/api/v1/auth/login" \
  -H "Origin: $WEB" -H 'Access-Control-Request-Method: POST' | grep -i access-control-allow-origin
# Web
curl -s -o /dev/null -w '%{http_code}\n' "$WEB/login"     # → 200
curl -sI "$WEB/login" | grep -iE 'x-frame-options|x-content-type-options'   # headers de vercel.json
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
