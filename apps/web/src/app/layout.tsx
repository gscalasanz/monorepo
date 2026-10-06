import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { fontVariables } from '@/shared/styles/fonts';
import './globals.css';

export const metadata: Metadata = {
  title: 'Scout · Gestión financiera',
  description: 'Sistema de gestión financiera del grupo scout',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="es-AR" className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
