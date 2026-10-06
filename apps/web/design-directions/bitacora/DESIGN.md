# Scout: dirección "Bitácora"

> **Estilo:** libreta de campo editorial · **Paleta:** tinta azul-negra × burgundy scout × verde bosque · **Modos:** light (default) + dark vía `[data-theme='dark']` en `<html>`
> Tokens: [`tokens.css`](./tokens.css) (contrato `src/shared/styles/TOKENS-CONTRACT.md`) · Mockup: [`mockup.html`](./mockup.html) · Capturas: [`screens/`](./screens)

## Concepto

Scout es el libro de cuentas del grupo, y Bitácora lo diseña así: una libreta de campo bien llevada. La hoja es cálida y la tinta, azul-negra (sale del índigo #242167 de Scouts de Argentina). La sidebar es la **tapa de la libreta**, en tinta, y el ítem activo es una **pestaña de papel** que sale de la tapa y se funde con la hoja. La jerarquía la pone la tipografía: un serif editorial (Newsreader) para títulos y para las cifras que importan, y un sans técnico con cifras tabulares (IBM Plex Sans) para tablas, formularios y montos. El gesto distintivo viene de la contabilidad: **los totales llevan doble filete** (`border-bottom: 3px double`), igual que en un libro diario. El burgundy #812128 es el único color de acción y el verde bosque marca lo que está sano: plata que entra, pagos completos, papeles entregados. Densidad media y radios chicos (papel cortado, nada de burbujas), así sigue leyéndose como herramienta financiera y no como un blog.

**Escena:** un educador repasa las cuentas el sábado después de la reunión, desde el celular en el patio del local, o el martes a la noche en la compu. Light por defecto (hay luz de día y la estética de libreta); dark como libreta de noche, con la paleta re-entonada y no invertida.

## Tokens: colores (light)

| Token | oklch | ≈ hex | Rol |
|---|---|---|---|
| `--color-canvas` | `96.4% 0.011 75` | `#f8f2eb` | Hoja (fondo de página) |
| `--color-surface` | `98.9% 0.005 80` | `#fdfbf8` | Ficha apoyada sobre la hoja (paneles) |
| `--color-surface-raised` | `100% 0 0` | `#ffffff` | Campos, popovers, segmento activo |
| `--color-recessed` | `93.6% 0.013 75` | `#efe9e1` | Renglón hundido: tracks, segmentados, línea de totales |
| `--color-ink` | `23% 0.035 272` | `#171c2d` | Texto principal (tinta azul-negra) |
| `--color-ink-muted` | `42% 0.03 272` | `#474c5e` | Texto secundario, etiquetas |
| `--color-ink-subtle` | `50% 0.025 272` | `#5e6372` | Terciario: contadores, placeholders |
| `--color-border` | `87.5% 0.016 75` | `#dcd5cb` | Filetes decorativos (exentos de 1.4.11) |
| `--color-border-strong` | `56% 0.022 272` | `#707482` | Borde de campos y botones secundarios (≥3:1) |
| `--color-focus` | `46% 0.15 268` | `#354faa` | Anillo de foco (índigo tinta) |
| `--color-brand` | `39.5% 0.125 21` | `#7c2027` | **Acción**: CTA, links, tab activa, selección |
| `--color-brand-hover` | `33% 0.11 21` | `#62141b` | Hover/pressed del CTA |
| `--color-on-brand` | `98.9% 0.005 80` | `#fdfbf8` | Texto sobre brand |
| `--color-brand-soft` | `93.5% 0.028 21` | `#fce3e1` | Fondo de opción seleccionada, badge de tipo |
| `--color-accent-2` | `29% 0.11 279` | `#232060` | Índigo institucional (logos, ilustración) |
| `--color-success` / `-soft` | `44% 0.085 155` / `93.5% 0.032 155` | `#24603d` / `#daf0e0` | Verde bosque: pagado, entregado, activo |
| `--color-danger` / `-soft` | `49% 0.165 31` / `94% 0.03 31` | `#aa2c1b` / `#ffe4df` | Deuda, error, sin pagar |
| `--color-warning` / `-soft` | `49% 0.1 62` / `93.5% 0.05 82` | `#885219` / `#fbe7c4` | Parcial, a reembolsar |
| `--color-info` / `-soft` | `45% 0.1 245` / `94% 0.024 245` | `#185a89` / `#deedfb` | A cobrar, avisos neutros |
| `--color-money-in` | = success | `#24603d` | Ingreso (siempre con `+`) |
| `--color-money-out` | = danger | `#aa2c1b` | Egreso (siempre con `−` U+2212) |
| `--color-rama-manada` / `-soft` | `66% 0.155 62` / `93.5% 0.05 75` | `#d37800` / `#fee6c5` | Manada: amarillo-naranja |
| `--color-rama-unidad` / `-soft` | `55% 0.14 148` / `93.5% 0.04 148` | `#25873e` / `#d8f1db` | Unidad: verde |
| `--color-rama-caminantes` / `-soft` | `53% 0.13 250` / `93.5% 0.03 250` | `#226fb3` / `#dbecfd` | Caminantes: azul |
| `--color-rama-rovers` / `-soft` | `50% 0.16 345` / `93.5% 0.035 345` | `#9e3378` / `#fce1ef` | Rovers: violeta-rojizo |
| `--color-data-1…5` | ver tokens | `#298954 #94221f #3f4e97 #c2740a #218daf` | Series de gráficos, en orden fijo |
| `--color-sidebar-bg` | `24.5% 0.04 272` | `#1a1f34` | Tapa de la libreta |
| `--color-sidebar-ink` | `91% 0.014 80` | `#e6e0d7` | Texto de la tapa |
| `--color-sidebar-hover` | `30.5% 0.045 272` | `#272e46` | Hover en la tapa |

## Tokens: colores (dark, `[data-theme='dark']`)

| Token | oklch | ≈ hex |
|---|---|---|
| `--color-canvas` | `19% 0.02 272` | `#11131d` |
| `--color-surface` | `22.5% 0.022 272` | `#181b26` |
| `--color-surface-raised` | `26% 0.024 272` | `#202330` |
| `--color-recessed` | `17% 0.018 272` | `#0d0f17` |
| `--color-ink` / `-muted` / `-subtle` | `94% 0.012 80` / `80% 0.016 80` / `70% 0.016 80` | `#efeae2` / `#c3bdb2` / `#a49e94` |
| `--color-border` / `-strong` | `32% 0.022 272` / `60% 0.022 272` | `#2f323e` / `#7b808e` |
| `--color-focus` | `78% 0.1 268` | `#9cb5f8` |
| `--color-brand` / `-hover` | `67% 0.14 6` / `73% 0.12 6` | `#db6d88` / `#e7869c` |
| `--color-on-brand` | `19% 0.02 272` | `#11131d` |
| `--color-brand-soft` | `27% 0.06 6` | `#3e1822` |
| `--color-success` / `-soft` | `77% 0.12 155` / `30% 0.05 155` | `#70cb92` / `#173523` |
| `--color-danger` / `-soft` | `73% 0.15 31` / `31% 0.07 31` | `#f7806c` / `#4e2119` |
| `--color-warning` / `-soft` | `81% 0.12 75` / `31% 0.05 70` | `#eeb563` / `#402c12` |
| `--color-info` / `-soft` | `77% 0.1 245` / `30% 0.05 245` | `#7cbbf0` / `#163045` |
| Ramas (manada, unidad, caminantes, rovers) | `78% .15 70`, `74% .15 148`, `73% .12 250`, `72% .14 345` | `#f4a437 #60c473 #6aadf0 #e17eb9` |
| `--color-sidebar-bg` / `-ink` / `-hover` | `15.5% 0.017 272` / `89% 0.013 80` / `22% 0.022 272` | `#0a0c14` / `#dfdad1` / `#171a25` |

> **Regla del dark:** los acentos suben de luminosidad y el texto sobre brand pasa a tinta oscura. En oscuro el burgundy se corre a frambuesa (hue 6) para no confundirse con el coral de `danger` (hue 31): la acción nunca tiene que parecer un error.

## Tipografía

**Familias para cargar con `next/font/google`:**

| Familia | Ejes / pesos | Variable CSS | Uso |
|---|---|---|---|
| **Newsreader** | `opsz` 6–72, `wght` 300–700, normal + italic 400–500 | `--font-display` | Títulos de página, títulos de panel, cifras protagonistas, meses del timeline (itálica) |
| **IBM Plex Sans** | 400, 500, 600, 700 | `--font-sans` | Todo lo demás: UI, tablas, montos, formularios |
| **IBM Plex Mono** | 400, 500 | `--font-mono` | Solo números de comprobante, CUIT o IDs. Nunca para etiquetas |

`--font-features: 'tnum' 1, 'lnum' 1` va en `body`: todas las cifras son tabulares y alinean en columna.

| Rol | Familia | Tamaño / line-height | Peso | Tracking | Dónde |
|---|---|---|---|---|---|
| figure-xl | Newsreader opsz 72 | 56px / 1.0 (46px mobile) | 380 | −0.02em | Saldo de caja de grupo (folio) |
| page-title | Newsreader opsz 72 | 36px / 1.08 (29px mobile) | 420 | −0.015em | h1 de cada pantalla |
| figure-lg | Newsreader opsz 72 | 34px / 1.1 | 400 | −0.01em | Cifras de la persona, ganancia neta (30px) |
| sheet-title | Newsreader opsz 30 | 19px / 1.25 | 520 | 0 | h2 de panel |
| legend | Newsreader opsz 24 | 18px / 1.3 | 520 | 0 | Títulos de sección de formulario |
| month (itálica) | Newsreader | 16px / 1.4 | 400 | 0 | Separador de mes en timeline |
| body | Plex Sans | 15px desktop, 16px mobile / 1.5 | 400 | 0 | Texto corriente |
| table | Plex Sans | 14px / 1.45 | 400; 550 en concepto | 0 | Celdas |
| label | Plex Sans | 14px / 1.4 | 550 | 0 | Labels de campo, botones |
| meta | Plex Sans | 13–13.5px / 1.4 | 400–500 | 0 | Subtítulos, encabezados de tabla, hints |
| caption | Plex Sans | 12.5px / 1.35 | 400–550 | 0 | Segunda línea de fila, badges |

Reglas: sentence case siempre, **sin MAYÚSCULAS con tracking**. El serif nunca va en botones, labels ni celdas (salvo cifras protagonistas). Los inputs usan 16px para que iOS no haga zoom.

## Espaciado, radios, elevación, motion

**Base 4px.** Ritmo usual: 4 · 8 · 12 · 16 · 20 · 24 · 28 · 44. Gutter de página: 44px desktop, 28px tablet, 16px mobile. Separación entre paneles: 20px. Touch ≥44px en mobile.

| Radio | Valor | Uso |
|---|---|---|
| `--radius-sm` | 4px | Badges (sellos), chips de rama, segmento activo |
| `--radius-md` | 6px | Botones, inputs, chips de filtro, nav |
| `--radius-lg` | 10px | Paneles (`.sheet`) |
| `--radius-xl` | 14px | Sheets y diálogos en mobile |
| `--radius-pill` | 999px | Solo avatares y puntos de estado |

| Elevación | Uso |
|---|---|
| `--shadow-xs` | Paneles: 1px de "canto de hoja", sin difuminado |
| `--shadow-sm` | Segmento activo, toggles |
| `--shadow-md` | Tooltips, popovers, menús |
| `--shadow-lg` | Diálogos y sheets |

La profundidad la dan los **filetes**, no las sombras: filete grueso de tinta (2px) arriba del folio, filete fino de tinta debajo de los encabezados de tabla y doble filete en totales.

**Motion:** `--ease-out: cubic-bezier(0.25, 1, 0.5, 1)`, `--duration-fast` 120ms (hover, press), `--duration-base` 200ms (cambio de vista, tooltip). Solo comunica estado: no hay coreografías de entrada. Con `prefers-reduced-motion` todo pasa a instantáneo.

## Reglas de uso del color

1. **Burgundy = acción.** Solo para el CTA primario (uno por pantalla), links, tab activa y opción seleccionada. Nunca para decorar ni para marcar una deuda.
2. **Verde bosque = sano.** Ingresos, "Pagado", documentación entregada, persona activa.
3. **Rojo óxido = deuda o egreso.** Siempre con signo `−` o con la palabra "Debe". Nunca solo color.
4. **Ámbar = a medias** (parcial, a reembolsar). **Azul = pendiente sin culpa** (a cobrar).
5. **Ramas = identidad, no estado.** El color de rama va en una marca (pestaña de 5×12px, swatch, aro del avatar, barra). El texto del chip siempre es `ink` sobre `rama-*-soft`.
6. **Datos:** `data-1…5` en orden fijo; ingresos = data-1 y egresos = data-2 en todos los gráficos. Las barras siempre van con leyenda y etiqueta directa del dato clave. La paleta pasó el validador CVD (light: ΔE 11.5 en el peor par; dark: 7.9, legal porque hay leyenda y etiqueta).
7. **Nada de hex ni de paleta Tailwind** en pantallas: solo utilidades de tokens (`bg-surface`, `text-ink-muted`, `bg-rama-unidad-soft`).

## Patrones de componentes

**Folio (cabecera del dashboard):** sin card, apoyado sobre la hoja entre un filete de tinta de 2px y uno de 1px. Tiene tres columnas separadas por filetes verticales: (1) saldo de la caja de grupo en Newsreader de 56px con doble filete y una nota de variación; (2) **asiento del mes**: "Entró / Salió", un filete de tinta y "Neto del mes" con doble filete; (3) otras cajas como renglones con línea punteada. Reemplaza al combo de "KPI cards" iguales.

**KPI de persona (`.figures`):** misma gramática que el folio, en tres columnas. La cifra va en serif; el color sigue al significado (saldo = money-in, deuda = danger, pagado = ink) y solo el saldo disponible lleva doble filete.

**Tabla densa:** el encabezado va en 12.5px muted con filete de tinta debajo, las filas en 14px con filete `border` y el hover en `recessed` al 70%. El concepto ocupa dos líneas (nombre en 550 y detalle muted). El medio de pago lleva ícono y texto. Los montos van alineados a la derecha, tabulares y con signo. Un `tfoot` de total lleva filete de tinta arriba. **En mobile** cada fila pasa a ser un renglón de dos columnas (concepto | monto / fecha | estado) y las columnas secundarias se ocultan, sin scroll horizontal.

**Badge de estado (sello):** radio de 4px, 24px de alto, ícono de 13px + palabra. `Pagado` (success, check), `Parcial` (warning, círculo punteado), `Sin pagar`/`Debe` (danger, alerta), `A cobrar` (info, reloj), `A reembolsar` (warning, flecha). Nunca solo color.

**Chip de rama:** `rama-*-soft` de fondo, pestaña de color de 5×12px, nombre en `ink` 12.5px/550. En avatares el color de rama es el aro (1.5px; 2.5px en el header de persona).

**Montos ±:** `+ $ 12.000` en money-in, `− $ 8.500` en money-out (U+2212). Los espacios después del signo y del `$` son **no separables**. Formato es-AR con punto de miles, sin decimales. Los totales llevan doble filete.

**Barra de progreso de obligación:** track `recessed` de 6px y relleno success (completa) o warning (parcial). La etiqueta va a la derecha con ancho fijo ("$ 30.000 de $ 45.000") para que todas las barras alineen.

**Timeline:** meses en Newsreader itálica como separadores de capítulo. Cada renglón lleva fecha, punto con flecha (↙ ingreso / ↗ egreso sobre fondo soft), título, detalle y monto con signo.

**Filtros:** primera fila con segmentado Todos/Ingresos/Egresos/Gastos (con conteos) y buscador a la derecha. Segunda fila con chips: los aplicados van sólidos con ✕ y los disponibles, con borde punteado y "+". Debajo, una línea resumen en `recessed` ("Mostrando 1–12 de 248 · Entró · Salió").

**Empty state:** título en serif ("No hay eventos en agenda"), una oración que explica para qué sirve la sección y un botón secundario con la acción concreta. Va alineado a la izquierda, sin ilustración.

**Formularios:** label 14px/550 arriba, control de 44px con borde `border-strong` y radio de 6px. El foco lleva borde `focus` + halo de 3px al 22%. Error: borde danger + halo al 14% + **callout** con la causa y la salida ("Elegí Mixto…" + botón que lo aplica). Válido: check verde dentro del campo. Deshabilitado: fondo `recessed` + candado + hint que explica por qué. El medio de pago se elige con radio-cards (ícono, nombre y consecuencia en una línea). En desktop hay una vista previa "Así se va a asentar" que muestra el impacto en las cajas. En mobile la barra de acciones queda fija abajo.

**Navegación:** en desktop, sidebar-tapa de 252px con escudo, grupos "Actividades" e "Informes", ítem activo como pestaña de papel con esquinas invertidas, y al pie el toggle de tema y el usuario. Topbar de 64px con breadcrumbs y buscador (⌘K). En mobile, barra superior en tinta (escudo, nombre, tema, buscar) y bottom-nav de 5 ítems (Inicio, Personas, Movimientos, Eventos, Más), con el activo en brand y trazo más grueso. La bottom-nav se oculta en formularios.

## Accesibilidad

Ratios verificados con script (oklch → sRGB → WCAG), sobre los tokens finales:

| Par | Light | Dark | Mínimo |
|---|---|---|---|
| ink / canvas | 15.25 | 15.50 | 4.5 |
| ink / surface | 16.42 | 14.36 | 4.5 |
| ink-muted / canvas | 7.64 | 9.89 | 4.5 |
| ink-muted / recessed | 7.03 | 10.24 | 4.5 |
| ink-subtle / canvas | 5.41 | 6.91 | 4.5 |
| ink-subtle / recessed | 4.98 | 7.16 | 4.5 |
| border-strong / surface (campos) | 4.52 | 4.33 | 3 |
| focus / surface | 7.14 | 8.49 | 3 |
| on-brand / brand | 9.71 | 5.76 | 4.5 |
| brand / surface (links) | 9.71 | 5.34 | 4.5 |
| brand / brand-soft | 8.20 | 4.81 | 4.5 |
| money-in / surface | 7.21 | 8.68 | 4.5 |
| money-out / surface | 6.59 | 6.74 | 4.5 |
| success / success-soft | 6.22 | 6.77 | 4.5 |
| danger / danger-soft | 5.65 | 5.32 | 4.5 |
| warning / warning-soft | 5.32 | 7.24 | 4.5 |
| info / info-soft | 6.21 | 6.62 | 4.5 |
| ink / rama-*-soft (chips) | 13.8–14.2 | 11.1–11.4 | 4.5 |
| rama-* / surface (marcas) | 3.14–6.36 | 6.46–8.33 | 3 |
| data-1…5 / surface | 3.51–7.41 | 4.61–7.24 | 3 |
| sidebar-ink / sidebar-bg | 12.46 | 14.06 | 4.5 |

- El estado nunca depende solo del color: el signo `+`/`−`, el ícono y la palabra van siempre.
- Foco visible en todo lo interactivo (anillo `focus` de 2px con offset).
- Los segmentados usan `aria-pressed`, el medio de pago usa `role="radiogroup"` + `aria-checked` y los errores, `aria-invalid` + `aria-describedby` + `role="alert"`.
- Touch ≥44px en mobile, body de 16px e inputs de 16px. Sin overflow horizontal a 390px (verificado).
- `prefers-reduced-motion` anula transiciones y la entrada de vistas.
- Los gráficos llevan `role="img"` + `aria-label`, leyenda, etiqueta directa y tooltip con valores exactos. Para el reporte, la tabla de datos va al lado.
