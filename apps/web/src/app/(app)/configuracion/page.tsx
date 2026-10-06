import { AccountProfileCard } from '@/features/auth';
import { ConfiguracionView } from '@/features/configuracion';

export default function ConfiguracionPage() {
  return <ConfiguracionView profileSlot={<AccountProfileCard />} />;
}
