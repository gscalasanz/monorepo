# Scout: Design System, dirección «Fogón»

> **Estilo:** comunidad cálida y ordenada · **Paleta:** brasa burdeos × noche índigo × 4 ramas · **Modos:** light + dark (`data-theme`)
> Tokens: [`tokens.css`](./tokens.css) (contrato `src/shared/styles/TOKENS-CONTRACT.md`) · Mockup: [`mockup.html`](./mockup.html) · Capturas: [`screens/`](./screens)

## Concepto

Un fogón es donde el grupo se junta a rendir cuentas: hay fuego en el centro, noche alrededor y cada rama sentada en su lugar. Fogón traduce eso a una herramienta financiera. La base es neutra y limpia: un blanco con un susurro de brasa, nunca crema. La navegación vive en una **noche índigo**, el índigo de Scouts de Argentina. Hay un **único color de acción**, la **brasa burdeos**, heredera de `#812128` pero más viva. Los **cuatro colores de rama** funcionan como sistema de identidad: chips, avatares con anillo, tarjetas de fondo de rama, barras de ventas por vendedor y filtros. El color organiza y nunca decora: si algo tiene color, es una rama, una acción, un estado o plata que entra o sale. La personalidad la ponen **Bricolage Grotesque** en títulos y montos protagonistas, los radios generosos y los «icon tiles» suaves. Los datos se leen en **Geist** con cifras tabulares.

**Escena:** una educadora cobra cuotas un sábado a la tarde en el patio del grupo, con el celular a pleno sol, y a la noche cierra la caja en la compu. Por eso light es el modo por defecto, pensado para el sol y la densidad. Dark es la «noche de campamento»: índigo profundo, nunca negro puro, y la brasa se aviva.

## Tokens: colores (light)

| Token | Valor | Hex aprox. | Rol |
|---|---|---|---|
| `--color-canvas` | `oklch(98.4% 0.004 25)` | `#fcf9f8` | Lienzo. Blanco con un toque de brasa (no crema) |
| `--color-surface` | `oklch(100% 0 0)` | `#ffffff` | Paneles, tablas, inputs |
| `--color-surface-raised` | `oklch(100% 0 0)` | `#ffffff` | Popovers y menús (se distinguen por la sombra) |
| `--color-recessed` | `oklch(96.4% 0.007 25)` | `#f8f1f1` | Áreas hundidas: tracks de progreso, segmented, pie de formulario |
| `--color-ink` | `oklch(23% 0.035 280)` | `#1a1b2d` | Texto primario (tinta índigo, no gris) |
| `--color-ink-muted` | `oklch(43% 0.03 280)` | `#4c4e60` | Texto secundario, labels de KPI |
| `--color-ink-subtle` | `oklch(52% 0.025 280)` | `#666878` | Terciario, placeholders, ejes (igual cumple 4.5:1) |
| `--color-border` | `oklch(91.5% 0.009 25)` | `#e9e1e0` | Divisores y bordes de panel (decorativos) |
| `--color-border-strong` | `oklch(58% 0.025 280)` | `#777989` | Borde de campos de formulario (≥3:1) |
| `--color-focus` | `oklch(50% 0.19 272)` | `#4252cd` | Anillo de foco (índigo eléctrico, distinto de la brasa) |
| `--color-brand` | `oklch(45% 0.165 22)` | `#9c1828` | **Única acción**: CTA, ítem activo, links |
| `--color-brand-hover` | `oklch(39.5% 0.15 22)` | `#850d1e` | Hover/pressed del CTA |
| `--color-on-brand` | `oklch(100% 0 0)` | `#ffffff` | Texto sobre brasa |
| `--color-brand-soft` | `oklch(95.6% 0.022 22)` | `#ffebea` | Selección (radio-card elegida), panel «Ganancia neta» |
| `--color-accent-2` | `oklch(30% 0.12 280)` | `#262067` | Índigo institucional (series, marca secundaria) |
| `--color-success` / `-soft` | `oklch(49% 0.13 155)` / `oklch(95.6% 0.04 155)` | `#00753e` / `#dcf9e5` | Pagado, entregado, válido |
| `--color-danger` / `-soft` | `oklch(52% 0.2 30)` / `oklch(95.6% 0.03 30)` | `#c21b0d` / `#ffeae5` | Deuda, pendiente, error |
| `--color-warning` / `-soft` | `oklch(51% 0.12 62)` / `oklch(95.8% 0.045 80)` | `#955300` / `#ffefd0` | Pago parcial, a reembolsar, falta un papel |
| `--color-info` / `-soft` | `oklch(49% 0.14 250)` / `oklch(95.6% 0.03 250)` | `#0062ac` / `#e2f3ff` | A cobrar, avisos neutros |
| `--color-money-in` | `oklch(49% 0.13 155)` | `#00753e` | Ingreso (siempre con `+` y flecha ↙) |
| `--color-money-out` | `oklch(52% 0.2 30)` | `#c21b0d` | Egreso (siempre con `−` y flecha ↗) |
| `--color-rama-manada` / `-soft` | `oklch(66% 0.16 58)` / `oklch(95.5% 0.05 80)` | `#d87400` / `#ffedcb` | Manada: amarillo-naranja |
| `--color-rama-unidad` / `-soft` | `oklch(58% 0.15 150)` / `oklch(95.5% 0.045 150)` | `#1b9247` / `#dcf9e1` | Unidad: verde |
| `--color-rama-caminantes` / `-soft` | `oklch(56% 0.15 252)` / `oklch(95.5% 0.03 252)` | `#2076c9` / `#e2f2ff` | Caminantes: azul |
| `--color-rama-rovers` / `-soft` | `oklch(50% 0.18 335)` / `oklch(95.5% 0.03 335)` | `#9c2d8b` / `#fee9f8` | Rovers: violeta rojizo |
| `--color-data-1…5` | brasa · índigo · teal · ámbar · gris índigo | | Series que no son rama (ingresos/egresos, inscripciones/campamentos) |
| `--color-sidebar-bg` | `oklch(26% 0.085 280)` | `#1e1c4b` | Noche índigo |
| `--color-sidebar-ink` | `oklch(91% 0.025 280)` | `#dee0f2` | Texto de navegación |
| `--color-sidebar-hover` | `oklch(32% 0.09 280)` | `#2b2b5f` | Hover de ítem |

