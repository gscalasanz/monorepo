# Scout — Design System «Insignia»

> **Estilo:** precisión fintech con identidad scout · **Paleta:** neutros fríos × indigo SAAC × burgundy · **Modos:** light + dark (`[data-theme='dark']` en `<html>`)
> Fuente de tokens: [`tokens.css`](./tokens.css) (contrato: `src/shared/styles/TOKENS-CONTRACT.md`). Referencia visual: [`mockup.html`](./mockup.html) y [`screens/`](./screens).

## Concepto

Insignia trata el dinero del grupo como lo trataría una buena herramienta financiera (Mercury, Stripe, Linear): **neutros fríos casi sin color**, hairlines en vez de sombras, radios chicos, cifras tabulares alineadas al peso. La identidad scout no se reparte en decoración: se concentra en una **banda estructural**, la sidebar en el indigo institucional de Scouts de Argentina (`#242167`) con un filo burgundy (`#812128`) arriba, como el borde de una pañoleta, y en el escudo del grupo. Todo lo demás está al servicio de leer números rápido. El indigo de **acción** es un derivado más claro y saturado (`#3E3EB3`) para que "tocable" y "estructura" no se confundan. Los **egresos son tinta, no rojo**: el rojo queda reservado para la deuda y los errores. Así, cuando algo es rojo, de verdad hay que mirarlo.

**Escena:** tesorera en la compu el sábado a la mañana conciliando la caja, y educador en el celular a la salida de la reunión, en la vereda, cargando un gasto. Por eso light es el default (luz de día y pantallas de oficina) y dark se diseña aparte para la noche, no se invierte.

## Tokens — Colores (light)

| Token | Valor | Hex aprox. | Rol |
|---|---|---|---|
| `--color-canvas` | `oklch(97.9% 0.004 276)` | `#F7F8FB` | Lienzo de página |
| `--color-surface` | `oklch(100% 0 0)` | `#FFFFFF` | Paneles, tablas, campos |
| `--color-surface-raised` | `oklch(100% 0 0)` | `#FFFFFF` | Popovers, tooltips, segmento activo |
| `--color-recessed` | `oklch(96.4% 0.005 276)` | `#F2F3F7` | Hundidos: barra de totales, pie de form, tracks |
| `--color-ink` | `oklch(21% 0.028 278)` | `#151725` | Texto primario, cifras |
| `--color-ink-muted` | `oklch(44% 0.02 277)` | `#4F525E` | Texto secundario, labels |
| `--color-ink-subtle` | `oklch(52.5% 0.016 277)` | `#686A74` | Terciario: metadatos, ejes, `$` |
| `--color-border` | `oklch(91.8% 0.006 276)` | `#E3E4E8` | Hairlines decorativas (exentas de 1.4.11) |
| `--color-border-strong` | `oklch(61% 0.016 277)` | `#80828D` | **Borde de campos y checkboxes** (≥3:1) |
| `--color-focus` | `oklch(50% 0.2 276)` | `#4B4CD1` | Anillo de foco |
| `--color-brand` | `oklch(44% 0.18 276)` | `#3E3EB3` | **Acción**: CTA, links, selección |
| `--color-brand-hover` | `oklch(38.5% 0.165 277)` | `#343098` | Hover de acción |
| `--color-on-brand` | `oklch(100% 0 0)` | `#FFFFFF` | Texto sobre acción |
| `--color-brand-soft` | `oklch(95.6% 0.022 278)` | `#EDEFFF` | Filtro activo, fila seleccionada |
| `--color-accent-2` | `oklch(40.5% 0.135 22)` | `#831E25` | **Burgundy de identidad** (escudo, filo de sidebar, Fondo Solidario en datos) |
| `--color-success` / `-soft` | `oklch(48% 0.115 158)` / `oklch(96.2% 0.03 160)` | `#007044` | Pagado, al día |
| `--color-danger` / `-soft` | `oklch(51% 0.19 27)` / `oklch(96.3% 0.022 25)` | `#BA1E20` | Deuda, vencido, error |
| `--color-warning` / `-soft` | `oklch(52% 0.115 62)` / `oklch(96.4% 0.042 85)` | `#97570D` | Parcial, a cobrar, documentación faltante |
| `--color-info` / `-soft` | `oklch(49% 0.13 250)` / `oklch(96.2% 0.022 250)` | `#1263A6` | Bonificado, a reembolsar |
| `--color-money-in` | `oklch(48% 0.115 158)` | `#007044` | Ingreso (siempre con `+` y flecha ↙) |
| `--color-money-out` | `oklch(34% 0.02 277)` | `#353742` | Egreso (siempre con `−` y flecha ↗) — **tinta, no rojo** |
| `--color-rama-manada` / `-soft` | `oklch(67.5% 0.16 58)` / `oklch(95.5% 0.045 80)` | `#DD7907` | Manada: amarillo-naranja |
| `--color-rama-unidad` / `-soft` | `oklch(60% 0.15 148)` / `oklch(95.5% 0.04 150)` | `#2E9848` | Unidad: verde |
| `--color-rama-caminantes` / `-soft` | `oklch(56% 0.15 252)` / `oklch(95.5% 0.025 252)` | `#2076C9` | Caminantes: azul |
| `--color-rama-rovers` / `-soft` | `oklch(50% 0.17 338)` / `oklch(95.5% 0.025 338)` | `#9C3084` | Rovers: violeta-rojizo |
| `--color-data-1…5` | indigo · indigo claro · burgundy · verde · ámbar | | Series de gráficos (ordenadas por luminancia) |
| `--color-sidebar-bg` | `oklch(26.5% 0.105 280)` | `#1E1A56` | **La insignia**: indigo institucional |
| `--color-sidebar-ink` | `oklch(91% 0.025 280)` | `#DEE0F2` | Texto de sidebar |
| `--color-sidebar-hover` | `oklch(32% 0.11 280)` | `#2A2869` | Hover/activo en sidebar |

