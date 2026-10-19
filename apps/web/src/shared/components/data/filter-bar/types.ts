/** Config de filtros (port de `FilterConfig` / `ChipConfig` de Angular, sin `any`). */
export interface FilterOption {
  readonly value: string;
  readonly label: string;
}

interface FilterFieldBase {
  /** Clave en el objeto de valores. */
  readonly key: string;
  /** Etiqueta visible ("Medio de pago"). */
  readonly label: string;
}

export interface SearchFilterField extends FilterFieldBase {
  readonly type: 'search';
  readonly placeholder?: string;
}

export interface SelectFilterField extends FilterFieldBase {
  readonly type: 'select';
  readonly options: readonly FilterOption[];
}

/** Segmentado inline (Todos / Ingresos / Egresos). `''` = Todos. */
export interface ChipsFilterField extends FilterFieldBase {
  readonly type: 'chips';
  readonly options: readonly FilterOption[];
  /** Texto de la opción "todos" (default "Todos"). `null` = sin opción todos. */
  readonly allLabel?: string | null;
}

export interface DateRangeFilterField extends FilterFieldBase {
  readonly type: 'date-range';
}

export type FilterField =
  | SearchFilterField
  | SelectFilterField
  | ChipsFilterField
  | DateRangeFilterField;

/** Rango de fechas locales `yyyy-MM-dd` (sin construir `Date`). */
export interface DateRangeValue {
  readonly from?: string;
  readonly to?: string;
}

export type FilterValue = string | DateRangeValue | undefined;

export type FilterValues = Readonly<Record<string, FilterValue>>;
