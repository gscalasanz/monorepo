/**
 * Log de desarrollo para errores de contrato: el agente/dev que migra una
 * pantalla necesita ver QUÉ campo no cumplió el schema y en qué endpoint.
 * En producción no se loguea (el usuario ve el toast genérico).
 */
import type { ContractIssue } from '@/shared/api/api-error';

const PRODUCTION = 'production';

export interface ContractViolation {
  readonly method: string;
  readonly endpoint: string;
  readonly issues: readonly ContractIssue[];
}

export function logContractViolation({
  method,
  endpoint,
  issues,
}: ContractViolation): void {
  if (process.env.NODE_ENV === PRODUCTION) return;
  console.error(
    `[api] Respuesta fuera de contrato en ${method} ${endpoint}`,
    issues,
  );
}
