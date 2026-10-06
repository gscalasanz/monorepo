import { CircleCheck, Clock, Footprints } from 'lucide-react';

import { StatusBadge } from '@/shared/components/data';
import { CARD_COPY as C } from '@/features/campamentos/constants/copy';
import type { CardBadge } from '@/features/campamentos/helpers/camp-status';

/** Estado temporal del campamento: ícono + texto (nunca solo color). */
export function CampBadge({ badge }: { readonly badge: CardBadge }) {
  switch (badge.kind) {
    case 'upcoming':
      return <StatusBadge tone="info" icon={Clock} label={C.daysShort(badge.days)} />;
    case 'active':
      return <StatusBadge tone="success" icon={Footprints} label={C.ACTIVE} />;
    default:
      return <StatusBadge tone="neutral" icon={CircleCheck} label={C.PAST} />;
  }
}
