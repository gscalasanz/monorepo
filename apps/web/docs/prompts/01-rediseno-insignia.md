# Prompt 1: rediseño real con la estética Insignia

> Abrí una sesión nueva **en `~/Desktop/scout/frontend-react`** y pegá todo lo que está debajo de
> la línea. Es interactivo: las primeras pantallas se hacen con vos mirando.

---

Quiero rediseñar de verdad el frontend React de Scout con la estética **Insignia**. Hoy las
pantallas son el layout del Angular con los colores de Insignia. Eso no es lo que quiero: quiero
la **composición** del mockup aprobado, aunque se aleje de cómo era la pantalla en Angular.

## Contexto (leelo antes de proponer nada)

- `CLAUDE.md`, `docs/DESIGN.md`, `REGISTRY.md` y `docs/HALLAZGOS.md`.
- **El objetivo visual** está en `design-directions/insignia/mockup.html` (abrilo en el navegador
  con Playwright; tiene tabs por pantalla y toggle de tema) y en las capturas de
  `design-directions/insignia/screens/`. Hay mockup de: dashboard, persona (dashboard de una
  persona), movimientos (lista con filtros y tabla), evento de venta (detalle) y formulario (nuevo
  movimiento).
- El código actual de cada pantalla está en `src/features/<modulo>/`.

## Regla central de este trabajo

- **El mockup manda sobre la composición:** layout, jerarquía, qué es protagonista, cómo se agrupa
  la información, tiras de KPIs, sparklines, paneles, densidad y estados.
- **El Angular (`../frontend`) solo sirve para el inventario funcional:** qué datos se muestran y
  qué acciones existen. Ninguna acción ni dato se pierde, pero puede cambiar de lugar o de forma.
- Si una pantalla no tiene mockup, primero se diseña (mockup HTML con los tokens de Insignia, o
  directamente en React si es simple) y **yo la apruebo antes de implementarla**.
- **Solo front.** No se toca `../backend` ni se cambian reglas de negocio.
- ReUI primero: buscá bloques en el MCP `reui` (o en `docs/reui/catalog.tsv`) antes de armar
  componentes propios. Insignia se parece a los bloques "dashboard", "stats" y "data-grid" de ReUI:
  aprovechalos.

## Cómo vamos a trabajar

### Fase A: pilotos (conmigo, en esta sesión)

Hacé estas 3 pantallas, **de a una**, mostrándome el resultado antes de pasar a la siguiente:

1. **Dashboard** (`/dashboard`) contra el mockup "Dashboard".
2. **Movimientos** (`/movimientos`) contra el mockup "Movimientos": filtros, tabla densa,
   paginación y el botón de nuevo movimiento.
3. **Ficha de persona** (`/personas/protagonistas/[id]`) contra el mockup "Persona".

Para cada una:
1. Levantá `pnpm dev` (puerto 4201) y el backend (`cd ../backend && npm run start:dev`, puerto
   3001) si no están corriendo. Usuario: `E2E_EMAIL` / `E2E_PASSWORD` de `.env.local`.
2. Sacá capturas de la pantalla actual y del mockup a **1440×900** y **390×844**, en claro y
   oscuro. Antes de tocar código, listame las diferencias de composición más importantes.
3. Implementá. Lo que se vuelva reutilizable (KPI strip, panel de saldo, sparkline, fila de
   movimiento…) va a `src/shared` y se registra en el REGISTRY.
4. Sacá las capturas de nuevo y mostrámelas **al lado del mockup**. Iteramos hasta que diga que
   está bien.
5. `pnpm typecheck && pnpm lint && pnpm test && pnpm build` en verde, los e2e del módulo en verde,
   y un commit `refactor(<modulo>): rediseño Insignia`.

Al terminar los 3 pilotos, escribí en `docs/REDESIGN.md`:
- los **patrones** que salieron (qué componente usar para cada situación, con ejemplos);
- el **checklist de pantallas** que faltan, marcando cuáles tienen mockup y cuáles necesitan diseño
  previo;
- la propuesta de diseño para las pantallas sin mockup (cajas, inscripciones, campamentos, lista y
  formularios de eventos, reportes, configuración, login, reporte público), para que yo la apruebe.

### Fase B: el resto (después de que apruebe los pilotos)

Cuando apruebe `docs/REDESIGN.md`, armame el texto de un `/goal` para rediseñar el resto de las
pantallas con esos patrones. Su condición de cumplido tiene que incluir que cada pantalla tenga una
captura que compare React con su mockup o diseño aprobado, guardada en `docs/redesign-shots/`.
