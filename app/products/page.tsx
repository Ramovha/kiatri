import type { Metadata } from 'next';
import TierGrid from '@/components/TierGrid';
import { voipPlans, pbxTiers, trunkPlans, callCenterFeatures } from '@/lib/products';
import { CheckIcon } from '@/components/icons';
import CTAButton from '@/components/CTAButton';

export const metadata: Metadata = {
  title: 'Products',
  description: 'Cloud PBX seats, SIP trunk calling capacity, and call center features from Kiatri.',
};

export default function ProductsPage() {
  return (
    <>
      <div className="border-b border-navy-900/10 bg-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h1 className="text-3xl font-bold text-navy-900 md:text-4xl">Products</h1>
          <p className="mt-3 max-w-2xl text-navy-700">
            Everything below is priced and ordered separately, then works together — pick a Cloud PBX tier for
            seats, a SIP trunk for calling capacity, and layer on call center features as you grow.
          </p>
        </div>
      </div>

      <TierGrid
        id="pbx"
        eyebrow="Cloud PBX"
        title="Seats, extensions, and a full PBX feature set"
        description="Instant provisioning after order — pick the seat count your team needs today."
        plans={pbxTiers}
      />

      <div className="border-t border-navy-900/10 bg-white">
        <TierGrid
          id="trunks"
          eyebrow="SIP Trunks"
          title="Calling capacity, sized by channels and minutes"
          description="Sold separately from seats, so you can size your calling capacity independently of your headcount — like buying airtime separately from the handset."
          plans={trunkPlans}
        />
      </div>

      <TierGrid
        eyebrow="Home & Small Office VoIP"
        title="Simple SIP lines for a single office or home setup"
        description="Not ready for a full PBX? These entry plans get a real number working in minutes."
        plans={voipPlans}
      />

      <section id="call-center" className="scroll-mt-24 border-t border-navy-900/10 bg-navy-950 py-20 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-ember-400">Call Center</p>
          <h2 className="mt-2 text-3xl font-bold">Queues, IVR, and recording — with more on the way</h2>
          <p className="mt-3 max-w-2xl text-navy-200">
            Built on top of your PBX and trunk, our call center layer covers the essentials today and is
            actively growing. Features marked &ldquo;Roadmap&rdquo; are planned but not live yet — ask us for
            current status before you build a workflow around them.
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {callCenterFeatures.map((feature) => (
              <div
                key={feature.name}
                className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-5"
              >
                <CheckIcon className="mt-0.5 h-5 w-5 flex-none text-ember-400" />
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
                      {feature.status === 'available' ? 'Available' : 'Roadmap'}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-navy-200">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <CTAButton href="/business">Talk to us about call center needs</CTAButton>
          </div>
        </div>
      </section>
    </>
  );
}
