import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { TooltipProvider } from '@/shared/components/reui/tooltip';
import { ConfirmDialogHost } from '@/shared/confirm';
import { AppToaster } from '@/shared/notifications';
import { fontVariables } from '@/shared/styles/fonts';
import { DEFAULT_THEME, THEME_INIT_SCRIPT } from '@/shared/theme';
import './globals.css';

export const metadata: Metadata = {
  title: 'Scout · Gestión financiera',
  description: 'Sistema de gestión financiera del grupo scout',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="es-AR" className={fontVariables} data-theme={DEFAULT_THEME} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <TooltipProvider>{children}</TooltipProvider>
        <AppToaster />
        <ConfirmDialogHost />
      </body>
    </html>
  );
}
