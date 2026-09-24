import { ComponentType } from 'react';
import HeroIllustration from './HeroIllustration';
import CTAButton from './CTAButton';

// Structurally inspired by a bold-headline / price-highlight / CTA promo
// banner pattern (see COMPETITIVE-POSITIONING.md for what we adopt vs.
// avoid), but with everything actually true: no fabricated "was/now"
// discount (we're not running a real promotion) and no borrowed trust
// badge (a third party's own industry award isn't ours to display) — the
// price shown is real illustrative data from lib/products.ts and the
// illustration is our own original artwork, not a stock photo.
interface PromoPill {
  icon: ComponentType<{ className?: string }>;
  label: string;
}

interface PromoBannerProps {
  eyebrow: string;
  headlineLead: string;
  headlineAccent: string;
  description: string;
  // The price highlight box is optional — pages with no single meaningful
  // price to headline (e.g. a catalog of addons) can omit all four and use
  // `pills` instead.
  priceLabel?: string;
  priceValue?: string;
  priceSuffix?: string;
  priceNote?: string;
  ctaLabel: string;
  ctaHref: string;
  // Floating badge callouts over the illustration — same treatment as the
  // homepage Hero's "Support answered locally" / "Auto-provisioned after
  // payment" badges, reused here rather than inventing a new pattern.
  pills?: PromoPill[];
}

export default function PromoBanner({
  eyebrow,
  headlineLead,
  headlineAccent,
  description,
  priceLabel,
  priceValue,
  priceSuffix,
  priceNote,
  ctaLabel,
  ctaHref,
  pills,
}: PromoBannerProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-navy-100/60 via-white to-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 pb-20 pt-16 md:grid-cols-2 md:items-center md:pb-24 md:pt-20">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-ember-600">{eyebrow}</p>
          <h1 className="mt-3 font-display text-4xl font-bold leading-[1.1] text-navy-900 md:text-5xl">
            {headlineLead} <span className="text-ember-500">{headlineAccent}</span>
          </h1>
          <p className="mt-4 max-w-md text-navy-700">{description}</p>

          {priceValue && (
            <>
              <div className="mt-6 inline-flex items-center gap-4 rounded-2xl border border-navy-900/10 bg-white px-5 py-4 shadow-card">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">{priceLabel}</p>
                  <p className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-navy-900">{priceValue}</span>
                    <span className="text-sm font-medium text-navy-700">{priceSuffix}</span>
                  </p>
                </div>
              </div>
              <p className="mt-1.5 text-xs text-navy-400">{priceNote}</p>
            </>
          )}

          <div className="mt-6">
            <CTAButton href={ctaHref}>{ctaLabel}</CTAButton>
          </div>
        </div>

        <div className="relative hidden justify-self-center md:flex">
          <HeroIllustration className="h-72 w-72" />

          {pills?.map((pill, i) => {
            const Icon = pill.icon;
            return (
              <div
                key={pill.label}
                className={`absolute flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-navy-900 shadow-card ${
                  i === 0 ? '-left-6 top-4' : '-right-4 bottom-8'
                }`}
              >
                <Icon className="h-4 w-4 text-ember-500" />
                <span className="text-xs font-semibold">{pill.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Curved transition into whatever comes next — a decorative wave, not
          tied to any particular section color, since the page body itself
          is the same off-white the wave is filled with. */}
      <svg className="absolute -bottom-px left-0 w-full" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden>
        <path d="M0 60 C 360 0 1080 0 1440 60 L1440 60 L0 60 Z" className="fill-[#F7F8FA]" />
      </svg>
    </div>
  );
}
