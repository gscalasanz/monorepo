// Fuentes de la dirección "bitacora" (ver DESIGN.md). `design:apply` copia este
// archivo a src/shared/styles/fonts.ts. Las variables pisan las de tokens.css
// porque next/font las declara en una clase sobre <html> (más específica que :root).
import { IBM_Plex_Mono, IBM_Plex_Sans, Newsreader } from 'next/font/google';

const sans = IBM_Plex_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'], display: 'swap', variable: '--font-sans' });
const display = Newsreader({ subsets: ['latin'], axes: ['opsz'], display: 'swap', variable: '--font-display' });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], display: 'swap', variable: '--font-mono' });

export const fontVariables = [sans.variable, display.variable, mono.variable].join(' ');
