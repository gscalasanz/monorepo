import { Check } from 'lucide-react';
import Image from 'next/image';

import { AUTH_FEATURE_COPY as C } from '@/features/auth/constants/copy';
import { LAYOUT_COPY } from '@/shared/layout';

const LOGO_SRC = '/images/logo.png';
const LOGO_PX = 56;

/** Panel institucional del login (indigo SAAC + filo burgundy). */
export function LoginHero() {
  return (
    <header className="relative flex flex-col justify-center gap-6 border-t-[3px] border-accent-2 bg-sidebar-bg px-6 py-8 text-sidebar-ink md:px-12 md:py-16">
      <div className="flex items-center gap-4">
        <Image
          src={LOGO_SRC}
          alt={LAYOUT_COPY.LOGO_ALT}
          width={LOGO_PX}
          height={LOGO_PX}
          priority
          className="size-12 rounded-lg bg-surface object-contain p-1 md:size-14"
        />
        <div>
          <p className="text-[22px] leading-7 font-semibold tracking-[-0.02em] md:text-[26px] md:leading-8">
            {C.HERO_TITLE}
          </p>
          <p className="text-sm text-sidebar-ink/80">{C.HERO_TAGLINE}</p>
        </div>
      </div>
      <div className="hidden max-w-md flex-col gap-5 md:flex">
        <p className="text-[15px] leading-6 text-sidebar-ink/85">{C.HERO_DESCRIPTION}</p>
        <ul className="flex flex-col gap-2.5">
          {C.HERO_FEATURES.map((feature) => (
            <li key={feature} className="flex items-center gap-2.5 text-sm">
              <Check className="size-4 shrink-0 text-sidebar-ink/70" aria-hidden />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
