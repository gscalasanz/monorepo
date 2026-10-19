'use client';

import { Loader2 } from 'lucide-react';

import { useRedirectIfAuthenticated } from '@/shared/auth';
import { AUTH_FEATURE_COPY as C } from '@/features/auth/constants/copy';
import { LoginForm } from '@/features/auth/components/login-form';
import { LoginHero } from '@/features/auth/components/login-hero';
import { ThemeToggle } from '@/shared/layout';

/** Pantalla de login (público). Con sesión válida redirige al dashboard. */
export function LoginView() {
  const { status } = useRedirectIfAuthenticated();
  if (status !== 'allowed') {
    return (
      <div
        role="status"
        className="flex min-h-dvh items-center justify-center bg-canvas"
      >
        <Loader2 className="size-6 animate-spin text-ink-muted" aria-hidden />
      </div>
    );
  }
  return (
    <div className="relative grid min-h-dvh grid-rows-[auto_1fr] bg-surface md:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] md:grid-rows-1">
      <ThemeToggle className="absolute top-3 right-3 z-10 text-sidebar-ink/80 hover:bg-sidebar-ink/10 hover:text-sidebar-ink md:text-ink-muted md:hover:bg-recessed md:hover:text-ink" />
      <LoginHero />
      <main className="flex flex-col items-center px-5 pt-8 pb-8 md:justify-center md:px-12 md:py-12">
        <div className="w-full max-w-[380px]">
          <h1 className="text-[26px] leading-8 font-semibold tracking-[-0.025em] text-ink md:text-[28px] md:leading-9">
            {C.FORM_TITLE}
          </h1>
          <p className="mt-1.5 mb-8 text-[15px] text-ink-muted">
            {C.FORM_SUBTITLE}
          </p>
          <LoginForm />
          <p className="mt-10 flex flex-wrap gap-x-2 border-t border-border pt-5 text-xs text-ink-subtle">
            <span>{C.FOOTER[0]}</span>
            <span aria-hidden>•</span>
            <span>{C.FOOTER[1]}</span>
          </p>
        </div>
      </main>
    </div>
  );
}
