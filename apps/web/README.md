# Scout — Frontend (React)

Gestión financiera del grupo scout: personas, cajas, movimientos, inscripciones, campamentos,
eventos (con reporte público), reportes y configuración. Migración del frontend Angular
(`../frontend`) con paridad funcional y rediseño visual.

- Reglas del repo y del agente: [`CLAUDE.md`](./CLAUDE.md)
- Estado de la migración: [`MIGRATION.md`](./MIGRATION.md) · reporte final: [`docs/MIGRATION-REPORT.md`](./docs/MIGRATION-REPORT.md)
- Design system: [`docs/DESIGN.md`](./docs/DESIGN.md) · componentes reutilizables: [`REGISTRY.md`](./REGISTRY.md)

## Stack

Next.js 16 (App Router) · React 19 · TypeScript strict · Tailwind CSS 4 · ReUI/shadcn (`@base-ui/react`) ·
zod · zustand · TanStack Table · recharts · date-fns(-tz) · Vitest + Testing Library · Playwright.

## Requisitos

- Node según `.nvmrc` y **pnpm** (obligatorio).
- Backend NestJS de `../backend` corriendo en local (`http://localhost:3001/api/v1`) para desarrollo y e2e.

## Puesta en marcha

```bash
pnpm install
cp .env.example .env.local   # completar E2E_EMAIL / E2E_PASSWORD (usuario del backend local)
pnpm dev                     # http://localhost:4201 (puerto fijo: es el origin que acepta el CORS del backend)
```

| Variable | Uso |
| --- | --- |
| `API_URL` | Base de la API. Local: `http://localhost:3001/api/v1`. **Nunca producción desde dev/e2e.** |
| `E2E_EMAIL` · `E2E_PASSWORD` | Credenciales para los e2e (solo backend local; no se commitean). |

## Calidad

```bash
pnpm typecheck && pnpm lint && pnpm test && pnpm build
pnpm test:e2e     # Playwright (desktop + Pixel 7) contra pnpm dev + backend local
```

Los e2e crean datos con prefijo `E2E ` y los borran al terminar. El pre-commit corre typecheck + lint
y commitlint valida los mensajes (conventional commits).

## Deploy (preparado, sin desplegar)

`vercel.json` configura Vercel para Next.js con pnpm y cabeceras de seguridad. Antes de publicar:

1. Definir `API_URL` con la URL del backend productivo en el proyecto de Vercel.
2. El backend acepta un único origin CORS (`FRONTEND_URL`, default `http://localhost:4201`): apuntarlo
   al dominio del frontend React es configuración del deploy del backend, fuera de esta migración.
3. Las sesiones (tokens en `localStorage`) y la config de inscripción (`scout_inscripcion_config`) usan
   las mismas claves que Angular, pero `localStorage` es por origin: si el dominio cambia, los usuarios
   inician sesión de nuevo y recargan esos montos.

## Estructura

```
src/app/         routing fino: (auth)/login, (app)/… autenticado con AppShell, (public)/eventos/[id]/reporte
src/features/    un feature por módulo; su index.ts es la única puerta de entrada
src/shared/      api, auth, domain (schemas zod), time, components (ui, data, charts, finanzas, reui), forms…
e2e/             specs Playwright por módulo
```
