/**
 * Clases del contrato de campos (DESIGN.md §Formularios): 46px mobile / 38px
 * desktop, texto ≥16px en mobile, borde `border-strong`, radius-md, foco con
 * anillo de 3px al 24% y error con borde `danger` + anillo al 18%. Incluyen los
 * pares `dark:` para pisar los defaults del primitivo de ReUI vía `cn`.
 */
export const CONTROL_SURFACE =
  'rounded-md border border-border-strong bg-surface text-ink shadow-none outline-none transition-colors dark:bg-surface ' +
  'placeholder:text-ink-subtle ' +
  'focus-visible:border-focus focus-visible:ring-3 focus-visible:ring-focus/25 ' +
  'disabled:cursor-not-allowed disabled:border-border disabled:bg-recessed disabled:text-ink-muted disabled:opacity-100 dark:disabled:bg-recessed ' +
  'aria-invalid:border-danger aria-invalid:ring-3 aria-invalid:ring-danger/18 dark:aria-invalid:border-danger dark:aria-invalid:ring-danger/18';

export const CONTROL_SIZE = {
  md: 'h-[46px] px-3 text-base md:h-[38px] md:text-sm',
  lg: 'h-14 px-3 text-2xl font-semibold tabular-nums md:h-12 md:text-2xl',
} as const;

export type ControlSize = keyof typeof CONTROL_SIZE;

/** Padding extra a la derecha según cuántos adornos (check, candado, toggle) hay. */
export const TRAILING_PADDING = ['', 'pr-10', 'pr-[4.5rem]'] as const;

/** Padding a la izquierda cuando hay prefijo (`$`). */
export const LEADING_PADDING = { md: 'pl-8', lg: 'pl-9' } as const;

export const LABEL_CLASSES = 'text-[13px] leading-tight font-medium text-ink';
export const HELPER_CLASSES = 'text-[13px] leading-snug text-ink-muted';
export const ERROR_CLASSES =
  'flex items-start gap-1.5 text-[13px] leading-snug font-medium text-danger';

/** Target táctil ≥44px para filas clickeables (checkbox, switch, días). */
export const TOUCH_ROW = 'min-h-11 md:min-h-9';
