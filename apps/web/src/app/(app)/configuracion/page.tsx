import { AccountProfileCard, AccountSecurityCard } from '@/features/auth';
import { ConfiguracionView } from '@/features/configuracion';

export default function ConfiguracionPage() {
  return (
    <ConfiguracionView
      profileSlot={<AccountProfileCard />}
      securitySlot={<AccountSecurityCard />}
    />
  );
}
