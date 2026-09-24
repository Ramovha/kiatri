import type { Metadata } from 'next';
import Link from 'next/link';
import PromoBanner from '@/components/PromoBanner';
import PlanBuilder from '@/components/PlanBuilder';
import PricingDisclaimer from '@/components/PricingDisclaimer';
import CTAButton from '@/components/CTAButton';
import { linePlans } from '@/lib/products';
import { formatZAR } from '@/lib/format';

const cheapestLine = [...linePlans].sort((a, b) => (a.priceZAR ?? 0) - (b.priceZAR ?? 0))[0];

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Configure your Cloud PBX, Line, or SIP Trunk setup and see the real monthly cost.',
};

// This page has one job: the interactive "configure and see the cost" tool.
// Browsing/comparing tier cards, the Call Center Pro/Enterprise upsell, and
// the "Which plan fits you" guided quiz all live on /business now — those
// are decision-making/browsing content, not calculating, and mixing them in
// here was the actual source of confusion, not the builder itself. This
// page cross-links to /business for that; /business cross-links back here
// for the exact-cost calculator.

export default function PricingPage() {
  return (
    <>
      <PromoBanner
        eyebrow="Pricing"
        headlineLead="Straightforward pricing,"
        headlineAccent="nothing to decode."
        description="Every plan is priced and ordered separately — no bundled number you can't break down. Build your setup below and see exactly what you're paying for."
        priceLabel="Line plans start from"
        priceValue={formatZAR(cheapestLine.priceZAR ?? 0)}
        priceSuffix="/month line fee"
        priceNote="Illustrative — see the full breakdown below"
        ctaLabel="Build your setup"
        ctaHref="#builder"
      />

      <div className="mx-auto max-w-6xl px-6 py-16">
        <p className="text-sm text-navy-700">
          Want to browse and compare tiers side by side first? See our{' '}
          <Link href="/business#plans" className="font-semibold text-ember-600 hover:text-ember-500">
            Business plans
          </Link>
          .
        </p>

        <div id="builder" className="scroll-mt-24 mt-6">
          <PlanBuilder />
          <PricingDisclaimer className="mt-4" />
        </div>

        <section className="mt-14">
          <div className="flex flex-col items-start gap-4 rounded-2xl border border-navy-900/10 bg-navy-100/40 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-bold text-navy-900">Need more than a line?</h2>
              <p className="mt-1 text-sm text-navy-700">
                Call blocking, a virtual receptionist, virtual fax, and more — browse{' '}
                <Link href="/addons" className="font-semibold text-ember-600 hover:text-ember-500">
                  Addons
                </Link>{' '}
                to attach to any plan above.
              </p>
            </div>
            <CTAButton href="/addons" variant="ghost" className="flex-none">Browse Addons</CTAButton>
          </div>
        </section>
      </div>
    </>
  );
}