## Tokens: colores (dark, `[data-theme='dark']`)

| Token | Valor | Nota |
|---|---|---|
| `--color-canvas` | `oklch(18.5% 0.024 280)` | Noche índigo, no negro |
| `--color-surface` / `-raised` / `recessed` | `22%` / `25.5%` / `16.5%` (C≈0.03, H 280) | La elevación se lee por luminosidad |
| `--color-ink` / `-muted` / `-subtle` | `95.5%` / `79%` / `68%` | |
| `--color-border` / `-strong` | `31%` / `58%` | `strong` cumple 3:1 sobre surface |
| `--color-focus` | `oklch(75% 0.14 275)` | |
| `--color-brand` / `-hover` / `on-brand` | `oklch(72% 0.15 25)` / `77%` / `oklch(18% 0.03 25)` | La brasa se aviva: coral encendido con texto oscuro |
| `--color-brand-soft` | `oklch(29% 0.07 22)` | |
| `success` / `danger` / `warning` / `info` | `76%` / `72%` / `81%` / `76%` (soft ≈ 29%) | Los acentos **suben** de luminosidad, no se invierten |
| `rama-*` | Manada `80% .15 72` · Unidad `75% .16 150` · Caminantes `73% .13 250` · Rovers `72% .15 335` | Soft ≈ `29–30%` con C 0.055–0.065 |
| `--color-sidebar-bg` | `oklch(15.5% 0.026 280)` | Más profunda que el canvas |

## Tipografía

**Familias (cargar con `next/font/google`):**
- `Bricolage Grotesque`: ejes `opsz` 12..96 y `wght` 600..800 (`variable`, `axes: ['opsz']`). Sirve para títulos de página, nombre de persona y montos protagonistas (saldo de caja, KPIs, ecuación de evento). **Nunca** va en labels, botones ni celdas de tabla.
- `Geist`: wght 400, 500, 600 y 700. Es toda la UI y los datos. `font-feature-settings: var(--font-features)` (`tnum`) en todo el body para que los montos queden alineados en columnas.
- `Geist Mono`: 400 y 500, solo para CBU, alias, IDs y códigos.