## Tokens — Colores (dark)

Regla: el lienzo es un azul-noche casi negro tomado del indigo; **las superficies suben de luz con la elevación** (canvas 15.5% → surface 19% → raised 22.5%); los acentos se re-tonan más claros y menos saturados; la sidebar baja a casi negro para que el contenido sea lo más luminoso.

| Token | Valor | Token | Valor |
|---|---|---|---|
| `canvas` | `oklch(15.5% 0.012 278)` | `brand` | `oklch(72% 0.135 278)` |
| `surface` | `oklch(19% 0.014 278)` | `brand-hover` | `oklch(78% 0.115 278)` |
| `surface-raised` | `oklch(22.5% 0.016 278)` | `on-brand` | `oklch(17% 0.04 280)` (texto oscuro) |
| `recessed` | `oklch(13.5% 0.011 278)` | `brand-soft` | `oklch(27% 0.06 278)` |
| `ink` | `oklch(95.5% 0.006 278)` | `accent-2` | `oklch(69% 0.13 18)` |
| `ink-muted` | `oklch(77% 0.014 278)` | `success` / `money-in` | `oklch(76% 0.13 158)` |
| `ink-subtle` | `oklch(66% 0.014 278)` | `danger` | `oklch(71% 0.16 25)` |
| `border` | `oklch(27% 0.016 278)` | `warning` | `oklch(80% 0.12 75)` |
| `border-strong` | `oklch(52% 0.018 278)` | `info` | `oklch(75% 0.11 250)` |
| `focus` | `oklch(74% 0.14 278)` | `money-out` | `oklch(86% 0.01 278)` |
| `sidebar-bg` | `oklch(13% 0.03 280)` | `rama-*` | L 70–80%, `-soft` L 26–28% |

Los `-soft` en dark son tintes profundos (L 26–28%) sobre los que el color de estado mantiene ≥5.5:1.

## Tipografía

**Geist** para todo (UI, títulos, cifras) + **Geist Mono** solo para identificadores (DNI, N.º de movimiento, comprobantes). Grotesca nítida con cifras tabulares reales: los montos se alinean por columna sin esfuerzo. Jerarquía por **tamaño y peso**, nunca por una segunda familia. Sin mayúsculas sostenidas: encabezados de tabla y labels en sentence case.

**Cargar con `next/font/google`:** `Geist` pesos **400, 500, 600** y `Geist_Mono` pesos **400, 500** (`display: 'swap'`, variables `--font-geist` / `--font-geist-mono`, mapeadas a `--font-sans` / `--font-mono`). `--font-features: 'tnum' 1` se aplica a `body`.

Escala fija en rem (ratio ~1.15, producto, no fluida):

| Rol | Size / line-height | Peso | Tracking | Uso |
|---|---|---|---|---|
| micro | 11 / 16 | 500 | 0 | ejes de gráfico, labels de bottom-nav |
| caption | 12 / 16 | 500 | 0 | badges, chips, metadatos, encabezados de tabla |
| data | 13 / 20 | 400–500 | 0 | celdas de tabla, filtros, links de panel |
| body | 14 / 20 | 400 | 0 | cuerpo desktop |
| body-m | 15–16 / 22–24 | 400 | 0 | cuerpo e inputs en mobile (≥16 en inputs: sin zoom iOS) |
| panel-title | 14 / 20 | 600 | 0 | título de panel |
| person | 22 / 28 | 600 | −0.02em | nombre en ficha de persona |
| page-title | 26 / 32 (22 / 28 mobile) | 600 | −0.022em | título de página |
| figure-md | 24 / 30 | 600 | −0.025em | KPI secundarios, ecuación de evento |
| figure | 40 / 44 (34 / 40 mobile) | 600 | −0.035em | cifra principal de la pantalla (una por pantalla) |

