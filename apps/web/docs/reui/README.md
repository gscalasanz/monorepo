# Catálogo offline de ReUI

- `catalog.tsv`: índice de los 1887 ítems públicos del registry (`https://reui.io/r/registry.json`):
  nombre, tipo (ui/block/hook), título, descripción. Para buscar sin MCP:
  `grep -i "data-grid\|filter" docs/reui/catalog.tsv`.
- `llms.txt`: mapa de la documentación de ReUI (cada página tiene versión `.md`).
- Instalar: `pnpm dlx shadcn@latest add @reui/<name>` (registry público, no requiere login).
  Después: mover a `src/shared/components/reui/`, reescribir imports y borrar los `cssVars` que el
  instalador inyecte en `globals.css` (CLAUDE.md §5).
- Preferir el **MCP `reui`** (search / get_component / get_examples / validate_usage) cuando esté
  autenticado; este catálogo es el fallback.
