# REGISTRY-detail — UI (`src/shared`)

Primitivas y helpers de UI compartidos entre features. Consumen **solo** tokens del contrato
(`src/shared/styles/TOKENS-CONTRACT.md`). Importar por su ruta en `shared`, nunca duplicar.

## `cn` — `shared/lib/utils.ts`

Combina clases con `clsx` + `tailwind-merge`. Es el helper que esperan los componentes de ReUI.