**Montos:** `$` a 0.5–0.62em, peso 500, color `ink-subtle`, alineado arriba en cifras grandes; en tablas, mismo tamaño que el número. Formato `es-AR` sin decimales: `$ 1.234`. Con signo: `+$ 60.000` / `−$ 17.600` (U+2212, no guion). Nulo: `—`.

## Radios, espaciado, elevación

| Token | Valor | Uso |
|---|---|---|
| `--radius-sm` | 4px | badges de estado, checkboxes, kbd |
| `--radius-md` | 6px | botones, inputs, chips de filtro, nav items |
| `--radius-lg` | 8px | opciones de medio de pago, dropzone, tooltips |
| `--radius-xl` | 12px | paneles |
| `--radius-pill` | 999px | chips de rama, categorías, switch |

Base 4px. Gaps de grilla 16px (12 mobile); padding de panel 18px/16px; filas de tabla 48px; gutter de página 32px desktop / 16px mobile. Touch ≥44px en mobile.

**Elevación mínima.** Los paneles se separan del lienzo por **hairline + contraste de superficie**, con `--shadow-xs` (1px). `--shadow-sm` para el segmento activo y el knob del switch; `--shadow-md` para tooltips y el botón + del bottom-nav; `--shadow-lg` para diálogos/sheets. En dark las sombras se acompañan de un ring de 1px blanco al 3–5% porque la sombra sola no se ve.

## Motion

`--ease-out: cubic-bezier(0.16, 1, 0.3, 1)` · `--duration-fast: 120ms` (hover, color) · `--duration-base: 200ms` (switch, entrada de pantalla 4px + fade). Nada de rebotes ni coreografías de carga. Todo bajo `prefers-reduced-motion` cae a 1ms.

## Reglas de uso del color

- **Indigo de acción (`brand`)**: un CTA primario por vista, links, filtro activo, fila seleccionada, tab activa. Nunca fondo de paneles ni texto largo.
- **Indigo institucional (`sidebar-bg`)**: solo estructura de navegación (sidebar, top bar mobile). Es la "insignia": no se repite en el contenido.
- **Burgundy (`accent-2`)**: identidad. Escudo del grupo, filo superior de 3px de la navegación, punto de notificación, Fondo Solidario en gráficos. Jamás para acción ni para error (para eso está `danger`, más rojo y más claro).
- **Verde (`money-in`)**: dinero que entra y cosas al día. **Egresos en tinta**: un gasto normal no es una alarma.
- **Rojo (`danger`)**: deuda, vencimientos, validación fallida. Si una pantalla tiene mucho rojo, es porque hay mucha deuda.
- **Ramas**: solo como punto, track o tinte de chip, siempre acompañados del nombre. El texto del chip va en `ink` sobre `rama-*-soft`.

## Patrones de componentes

**KPI (tira de métricas).** No son cards repetidas: es **un panel con celdas separadas por hairlines verticales**. Cada celda: label (13, muted) → cifra `figure-md` → delta (flecha + % + comparación en palabras: "vs. agosto") → sparkline 96×32 a la derecha (línea 1.5px + área al 10% + punto final). El color del delta depende del significado, no del signo: más ingresos = verde, menos deuda = verde, más egresos = tinta neutra.

**Panel "Dinero del grupo".** La única cifra `figure` del dashboard, con la barra de distribución por caja (segmentos con 2px de separación) y leyenda con montos alineados; a la derecha, línea de saldo + barras pareadas ingresos/egresos con tooltip (raised + shadow-md).

**Tabla densa.** Encabezados 12px `ink-subtle` en sentence case, sin fondo; filas 48px con hairline; hover `recessed` al 70%; seleccionada `brand-soft`. Columna concepto = tile de dirección (28px, verde si entra, neutro si sale) + título 500 + subtítulo 12px. Montos a la derecha, tabulares. En mobile (<860px) la tabla **se convierte en lista**: concepto + "fecha · persona" a la izquierda, monto a la derecha; las demás columnas se ocultan.

**Badge de estado (pago/deuda).** Rectangular (radius-sm), 22px, fondo `-soft` + texto e **ícono** del estado: Pagado con check (success), Parcial con círculo punteado (warning), Pendiente/Vencido con reloj (danger), Bonificado con ícono regalo (info), A reembolsar con flecha de retorno (info), A cobrar con reloj (warning). Nunca solo color.

**Chip de rama.** Pill 22px, fondo `rama-*-soft`, punto 7px en `rama-*`, nombre en `ink`. Variante "punto + nombre" para listas densas.

