# Contrato de tokens

Toda dirección estética (`design-directions/<nombre>/tokens.css`) DEBE definir exactamente estas
variables en `:root` (light) y re-tonarlas bajo `[data-theme='dark']`. `reui-bridge.css` y todos
los componentes dependen solo de estos nombres. Colores en `oklch()`. Tailwind 4: se exponen con
`@theme` para tener utilidades (`bg-canvas`, `text-ink-muted`, `bg-rama-manada`…).

| Grupo | Variables |
| --- | --- |
| Superficies | `--color-canvas` `--color-surface` `--color-surface-raised` `--color-recessed` |
| Texto | `--color-ink` `--color-ink-muted` `--color-ink-subtle` |
| Bordes/foco | `--color-border` `--color-border-strong` `--color-focus` |
| Marca/acción | `--color-brand` `--color-brand-hover` `--color-on-brand` `--color-brand-soft` `--color-accent-2` |
| Estados | `--color-success` `--color-success-soft` `--color-danger` `--color-danger-soft` `--color-warning` `--color-warning-soft` `--color-info` `--color-info-soft` |
| Dinero | `--color-money-in` `--color-money-out` (ingreso/egreso; nunca solo color: siempre signo/ícono) |
| Ramas | `--color-rama-manada` `--color-rama-unidad` `--color-rama-caminantes` `--color-rama-rovers` (+ `-soft` de cada una) |
| Datos | `--color-data-1` … `--color-data-5` |
| Sidebar | `--color-sidebar-bg` `--color-sidebar-ink` `--color-sidebar-hover` |
| Tipografía | `--font-sans` `--font-display` `--font-mono` `--font-features` |
| Radios | `--radius-sm` `--radius-md` `--radius-lg` `--radius-xl` `--radius-pill` |
| Elevación | `--shadow-xs` `--shadow-sm` `--shadow-md` `--shadow-lg` |
| Motion | `--ease-out` `--duration-fast` `--duration-base` |
