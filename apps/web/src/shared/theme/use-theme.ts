'use client';

import { useEffect } from 'react';
import { useStore } from 'zustand';

import type { ThemeMode } from '@/shared/theme/constants';
import { initializeThemeOnce, themeStore, toggleThemeMode } from '@/shared/theme/theme-store';

interface ThemeView {
  readonly mode: ThemeMode;
  readonly toggle: () => void;
}

/** Modo actual + toggle. Inicializa desde localStorage en el primer mount de la página. */
export function useTheme(): ThemeView {
  const mode = useStore(themeStore, (state) => state.mode);
  useEffect(() => {
    initializeThemeOnce();
  }, []);
  return { mode, toggle: toggleThemeMode };
}
