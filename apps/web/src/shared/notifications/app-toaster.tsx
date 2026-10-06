'use client';

import { useEffect } from 'react';

import { dismissGlobalError, useGlobalErrors } from '@/shared/api';
import { Toaster } from '@/shared/components/reui/sonner';
import { notify } from '@/shared/notifications/notify';

/**
 * Host de toasts. Además drena el bus de errores globales de `apiClient`
 * (equivalente al snackbar de `errorInterceptor`) y los muestra como error.
 */
export function AppToaster() {
  const errors = useGlobalErrors();

  useEffect(() => {
    for (const error of errors) {
      notify.error(error.message);
      dismissGlobalError(error.id);
    }
  }, [errors]);

  return <Toaster position="top-right" closeButton />;
}