| Rol | Familia | Tamaño / line-height | Peso | Tracking |
|---|---|---|---|---|
| caption | Geist | 12.5 / 1.4 | 500 | 0 |
| label / th | Geist | 12.5–13.5 / 1.4 | 600 | 0 (sentence case, **sin** mayúsculas sostenidas) |
| body-sm (tablas, filas) | Geist | 14 / 1.45 | 400–600 | 0 |
| body | Geist | 15 (16 en inputs, para evitar el zoom de iOS) / 1.5 | 400 | 0 |
| panel title | Geist | 15.5 / 1.3 | 600 | -0.005em |
| montos de lista | Geist tnum | 14.5–16 | 600 | 0 |
| KPI | Bricolage | 26 / 1.1 (22 mobile) | 700 | -0.02em |
| page title (h1) | Bricolage | 30 / 1.12 (26 mobile) | 700 | -0.025em |
| persona name | Bricolage | 32 / 1.1 | 700 | -0.03em |
| saldo protagonista | Bricolage | 48 / 1 (40 mobile), con `$` a 0.55em en ink-subtle | 700 | -0.035em |

La escala es fija en rem/px, sin clamp: es una herramienta, no una landing.

## Radios

| Token | Valor | Uso |
|---|---|---|
| `--radius-sm` | 8px | Badges de estado (7–8px: **cuadrados a propósito**, para distinguirlos de los chips) |
| `--radius-md` | 12px | Botones, inputs, radio-cards, icon tiles (11px) |
| `--radius-lg` | 18px | Paneles, tarjetas de rama |
| `--radius-xl` | 26px | Sheets mobile y modales |
| `--radius-pill` | 999px | Chips de rama y de filtro, barras de progreso, pills de flujo |

Regla: **pill = identidad o filtro** (rama, caja). **Radio chico = estado** (Pagado, Pendiente). La forma ya dice qué tipo de cosa es.

## Elevación

Las sombras son cortas y van tintadas de índigo (`oklch(23% 0.04 280 / α)`). Nunca se usa gris neutro.

| Token | Uso |
|---|---|
| `--shadow-xs` | Paneles y botones secundarios (apenas despega del canvas) |
| `--shadow-sm` | Opción activa del segmented control |
| `--shadow-md` | Hover de tarjeta de rama, FAB mobile |
| `--shadow-lg` | Popovers, menús, modales |

En dark la elevación la dan las superficies más claras. Las sombras pasan a ser casi negras con más alfa.

## Motion

- `--ease-out: cubic-bezier(0.22, 1, 0.36, 1)` · `--duration-fast: 140ms` (hover, chips, pressed) · `--duration-base: 220ms` (entrada de vista, hover de tarjeta).
- Microinteracciones alegres y sobrias: un botón presionado hace `scale(0.97)`; una tarjeta de rama sube `-2px` con `shadow-md` en hover; un chip de filtro cambia de color en 140ms; una vista entra con un fade y `translateY(4px)` en 220ms.
- Sin coreografías de carga. El contenido nunca depende de una animación para ser visible.
- `prefers-reduced-motion: reduce` deja todas las duraciones en 1ms y anula el desplazamiento de las tarjetas.

## Reglas de uso del color

1. **Brasa (`brand`) = acción.** Se usa en el CTA principal (uno por pantalla), el ítem activo de la nav (su tile se rellena), los links, la radio-card elegida y el panel «Ganancia neta». No hay botones rojos de «peligro» que compitan: borrar es `secondary` con un ícono, y confirmar va en un diálogo.
2. **Rama = identidad.** El color de rama aparece solo donde hay una rama de por medio: el chip de una persona o de una caja, el anillo del avatar, la tarjeta de fondo, la barra de un vendedor y el filtro. El texto de un chip de rama es `color-mix(in oklab, var(--color-rama-x) 60%, var(--color-ink))` sobre `--color-rama-x-soft`. Se mezcla **en oklab**: en oklch el tono rotaría hacia el magenta. El sólido de rama va en dots, anillos, barras, sparklines e icon tiles (tile sólido con ícono blanco en light y oscuro en dark).
3. **Caja de grupo = índigo** (`data-2`). No usa la brasa, para que «Caja de grupo» no se lea como deuda al lado de un egreso. Fondo Solidario usa teal (`data-3`) y las cuentas personales usan neutro.
4. **Dinero:** ingreso = `money-in` + `+` + flecha ↙; egreso = `money-out` + `−` + flecha ↗. El signo y el ícono son obligatorios, porque el color nunca va solo. Un monto que no es flujo (un saldo o un total) va en `ink`.
5. **Estados** (badge de 24px, radio 7px, siempre con ícono):
   - `ok` → Pagado, Entregado, Activa, Cerrado (`circle-check`)
   - `warn` → Pago parcial, A reembolsar, Falta (`circle-dashed`, `clock-3`)
   - `bad` → Pendiente, sin pagos (`circle-alert`)
   - `info` → A cobrar, Bonificado (`hourglass`, `gift`)
   - `neutral` → Exento, Deshabilitado (`minus`)