**Montos +/−.** Ingreso `+$ 60.000` en `money-in`; egreso `−$ 17.600` en `money-out`; deuda `$ 96.000` en `danger`. Siempre con signo o contexto textual ("pendiente", "Deuda total") y, en listas, con el tile de dirección.

**Chips de filtro.** Inactivo: borde punteado `border-strong` + "+ Medio de pago". Activo: sólido `brand-soft`, texto `brand`, valor en 600 y botón × de 18px. Debajo, una **barra de totales** en `recessed` que responde al filtro (cantidad, ingresos, egresos, neto).

**Empty state.** Ícono en tile hundido 36px, una frase que dice qué pasa ("Nada para devolverle a Valentina") y otra que enseña cuándo aparecerá algo. Sin ilustraciones.

**Formularios.** Label 13/500 arriba; control 38px desktop / 46px mobile, borde `border-strong`, radius-md. Foco: borde `focus` + anillo 3px al 24%. Error: borde `danger` + anillo al 18% + ícono + mensaje que dice **cómo arreglarlo** ("Faltan $ 2.000 para llegar al monto. Ajustá efectivo o transferencia."). Válido: check verde dentro del control. Deshabilitado: fondo `recessed`, borde `border`, candado. Monto en input grande (24px/600). Medio de pago como **radio-cards** con descripción; "Mixto" despliega el desglose en un hundido con la suma en vivo. En desktop, panel lateral "Impacto en las cajas" (saldo antes → después) y checklist "Antes de guardar". En mobile la acción vive en una barra inferior fija (Cancelar / Guardar).

**Sidebar / nav mobile.** Desktop: sidebar 244px indigo, filo burgundy de 3px, escudo + nombre del grupo, grupos "Actividades" y "Análisis", ítem activo con fondo `sidebar-hover` + ring 1px blanco al 7% (sin barras laterales), usuario abajo. Mobile: top bar indigo de 56px con título de la pantalla; bottom-nav de 5 destinos con **"+" central** (nuevo movimiento) en `brand`, 48px; en formularios el bottom-nav se reemplaza por la barra de acciones.

## Accesibilidad (WCAG 2.2 AA)

Ratios calculados desde los valores oklch de `tokens.css` (script de luminancia relativa sRGB):

| Par | Light | Dark | Mínimo |
|---|---|---|---|
| ink / canvas | 16.72 | 17.14 | 4.5 |
| ink-muted / surface | 7.79 | 8.90 | 4.5 |
| ink-muted / canvas | 7.33 | 9.42 | 4.5 |
| ink-subtle / surface | 5.40 | 5.93 | 4.5 |
| ink-subtle / canvas | 5.09 | 6.27 | 4.5 |
| ink-subtle / recessed | 4.87 | 6.42 | 4.5 |
| border-strong / surface (campos) | 3.80 | 3.35 | 3.0 |
| border-strong / canvas | 3.57 | 3.54 | 3.0 |
| focus / surface | 6.44 | 7.77 | 3.0 |
| on-brand / brand | 8.29 | 7.53 | 4.5 |
| on-brand / brand-hover | 10.42 | 9.39 | 4.5 |
| brand / surface (links) | 8.29 | 7.25 | 4.5 |
| brand / brand-soft (filtro activo) | 7.27 | 5.98 | 4.5 |
| accent-2 / surface | 9.67 | 6.28 | 4.5 |
| success / success-soft | 5.57 | 7.52 | 4.5 |
| danger / surface | 6.34 | 6.70 | 4.5 |
| danger / danger-soft | 5.63 | 5.58 | 4.5 |
| warning / warning-soft | 5.12 | 7.76 | 4.5 |
| info / info-soft | 5.61 | 7.01 | 4.5 |
| money-in / surface | 6.15 | 9.09 | 4.5 |
| money-out / surface | 11.79 | 12.07 | 4.5 |
| ink / rama-*-soft | ≥15.4 | ≥12.9 | 4.5 |
| rama-* / surface (gráfico) | 3.08–6.61 | 6.43–9.68 | 3.0 |
| sidebar-ink / sidebar-bg | 12.01 | 13.14 | 4.5 |

- Estado nunca solo por color: badges con ícono + texto, montos con signo, ramas con nombre, tiles con flecha.
- Foco visible en todo interactivo (`outline 2px focus`, offset 2px); en campos, anillo de 3px.
- Errores con `aria-invalid` + `aria-describedby` al mensaje; resumen de totales con `aria-live="polite"`.
- Targets ≥44px en mobile; inputs ≥16px en mobile; sin scroll horizontal a 390px.
- Gráficos con `role="img"` + `aria-label` que dice la conclusión, no solo "gráfico".
- `prefers-reduced-motion` respetado.
