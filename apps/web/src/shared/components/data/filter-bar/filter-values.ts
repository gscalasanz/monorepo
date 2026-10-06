import type { DateRangeValue, FilterValue, FilterValues } from './types';

export function isDateRangeValue(value: FilterValue): value is DateRangeValue {
  return typeof value === 'object' && value !== null;
}

export function isFilterValueActive(value: FilterValue): boolean {
  if (value === undefined) return false;
  if (isDateRangeValue(value)) return Boolean(value.from || value.to);
  return value.trim() !== '';
}

export function hasActiveFilters(values: FilterValues): boolean {
  return Object.values(values).some(isFilterValueActive);
}

/** Nuevo objeto con `key` seteada (o quitada si el valor queda vacío). */
export function setFilterValue(
  values: FilterValues,
  change: { readonly key: string; readonly value: FilterValue },
): FilterValues {
  if (isFilterValueActive(change.value)) {
    return { ...values, [change.key]: change.value };
  }
  return Object.fromEntries(
    Object.entries(values).filter(([key]) => key !== change.key),
  );
}

export function stringValue(value: FilterValue): string {
  return typeof value === 'string' ? value : '';
}

export function rangeValue(value: FilterValue): DateRangeValue {
  return isDateRangeValue(value) ? value : {};
}
