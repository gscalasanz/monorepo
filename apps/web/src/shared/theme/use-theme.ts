'use client';

import { useEffect } from 'react';
import { useStore } from 'zustand';

import type { ThemeMode } from '@/shared/theme/constants';
import { initializeTheme, themeStore, toggleThemeMode } from '@/shared/theme/theme-store';

interface ThemeView {
  readonly mode: ThemeMode;
  readonly toggle: () => void;
}

/** Modo actual + toggle. Inicializa desde localStorage al montar. */
export function useTheme(): ThemeView {
  const mode = useStore(themeStore, (state) => state.mode);
  useEffect(() => {
    initializeTheme();
  }, []);
  return { mode, toggle: toggleThemeMode };
}
