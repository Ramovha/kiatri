import type { Metadata } from 'next';
import CTAButton from '@/components/CTAButton';
import PricingCard from '@/components/PricingCard';
import { voipPlans } from '@/lib/products';

export const metadata: Metadata = {
  title: 'For Small Business',
  description: 'Get a business phone number working in minutes — no jargon, no long-term contract.',
};

const STEPS = [
  { step: '1', title: 'Pick a plan', description: 'Choose pay-as-you-go or a plan with minutes included.' },
  { step: '2', title: 'Pay online', description: 'Checkout runs through our secure billing portal.' },
  { step: '3', title: 'Start calling', description: 'Your number is set up automatically — no waiting for a technician.' },
];

export default function SmallBusinessPage() {
  return (
    <>
      <div className="border-b border-navy-900/10 bg-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-ember-600">For Small Business</p>
          <h1 className="mt-2 text-3xl font-bold text-navy-900 md:text-4xl">
            Get a business number working in minutes
          </h1>
          <p className="mt-4 max-w-2xl text-navy-700">
            No PBX jargon, no sales call, no long-term contract. Pick a plan, pay online, and start taking
            calls the same day.
          </p>
          <CTAButton href="#plans" className="mt-6">See plans</CTAButton>
        </div>
      </div>

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-6 md:grid-cols-3">
            {STEPS.map(({ step, title, description }) => (
              <div key={step} className="rounded-2xl border border-navy-900/10 bg-white p-6 shadow-card">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ember-500 text-sm font-bold text-white">
                  {step}
                </span>
                <h3 className="mt-4 font-bold text-navy-900">{title}</h3>
                <p className="mt-2 text-sm text-navy-700">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="plans" className="scroll-mt-24 border-t border-navy-900/10 bg-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-bold text-navy-900">Simple plans for a single line</h2>
          <p className="mt-2 max-w-2xl text-navy-700">
            Need more than one line, or a shared team inbox? Take a look at our{' '}
            <a href="/products#pbx" className="font-semibold text-ember-600 hover:text-ember-500">
              Cloud PBX tiers
            </a>{' '}
            instead.
          </p>
          <div className="mt-8 grid max-w-2xl gap-6 sm:grid-cols-2">
            {voipPlans.map((plan) => (
              <PricingCard key={plan.id} plan={plan} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
