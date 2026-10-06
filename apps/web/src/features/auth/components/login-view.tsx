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
      <div role="status" className="flex min-h-dvh items-center justify-center bg-canvas">
        <Loader2 className="size-6 animate-spin text-ink-muted" aria-hidden />
      </div>
    );
  }
  return (
    <div className="grid min-h-dvh grid-rows-[auto_1fr] bg-canvas md:grid-rows-1 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <LoginHero />
      <main className="relative flex flex-col items-center justify-center px-4 py-10 md:px-10">
        <ThemeToggle className="absolute top-3 right-3 text-ink-muted hover:bg-recessed hover:text-ink" />
        <div className="w-full max-w-[400px] rounded-xl border border-border bg-surface p-6 shadow-xs md:p-8">
          <h1 className="text-[22px] leading-7 font-semibold tracking-[-0.022em] text-ink">
            {C.FORM_TITLE}
          </h1>
          <p className="mt-1 mb-6 text-sm text-ink-muted">{C.FORM_SUBTITLE}</p>
          <LoginForm />
        </div>
        <p className="mt-6 flex gap-2 text-xs text-ink-subtle">
          <span>{C.FOOTER[0]}</span>
          <span aria-hidden>•</span>
          <span>{C.FOOTER[1]}</span>
        </p>
      </main>
    </div>
  );
}
