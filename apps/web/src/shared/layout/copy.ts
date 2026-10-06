/** Copy del AppShell. */
export const LAYOUT_COPY = {
  APP_NAME: 'Scout Finance',
  APP_SUBTITLE: 'Sistema de Gestión',
  LOGO_ALT: 'Grupo Scout Calasanz',
  NAV_LABEL: 'Navegación principal',
  MOBILE_NAV_LABEL: 'Navegación rápida',
  COLLAPSE: 'Colapsar menú',
  EXPAND: 'Expandir menú',
  OPEN_MENU: 'Abrir menú de navegación',
  LOGOUT: 'Cerrar sesión',
  NEW_MOVIMIENTO: 'Nuevo movimiento',
  THEME_TO_DARK: 'Cambiar a tema oscuro',
  THEME_TO_LIGHT: 'Cambiar a tema claro',
  DEFAULT_USER: 'Usuario',
  CHECKING_SESSION: 'Verificando sesión…',
  BACK: 'Volver',
} as const;

/** Etiquetas del menú y título/subtítulo por sección (port de `menuItems` + `data.page`). */
export const NAV_COPY = {
  LABELS: {
    DASHBOARD: 'Dashboard',
    MOVIMIENTOS: 'Movimientos',
    CAJAS: 'Gestión Financiera',
    PERSONAS: 'Gestión de Personas',
    INSCRIPCIONES: 'Inscripciones',
    CAMPAMENTOS: 'Campamentos',
    EVENTOS: 'Eventos',
    CONFIGURACION: 'Configuración',
  },
  MOBILE_LABELS: {
    HOME: 'Inicio',
    PERSONAS: 'Personas',
  },
  GROUP_ACTIVIDADES: 'Actividades',
  PAGES: {
    DASHBOARD: {
      title: 'Dashboard',
      subtitle: 'Bienvenido al Sistema de Gestión Financiera Scout',
    },
    PERSONAS: {
      title: 'Gestión de Personas',
      subtitle: 'Administra protagonistas, educadores y personas externas',
    },
    CAJAS: {
      title: 'Gestión Financiera',
      subtitle: 'Administra cajas, fondos de rama y cuentas personales',
    },
    MOVIMIENTOS: {
      title: 'Movimientos',
      subtitle: 'Visualiza y gestiona los movimientos financieros',
    },
    INSCRIPCIONES: {
      title: 'Inscripciones',
      subtitle: 'Gestión de inscripciones Scout Argentina y de grupo',
    },
    EVENTOS: { title: 'Eventos', subtitle: 'Organiza los eventos del grupo' },
    CAMPAMENTOS: {
      title: 'Campamentos',
      subtitle: 'Planifica y gestiona los campamentos del grupo',
    },
    REPORTES: { title: 'Reportes', subtitle: 'Genera y visualiza reportes del grupo' },
    CONFIGURACION: {
      title: 'Configuración',
      subtitle: 'Configura los parámetros del sistema',
    },
  },
} as const;

export const LOGO_SRC = '/images/logo.png';