6. Warning y Manada son de la misma familia de tono. Se separan por la forma: el badge de estado es cuadrado y lleva ícono, la rama es una pill con dot.
7. El canvas nunca es crema. La calidez la ponen la brasa, la tipografía y los colores de rama.

## Patrones de componentes

**Shell.** En desktop (≥1024px) hay un sidebar de 268px en noche índigo con: marca, navegación principal (ítems con icon tile de 30px; el activo se rellena con la brasa), «Fondos de rama» (dot de color + saldo, acceso directo) y el usuario al pie. El header de página tiene h1 en Bricolage, un subtítulo humano («Así está la plata del grupo hoy…»), búsqueda, toggle de tema y el CTA. En mobile hay un topbar sticky de 60px (marca, sección, tema y avatar) y un bottom-nav de 5 posiciones (Inicio, Movimientos, **FAB brasa «+»** elevado, Personas, Más). Cada target táctil mide ≥44px.

**KPI strip.** Es **un** panel dividido en 4 celdas con separadores, no 4 cards iguales. Cada celda lleva un label con icon tile de 30px, un valor en Bricolage 26 y un pie con tendencia (flecha + % en color de dinero) o una barra de progreso. En mobile pasa a 2×2.

**Saldo protagonista (Caja de grupo).** Tiene tile, label, monto de 48px con el `$` atenuado, pills de flujo del mes (+/−) y un gráfico de barras pareadas de 6 meses (ingresos en índigo, egresos en brasa; el mes en curso se rotula «(en curso)»). El SVG se re-renderiza al ancho real, y en mobile achica las barras y oculta el sufijo.

**Tarjeta de fondo de rama.** Fondo `rama-soft` con borde `rama` al 22%, nombre en el tono de la rama, tile sólido con el emblema (Manada `paw-print`, Unidad `tent-tree`, Caminantes `mountain`, Rovers `compass`), saldo en Bricolage, cantidad de protagonistas, último movimiento y sparkline. Es el único lugar donde el color de rama ocupa una superficie entera.

**Tabla densa.** Filas de 52–62px con padding de 10×14 y un header en sentence case de 12.5px/600 sobre `ink-muted`. Columnas: Fecha (día + día de semana), Concepto (tile de ingreso/egreso con el ícono del concepto + descripción truncada), Caja (chip), Responsable (avatar de 26px con anillo de su rama), Estado (badge) y **Monto y medio** (monto con signo arriba, medio de pago con ícono abajo, alineado a la derecha). Arriba van un segmented Todos/Ingresos/Egresos, una búsqueda, el período, el medio de pago, una fila de **chips de caja** (pill con dot; el activo se rellena con su soft y gana peso) y una línea de resumen (cantidad · entró · salió · neto). El paginador dice «Mostrando 1–12 de 248» y la página activa va en `ink`. En <720px cada fila pasa a ser concepto + monto.

**Badge de pago/deuda.** Ver regla 5. En obligaciones se acompaña de una barra de progreso con el color de la rama de la persona y del texto «$ 30.000 de $ 45.000».

**Chip de rama.** Pill de 26px con dot de 7px, `rama-soft` y texto mezclado al 60%. Variante `chip--plain` (recessed) para tipos que no son rama, como «Protagonista».

**Montos ±.** `+ $ 15.000` / `− $ 18.400` con signo tipográfico real (U+2212) y un espacio fino después del signo. Siempre tabulares, `white-space: nowrap` y alineados a la derecha en columnas. Un `null` se muestra como `-`, igual que el pipe `money` de Angular.

**Avatar.** Iniciales sobre `rama-soft` con texto mezclado y un anillo de 2px del color de rama separado por 2px de surface. La versión grande (76px, iniciales en Bricolage) va en el header de persona.

