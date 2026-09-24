import type { Metadata } from 'next';
import PromoBanner from '@/components/PromoBanner';
import CTAButton from '@/components/CTAButton';
import AddonCard from '@/components/AddonCard';
import { TagIcon, BoltIcon } from '@/components/icons';
import { addons } from '@/lib/products';

export const metadata: Metadata = {
  title: 'Addons',
  description: 'Attach call blocking, a virtual receptionist, virtual fax, and more to any Kiatri plan.',
};

export default function AddonsPage() {
  return (
    <>
      <PromoBanner
        eyebrow="Addons"
        headlineLead="Small additions,"
        headlineAccent="real problems solved."
        description="Call blocking, a virtual receptionist, virtual fax, and an AI roadmap — small, focused upgrades that each solve one real problem. They attach to any plan on our Pricing page — no need to switch plans to add one."
        ctaLabel="See addons"
        ctaHref="#addons"
        pills={[
          { icon: TagIcon, label: 'No plan switch required' },
          { icon: BoltIcon, label: 'Attach in seconds at checkout' },
        ]}
      />

      <div className="mx-auto max-w-6xl px-6 py-16">
        <div id="addons" className="scroll-mt-24 grid gap-6 md:grid-cols-2">
          {addons.map((addon) => (
            <AddonCard key={addon.id} addon={addon} />
          ))}
        </div>

        <div className="mt-14 rounded-2xl bg-navy-950 p-8 text-center text-white">
          <h2 className="text-xl font-bold">Not sure which addon fits?</h2>
          <p className="mt-2 text-navy-200">Tell us what you&apos;re trying to solve and we&apos;ll point you at the right one.</p>
          <CTAButton href="/contact" className="mt-5">Talk to us</CTAButton>
        </div>
      </div>
    </>
  );
}
