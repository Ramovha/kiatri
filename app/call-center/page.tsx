import type { Metadata } from 'next';
import PromoBanner from '@/components/PromoBanner';
import CallCenterLicenceTabs from '@/components/CallCenterLicenceTabs';
import CTAButton from '@/components/CTAButton';
import { CheckIcon } from '@/components/icons';
import { callCenterFeatures, callCenterTiers } from '@/lib/products';
import { formatZAR } from '@/lib/format';

// This content moved here from /business (which moved it here from /pricing
// in an earlier pass) — it outgrew being a section on either page. The AI
// Virtual Receptionist card that used to sit standalone below the tiers is
// now folded into Enterprise's own feature list instead (see
// lib/products.ts) — no more duplicate card for the same feature.

const essentialsTier = callCenterTiers.find((tier) => tier.id === 'call-center-essentials')!;

export const metadata: Metadata = {
  title: 'Call Center',
  description: 'Queues, IVR, recording, and more — the call center layer built on top of your PBX and trunk.',
};

export default function CallCenterPage() {
  return (
    <>
      <PromoBanner
        eyebrow="Call Center"
        headlineLead="The layer that turns your PBX"
        headlineAccent="into a real contact center."
        description="Built on top of your PBX and trunk, our call center layer covers the essentials today and is actively growing — queues, IVR, and recording now, with real-time dashboards, transcription, and more on the roadmap."
        priceLabel="Call Center starts from"
        priceValue={formatZAR(essentialsTier.priceZAR ?? 0)}
        priceSuffix={essentialsTier.priceSuffix ?? '/month'}
        priceNote={essentialsTier.priceNote ?? 'Illustrative pricing'}
        ctaLabel="See tiers"
        ctaHref="#tiers"
      />

      <div className="mx-auto max-w-6xl px-6 py-16">
        <section
          className="relative overflow-hidden rounded-3xl bg-navy-950 px-6 py-16 text-white sm:px-10"
        >
          {/* Distinct accent + background texture for this section — the
              "advanced layer" of the site, so it shouldn't look identical to
              every other dark section (see tailwind.config.ts `signal` color). */}
          <div
            className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-signal-500/20 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,193,163,0.12),_transparent_55%)]"
            aria-hidden
          />
          <div className="relative">
            <div id="tiers" className="scroll-mt-24">
              <p className="text-sm font-semibold uppercase tracking-wide text-signal-400">Pricing</p>
              <h3 className="mt-2 text-2xl font-bold">Pick how you want to license it</h3>
              <div className="mt-6">
                <CallCenterLicenceTabs />
              </div>
            </div>

            <div className="mt-16 border-t border-white/10 pt-14">
              <h2 className="text-3xl font-bold">Queues, IVR, and recording — with more on the way</h2>
              <p className="mt-3 max-w-2xl text-navy-200">
                Features marked &ldquo;Coming Soon&rdquo; are planned but not live yet — ask us for current status
                before you build a workflow around them.
              </p>
              <div className="mt-10 grid gap-4 md:grid-cols-2">
                {callCenterFeatures.map((feature) => {
                  const Icon = feature.icon ?? CheckIcon;
                  return (
                    <div
                      key={feature.name}
                      className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-5"
                    >
                      <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-signal-500/15 text-signal-300">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{feature.name}</h3>
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                              feature.status === 'available'
                                ? 'bg-emerald-400/15 text-emerald-300'
                                : 'bg-white/10 text-navy-200'
                            }`}
                          >
                            {feature.status === 'available' ? 'Available' : 'Coming Soon'}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-navy-200">{feature.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-10">
              <CTAButton href="/contact">Talk to us about call center needs</CTAButton>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
