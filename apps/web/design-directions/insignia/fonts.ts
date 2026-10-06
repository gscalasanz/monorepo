// Fuentes de la dirección "insignia" (ver DESIGN.md). `design:apply` copia este
// archivo a src/shared/styles/fonts.ts. Las variables pisan las de tokens.css
// porque next/font las declara en una clase sobre <html> (más específica que :root).
import { Geist, Geist_Mono } from 'next/font/google';

const sans = Geist({ subsets: ['latin'], weight: ['400', '500', '600'], display: 'swap', variable: '--font-sans' });
const display = Geist({ subsets: ['latin'], weight: ['500', '600'], display: 'swap', variable: '--font-display' });
const mono = Geist_Mono({ subsets: ['latin'], weight: ['400', '500'], display: 'swap', variable: '--font-mono' });

export const fontVariables = [sans.variable, display.variable, mono.variable].join(' ');