**Ecuación de evento.** Recaudado − Gastos = **Ganancia neta**, en un solo panel. La celda de resultado va en `brand-soft` con el monto en brasa y una barra de proporción ganancia/gasto. Respeta la semántica del dominio: el ingreso registra la ganancia, no la recaudación.

**Ventas por vendedor.** Barras horizontales de 22px, cada una del **color de la rama del vendedor**, con un pie que muestra cantidad, promedio y total.

**Empty state.** Usa el mini-fogón de 4 barritas de rama como ilustración, un título corto, una frase que enseña qué hacer y una acción secundaria. Por ejemplo: «Sin bonificaciones. Si la familia necesita ayuda, otorgala desde el Fondo Solidario».

**Formularios.** Labels de 14px/600 arriba, con una ayuda opcional a la derecha en `ink-subtle`. Controles de 46px (54px para el monto, en Bricolage) con borde `border-strong`.
- **Foco:** borde `focus` + halo del 22%.
- **Válido:** borde `success` + `circle-check`.
- **Error:** borde `danger` + halo del 14% + mensaje con ícono que explica cómo arreglarlo («Contá en qué se gastó, con al menos 10 caracteres…»), más una alerta de resumen arriba («Falta 1 dato»).
- **Tipo:** dos tarjetas grandes Ingreso/Egreso.
- **Caja:** chips de rama.
- **Medio de pago:** 4 radio-cards (la deshabilitada explica por qué).

En desktop hay un panel lateral «Así va a quedar» con el monto final y el impacto en el saldo de la caja. En mobile la barra de acciones queda sticky sobre el bottom-nav.

## Accesibilidad

Los ratios son WCAG 2.x y se calcularon con un script (OKLCH → sRGB → luminancia relativa) sobre `tokens.css`.

| Par | Light | Dark | Mínimo |
|---|---|---|---|
| ink / canvas | **16.19** | **16.37** | 4.5 |
| ink / surface | 16.97 | 15.22 | 4.5 |
| ink-muted / canvas | **7.78** | **9.63** | 4.5 |
| ink-muted / surface | 8.15 | 8.96 | 4.5 |
| ink-subtle / canvas | **5.28** | **6.46** | 4.5 |
| ink-subtle / recessed | 4.97 | 6.68 | 4.5 |
| border-strong / surface (campos) | **4.30** | **4.03** | 3 |
| focus / surface | 6.36 | 7.55 | 3 |
| on-brand / brand | **8.12** | **7.15** | 4.5 |
| brand / surface (links) | 8.12 | 6.56 | 4.5 |
| brand / brand-soft | 7.09 | 5.48 | 4.5 |
| success / success-soft (badge) | 5.19 | 6.97 | 4.5 |
| danger / danger-soft (badge) | 5.26 | 5.46 | 4.5 |
| warning / warning-soft (badge) | 5.23 | 7.65 | 4.5 |
| info / info-soft (badge) | 5.50 | 6.60 | 4.5 |
| money-in / surface | **5.82** | **8.60** | 4.5 |
| money-out / surface | **6.10** | **6.54** | 4.5 |
| sidebar-ink / sidebar-bg | 12.09 | 13.61 | 4.5 |
| rama sólido / surface (Manada · Unidad · Caminantes · Rovers) | 3.26 · 4.01 · 4.67 · 6.64 | 9.08 · 8.31 · 7.30 · 6.53 | 3 (gráficos) |
| texto de chip de rama / rama-soft (M · U · C · R) | 5.66 · 6.64 · 7.19 · 8.79 | 8.98 · 8.54 · 8.11 · 7.71 | 4.5 |

- El sólido de rama **no** se usa como color de texto sobre surface. Para texto se usa siempre la mezcla al 60% con ink.
- El estado nunca se comunica solo con color: los badges llevan ícono y palabra, los montos llevan signo y flecha, las ramas llevan nombre.
- El foco es visible en todo lo interactivo (`outline` de 2px en `focus`, offset de 2px).
- Los targets táctiles miden ≥44px; los inputs, ≥46px con texto de 16px; la página no tiene scroll horizontal a 390px (verificado con Playwright: `scrollWidth − innerWidth = 0` en todas las vistas).
- Se respeta `prefers-reduced-motion`. El idioma es `es-AR`, y los montos usan `toLocaleString('es-AR')`.
