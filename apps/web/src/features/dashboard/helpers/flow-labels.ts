/** Textos del gráfico de evolución: etiqueta del eje X y título del tooltip de cada balde. */
import { DATE_FORMATS, addDays, asLocalDate, formatDate } from '@/shared/time';
import { DAYS_PER_WEEK, FLOW_GRANULARITY, MONTH_LABEL_LENGTH, type FlowGranularity } from '@/features/dashboard/constants/chart';
import { monthName } from '@/features/dashboard/helpers/cash-flow';

interface BucketRef {
  readonly key: string;
  readonly granularity: FlowGranularity;
}

const shortDate = (key: string): string => formatDate(key, DATE_FORMATS.dayMonth).replace('.', '');

export function bucketLabel({ key, granularity }: BucketRef): string {
  return granularity === FLOW_GRANULARITY.MES ? monthName(key).slice(0, MONTH_LABEL_LENGTH) : shortDate(key);
}

export function bucketTitle({ key, granularity }: BucketRef): string {
  if (granularity === FLOW_GRANULARITY.DIA) return formatDate(key, DATE_FORMATS.dateLong);
  if (granularity === FLOW_GRANULARITY.SEMANA) {
    return `Semana del ${shortDate(key)} al ${shortDate(addDays(asLocalDate(key), DAYS_PER_WEEK - 1))}`;
  }
  return `${monthName(key)} ${key.slice(0, 4)}`;
}
