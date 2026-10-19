/**
 * Navegación del AppShell (port de `SidebarComponent.menuItems` y de los
 * `data.page` de `app.routes.ts`). Reportes sigue oculto, como en Angular.
 */
import {
  ArrowLeftRight,
  CalendarDays,
  ClipboardCheck,
  LayoutGrid,
  Settings,
  Tent,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react';

import { APP_ROUTES } from '@/shared/constants';
import { NAV_COPY } from '@/shared/layout/copy';

export interface NavItem {
  readonly label: string;
  readonly href: string;
  readonly icon: LucideIcon;
}

export interface NavGroup {
  /** `null` = grupo principal sin título. */
  readonly title: string | null;
  readonly items: readonly NavItem[];
}

const L = NAV_COPY.LABELS;
const PAGES = NAV_COPY.PAGES;

export const NAV_GROUPS: readonly NavGroup[] = [
  {
    title: null,
    items: [
      { label: L.DASHBOARD, href: APP_ROUTES.DASHBOARD, icon: LayoutGrid },
      { label: L.MOVIMIENTOS, href: APP_ROUTES.MOVIMIENTOS, icon: ArrowLeftRight },
      { label: L.CAJAS, href: APP_ROUTES.CAJAS, icon: Wallet },
      { label: L.PERSONAS, href: APP_ROUTES.PERSONAS, icon: Users },
    ],
  },
  {
    title: NAV_COPY.GROUP_ACTIVIDADES,
    items: [
      { label: L.INSCRIPCIONES, href: APP_ROUTES.INSCRIPCIONES, icon: ClipboardCheck },
      { label: L.CAMPAMENTOS, href: APP_ROUTES.CAMPAMENTOS, icon: Tent },
      { label: L.EVENTOS, href: APP_ROUTES.EVENTOS, icon: CalendarDays },
    ],
  },
];

export const NAV_FOOTER_ITEM: NavItem = {
  label: L.CONFIGURACION,
  href: APP_ROUTES.CONFIGURACION,
  icon: Settings,
};

/** Destinos del bottom-nav mobile (el "+" central va a nuevo movimiento). */
export const MOBILE_NAV_ITEMS: readonly NavItem[] = [
  { label: NAV_COPY.MOBILE_LABELS.HOME, href: APP_ROUTES.DASHBOARD, icon: LayoutGrid },
  { label: L.MOVIMIENTOS, href: APP_ROUTES.MOVIMIENTOS, icon: ArrowLeftRight },
  { label: NAV_COPY.MOBILE_LABELS.PERSONAS, href: APP_ROUTES.PERSONAS, icon: Users },
  { label: L.EVENTOS, href: APP_ROUTES.EVENTOS, icon: CalendarDays },
];

export const NEW_MOVIMIENTO_HREF = `${APP_ROUTES.MOVIMIENTOS}/nuevo`;

export interface PageMeta {
  readonly title: string;
}

/** Título por sección (prefijo de ruta): lo usa la barra superior mobile. */
export const PAGE_META: Readonly<Record<string, PageMeta>> = {
  [APP_ROUTES.DASHBOARD]: PAGES.DASHBOARD,
  [APP_ROUTES.PERSONAS]: PAGES.PERSONAS,
  [APP_ROUTES.CAJAS]: PAGES.CAJAS,
  [APP_ROUTES.MOVIMIENTOS]: PAGES.MOVIMIENTOS,
  [APP_ROUTES.INSCRIPCIONES]: PAGES.INSCRIPCIONES,
  [APP_ROUTES.EVENTOS]: PAGES.EVENTOS,
  [APP_ROUTES.CAMPAMENTOS]: PAGES.CAMPAMENTOS,
  [APP_ROUTES.REPORTES]: PAGES.REPORTES,
  [APP_ROUTES.CONFIGURACION]: PAGES.CONFIGURACION,
};

/** ¿`pathname` está dentro de la sección `href`? */
export function isActivePath(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function pageMetaFor(pathname: string): PageMeta | null {
  const key = Object.keys(PAGE_META).find((href) => isActivePath(pathname, href));
  return key ? (PAGE_META[key] ?? null) : null;
}

/** Rutas de formulario: en mobile el bottom-nav cede lugar a la barra de acciones. */
const FORM_ROUTE_SUFFIXES = ['/nuevo', '/crear', '/editar', '/pago', '/registrar'] as const;

export function isFormRoute(pathname: string): boolean {
  return FORM_ROUTE_SUFFIXES.some((suffix) => pathname.endsWith(suffix));
}
