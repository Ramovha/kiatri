import type { Metadata } from 'next';
import PricingDisclaimer from '@/components/PricingDisclaimer';
import ItemizedPriceRow from '@/components/ItemizedPriceRow';
import { pbxTiers, trunkPlans, voipPlans } from '@/lib/products';
import { formatZAR } from '@/lib/format';
import CTAButton from '@/components/CTAButton';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Itemized Kiatri pricing — seats and calling capacity shown separately, like a phone bill.',
};

// A representative "starting from" combo for the headline: cheapest PBX tier
// + cheapest trunk tier, purely illustrative of how the combined cost reads.
const cheapestPbx = pbxTiers[0];
const cheapestTrunk = trunkPlans[0];
const combinedFrom = cheapestPbx.priceZAR + cheapestTrunk.priceZAR;

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-bold text-navy-900 md:text-4xl">Pricing</h1>
      <p className="mt-3 text-navy-700">
        Most providers bury seats and calling capacity behind one blended number. We show them separately —
        like a phone contract splits the device from the airtime — so you know exactly what you&apos;re
        paying for.
      </p>

      <div className="mt-6 rounded-2xl border border-navy-900/10 bg-white p-6 shadow-card">
        <p className="text-sm text-navy-700">A typical small-office setup starts from</p>
        <p className="mt-1 text-4xl font-extrabold text-navy-900">
          {formatZAR(combinedFrom)}
          <span className="text-base font-normal text-navy-700">/month</span>
        </p>
        <p className="mt-1 text-sm text-navy-700">
          {cheapestPbx.name} ({cheapestPbx.capacity}) + {cheapestTrunk.name} ({cheapestTrunk.minutesIncluded})
        </p>
        <PricingDisclaimer className="mt-4" />
      </div>

      <section className="mt-12">
        <h2 className="text-xl font-bold text-navy-900">Cloud PBX seats</h2>
        <p className="mt-1 text-sm text-navy-700">What you pay for extensions, the admin portal, and instant provisioning.</p>
        <div className="mt-4">
          {pbxTiers.map((plan) => (
            <ItemizedPriceRow key={plan.id} plan={plan} />
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-bold text-navy-900">SIP trunk calling capacity</h2>
        <p className="mt-1 text-sm text-navy-700">What you pay for channels and bulk minutes — sized independently of seats.</p>
        <div className="mt-4">
          {trunkPlans.map((plan) => (
            <ItemizedPriceRow key={plan.id} plan={plan} />
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-bold text-navy-900">Home &amp; small office VoIP lines</h2>
        <p className="mt-1 text-sm text-navy-700">A single SIP line with a bundled minute allowance — no PBX required.</p>
        <div className="mt-4">
          {voipPlans.map((plan) => (
            <ItemizedPriceRow key={plan.id} plan={plan} />
          ))}
        </div>
      </section>

      <div className="mt-14 rounded-2xl bg-navy-950 p-8 text-center text-white">
        <h2 className="text-xl font-bold">Not sure what combination you need?</h2>
        <p className="mt-2 text-navy-200">Tell us your seat count and expected call volume and we&apos;ll size it for you.</p>
        <CTAButton href="/contact" className="mt-5">Talk to us</CTAButton>
      </div>
    </div>
  );
}
