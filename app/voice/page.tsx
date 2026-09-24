import type { Metadata } from 'next';
import PromoBanner from '@/components/PromoBanner';
import VoiceTabsSection from '@/components/VoiceTabsSection';
import CTAButton from '@/components/CTAButton';
import { MapPinIcon, HeadsetIcon, TagIcon } from '@/components/icons';
import { residentialPlans } from '@/lib/products';
import { formatZAR } from '@/lib/format';

// Adapted from app/business/page.tsx's structure (hero banner, trust
// pillars, a plan/option browser, a feature tour, closing CTA) for a
// residential/individual audience — see kiatri-voice-page-prompt context.
// Two top-level tabs live in VoiceTabsSection: Residential (the app-based
// plans, calling/video/messaging via Kiatri's Ringotel-powered softphone —
// no hardware required) and Connect a Phone (for people who want an actual
// cordless handset instead of the app — one option available today, two
// genuinely Coming Soon pending a hardware sourcing decision). Deliberately
// no "Integrations" section here (a business-only concept) and no jargon
// (seats/channels/PBX/trunk) anywhere on this page.

export const metadata: Metadata = {
  title: 'Home Voice',
  description: 'Call, video, and message from our app, or connect your own cordless phone — no jargon, no long contracts.',
};

const PILLARS = [
  {
    icon: TagIcon,
    title: 'No contracts',
    description: 'Cancel anytime — month to month, always.',
  },
  {
    icon: HeadsetIcon,
    title: 'Real local support',
    description: 'A real person in your own time zone, not an offshore ticket queue.',
  },
  {
    icon: MapPinIcon,
    title: 'Keep your number',
    description: 'Bring your existing number across — porting is free on every plan.',
  },
];

const cheapestResidential = [...residentialPlans].sort((a, b) => (a.priceZAR ?? 0) - (b.priceZAR ?? 0))[0];

export default function VoicePage() {
  return (
    <>
      <PromoBanner
        eyebrow="Home Voice"
        headlineLead="A home phone,"
        headlineAccent="made easy."
        description="Call, video, and message from our app — or connect your own cordless phone. No business jargon, no long contracts."
        priceLabel="Home plans start from"
        priceValue={formatZAR(cheapestResidential.priceZAR ?? 0)}
        priceSuffix="/month line fee"
        priceNote="Illustrative — see plans below"
        ctaLabel="See plans"
        ctaHref="#plans"
      />

      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {PILLARS.map(({ icon: Icon, title, description }) => (
            <div key={title} className="rounded-2xl border border-navy-900/10 bg-white p-6 shadow-card">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-900 text-white">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-bold text-navy-900">{title}</h3>
              <p className="mt-2 text-sm text-navy-700">{description}</p>
            </div>
          ))}
        </div>

        <section id="plans" className="scroll-mt-24 mt-14">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-ember-600">Home Voice</p>
            <h2 className="mt-2 text-2xl font-bold text-navy-900">Pick how you want to call</h2>
          </div>
          <div className="mt-8">
            <VoiceTabsSection />
          </div>
          <p className="mt-6 text-center text-sm text-navy-700">
            Need more than one line, or work from home with a team? See our{' '}
            <a href="/business#line" className="font-semibold text-ember-600 hover:text-ember-500">
              business Line Plans
            </a>{' '}
            instead.
          </p>
        </section>

        <div className="mt-14 rounded-2xl bg-navy-100/40 p-8 text-center">
          <h2 className="text-xl font-bold text-navy-900">Running a business instead?</h2>
          <p className="mt-2 text-navy-700">See our seat- and line-based plans built for teams.</p>
          <CTAButton href="/business" className="mt-5">See business plans</CTAButton>
        </div>
      </div>
    </>
  );
}
