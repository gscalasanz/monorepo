// Fuentes de la dirección "fogon" (ver DESIGN.md). `design:apply` copia este
// archivo a src/shared/styles/fonts.ts. Las variables pisan las de tokens.css
// porque next/font las declara en una clase sobre <html> (más específica que :root).
import { Bricolage_Grotesque, Geist, Geist_Mono } from 'next/font/google';

const sans = Geist({ subsets: ['latin'], weight: ['400', '500', '600', '700'], display: 'swap', variable: '--font-sans' });
const display = Bricolage_Grotesque({ subsets: ['latin'], axes: ['opsz'], display: 'swap', variable: '--font-display' });
const mono = Geist_Mono({ subsets: ['latin'], weight: ['400', '500'], display: 'swap', variable: '--font-mono' });

export const fontVariables = [sans.variable, display.variable, mono.variable].join(' ');
