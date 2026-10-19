# Prompt 2: edición inline tipo Excel en las grillas

> Abrí una sesión nueva **en el worktree** y pegá todo lo que está debajo de la línea:
> `cd ~/Desktop/scout/frontend-react/.claude/worktrees/edicion-inline && claude`
> El Paso 1 (propuesta) se puede hacer en paralelo con el rediseño. El Paso 2 (código) conviene
> hacerlo después de que estén los pilotos del rediseño, porque el rediseño cambia las grillas.

---

## Dónde trabajás

- Worktree: `~/Desktop/scout/frontend-react/.claude/worktrees/edicion-inline`, rama
  **`feat/edicion-inline`** (sale de `main`; ya tiene `node_modules` y `.env.local`). Todo el
  trabajo y los commits van ahí. No toques `main` ni el otro worktree (`rediseno-insignia`).
- El rediseño se está haciendo en paralelo en la rama `feat/rediseno-insignia` y cambia las
  grillas. **Antes de empezar el Paso 2**, traé esos cambios con
  `git merge feat/rediseno-insignia` (o `main`, si el rediseño ya se mergeó) y resolvé los
  conflictos. Si el rediseño todavía no tiene los pilotos, hacé solo el Paso 1 y avisame.
- `pnpm dev` usa el puerto **4201**, que es el único que acepta el CORS del backend. Si está
  ocupado, probablemente es el dev server del otro worktree: avisame en vez de matarlo.
- Al terminar no mergees a `main` ni hagas push: avisame y lo decido yo.

Quiero que en las DataGrids de Scout se pueda editar **inline, estilo Excel**: hacer clic en una
celda, cambiar el valor y que se guarde, sin abrir un formulario aparte.

## Contexto

- Leé `CLAUDE.md`, `REGISTRY.md` (buscá el DataGrid compartido), `docs/DESIGN.md` y
  `docs/HALLAZGOS.md`.
- ReUI ya trae la base: el bloque **`c-data-grid-31` ("Data grid with spreadsheet editing")** y los
  bloques `data-grid-editing-*` (buscalos con el MCP `reui` o en `docs/reui/catalog.tsv`). Usalos
  sobre el DataGrid que ya tenemos vendorizado en `src/shared/components/reui/data-grid/`. No
  inventes una grilla nueva.
- **Restricción: solo front.** Únicamente se puede editar lo que ya tiene un `PATCH` en el backend
  (`../backend`, solo lectura):
  - `PATCH /personas/:id`
  - `PATCH /movimientos/:id`
  - `PATCH /eventos/:id` y `PATCH /eventos/productos/:id`
  - `PATCH /inscripciones/:id` y `PATCH /inscripciones/:id/bonificacion`
  - `PATCH /campamentos/:id`, `PATCH /campamentos/:id/participantes/:personaId` y
    `.../bonificacion`

  Antes de proponer, revisá el DTO de cada uno para saber qué campos acepta de verdad, y la lógica
  del service para saber qué efectos tiene.
- ⚠️ El `update` de movimientos es un `Object.assign` genérico. Los pagos con **saldo personal** y
  las **transferencias entre cajas** generan 2 movimientos vinculados, y editar uno solo los
  desincroniza. Esos movimientos **no** se pueden editar inline.

## Paso 1: proponer (no escribas código todavía)

Armame una tabla con:
- **Cada grilla de la app** y qué columnas serían editables inline. Indicá el endpoint, el campo
  del DTO, el tipo de editor (texto, número/monto, select, fecha) y las reglas de validación (zod,
  reutilizando `src/shared/validators`).
- **Qué NO se puede editar y por qué** (sin endpoint, movimiento vinculado, campo calculado, etc.).
- **Efectos secundarios:** por ejemplo, editar el monto de un movimiento cambia saldos de cajas,
  deudas y KPIs. Decime qué hay que refrescar.

Y proponeme cómo resolver estas decisiones, con tu recomendación:
1. **Cuándo se guarda:** al salir de la celda / con Enter, o un modo "editar fila" con
   Guardar y Cancelar.
2. **Si falla:** revertir el valor y mostrar un toast con el error del backend; o dejar la celda
   en rojo con el error inline.
3. **Optimista o no:** mostrar el valor nuevo ya, o esperar la respuesta.
4. **Teclado:** flechas, Tab, Enter, Esc, y F2 para editar.
5. **Celular:** tocar la fila abre un sheet o drawer de edición en lugar de editar la celda.
6. **Edición concurrente:** qué pasa si dos personas editan lo mismo (hoy el backend no tiene
  control de versión).
7. **Deshacer:** si conviene un "Deshacer" en el toast después de guardar.

Esperá mi respuesta antes de seguir.

## Paso 2: implementar (después de que apruebe)

1. Un componente compartido de celda editable sobre el DataGrid, registrado en el REGISTRY, con
   TDD: tests de validación, guardado, error y revertido, y teclado.
2. Aplicalo primero en **una sola grilla piloto** (movimientos) y mostrámela funcionando en el
   navegador, en desktop y celular, antes de extenderla.
3. Después, el resto de las grillas aprobadas. Un commit por grilla
   (`feat(<modulo>): edición inline en la grilla`).
4. e2e por grilla: editar un campo, verificar que persistió recargando la página, y probar el
   caso de error. Los datos de prueba llevan el prefijo `E2E ` y se limpian al final.
5. `pnpm typecheck && pnpm lint && pnpm test && pnpm build && pnpm test:e2e` en verde al final.
