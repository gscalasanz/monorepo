import Image from 'next/image';

import { AUTH_FEATURE_COPY as C } from '@/features/auth/constants/copy';
import { LoginContours } from '@/features/auth/components/login-contours';
import { LAYOUT_COPY } from '@/shared/layout';

const LOGO_SRC = '/images/logo.png';
const LOGO_PX = 56;
const INDEX_DIGITS = 2;

function featureIndex(index: number): string {
  return String(index + 1).padStart(INDEX_DIGITS, '0');
}

/** Panel institucional: marca arriba, titular grande y beneficios abajo, sobre curvas de nivel. */
export function LoginHero() {
  return (
    <header className="relative isolate flex flex-col gap-10 overflow-hidden border-b-[3px] border-accent-2 bg-sidebar-bg px-5 pt-6 pb-7 text-sidebar-ink md:justify-between md:border-r-[3px] md:border-b-0 md:px-12 md:py-12">
      <LoginContours className="pointer-events-none absolute -right-24 -bottom-28 -z-10 size-[340px] text-sidebar-ink/15 md:text-sidebar-ink/10 md:-right-40 md:-bottom-40 md:size-[720px]" />
      <div className="flex items-center gap-3.5">
        <Image
          src={LOGO_SRC}
          alt={LAYOUT_COPY.LOGO_ALT}
          width={LOGO_PX}
          height={LOGO_PX}
          priority
          className="size-12 rounded-xl bg-surface object-contain p-1 shadow-sm md:size-14"
        />
        <div>
          <p className="text-xl leading-6 font-semibold tracking-[-0.02em] md:text-[22px] md:leading-7">
            {C.HERO_TITLE}
          </p>
          <p className="text-[13px] text-sidebar-ink/75">{C.HERO_TAGLINE}</p>
        </div>
      </div>
      <div className="hidden max-w-lg flex-col gap-10 md:flex">
        <p className="text-[40px] leading-[1.1] font-semibold tracking-[-0.03em] text-balance lg:text-5xl lg:leading-[1.05]">
          {C.HERO_DESCRIPTION}
        </p>
        <ul className="grid grid-cols-2 gap-x-8 gap-y-5">
          {C.HERO_FEATURES.map((feature, index) => (
            <li
              key={feature}
              className="flex flex-col gap-1.5 border-t border-sidebar-ink/25 pt-3 text-sm"
            >
              <span
                aria-hidden
                className="font-mono text-xs text-sidebar-ink/60 tabular-nums"
              >
                {featureIndex(index)}
              </span>
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
