import { CalendarPlus, Plus, TriangleAlert, UserPlus, type LucideIcon } from 'lucide-react';

import { APP_ROUTES, cajasHref, movimientosHref } from '@/shared/constants';
import { ESTADO_PAGO, TIPO_MOVIMIENTO, type Rama } from '@/shared/domain';

/** Cantidades máximas de las listas (rediseño: 3 eventos, 8 movimientos, 6 deudores). */
export const UPCOMING_EVENTS_LIMIT = 3;
export const RECENT_MOVIMIENTOS_LIMIT = 8;
export const DEBTORS_LIMIT = 6;

export interface QuickAction {
  readonly label: string;
  readonly href: string;
  readonly icon: LucideIcon;
}

/** "Registrar Gasto" de Angular apuntaba a la misma ruta que "Nuevo movimiento": queda una sola entrada. */
export const QUICK_ACTIONS: readonly QuickAction[] = [
  { label: 'Nuevo movimiento', href: `${APP_ROUTES.MOVIMIENTOS}/nuevo`, icon: Plus },
  { label: 'Registrar Inscripción', href: `${APP_ROUTES.INSCRIPCIONES}/crear`, icon: UserPlus },
  { label: 'Crear Evento', href: `${APP_ROUTES.EVENTOS}/crear`, icon: CalendarPlus },
  { label: 'Deudores', href: `${APP_ROUTES.REPORTES}/deudas`, icon: TriangleAlert },
];

/** Color de la pista de cada rama (tokens `--color-rama-*`). */
export const RAMA_TRACK_COLOR: Readonly<Record<Rama, string>> = {
  Manada: 'var(--color-rama-manada)',
  Unidad: 'var(--color-rama-unidad)',
  Caminantes: 'var(--color-rama-caminantes)',
  Rovers: 'var(--color-rama-rovers)',
};

/** Colores de la barra apilada de inscripciones (estado = significado, no ranking). */
export const INSCRIPCION_COLORS = {
  pagadas: 'var(--color-success)',
  bonificadas: 'var(--color-info)',
  parciales: 'var(--color-warning)',
  pendientes: 'var(--color-danger)',
} as const;

export const DEBTORS_REPORT_HREF = `${APP_ROUTES.REPORTES}/deudas`;

export const CAJAS_HREF = cajasHref();
export const INSCRIPCIONES_HREF = APP_ROUTES.INSCRIPCIONES;

/** Los pendientes del panel de tesorería llevan a la lista de movimientos ya filtrada. */
export const PENDING_LINKS = {
  reembolsos: movimientosHref({ tipo: TIPO_MOVIMIENTO.EGRESO, estadoPago: ESTADO_PAGO.PENDIENTE_REEMBOLSO }),
  cobros: movimientosHref({ tipo: TIPO_MOVIMIENTO.INGRESO, estadoPago: ESTADO_PAGO.PENDIENTE_COBRO }),
} as const;
