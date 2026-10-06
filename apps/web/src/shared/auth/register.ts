/**
 * Registra el `AuthBridge` de la sesión en el cliente HTTP. Lo importa
 * `api/api-client.ts` como side-effect, así que cualquier uso de `apiClient`
 * adjunta el token y refresca ante 401, se importe o no `@/shared/auth`.
 * El ciclo api ↔ auth es seguro con ESM: `apiClient` se usa en tiempo de
 * llamada, nunca durante la evaluación de estos módulos.
 */
import { registerAuthBridge } from '@/shared/api/registry';
import { sessionAuthBridge } from '@/shared/auth/bridge';

registerAuthBridge(sessionAuthBridge);
