import type { Metadata } from 'next';
import Link from 'next/link';
import CTAButton from '@/components/CTAButton';
import { CheckIcon } from '@/components/icons';

export const metadata: Metadata = {
  title: 'Numbers & Porting',
  description: 'Get a new South African number or port your existing number into Kiatri.',
};

const PORT_STEPS = [
  { step: '1', title: 'Tell us the number', description: 'Give us the number you want to port and which account it currently sits on.' },
  { step: '2', title: 'Sign the porting authorization', description: 'A short form authorizing the transfer from your current provider — we’ll send it to you.' },
  { step: '3', title: 'We handle the rest', description: 'We submit the port request to your current provider and keep you updated on progress.' },
  { step: '4', title: 'Number goes live on Kiatri', description: 'Once accepted, your number starts routing through your Kiatri plan — typically with no downtime in between.' },
];

export default function NumbersPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-sm font-semibold uppercase tracking-wide text-ember-600">Numbers &amp; Porting</p>
      <h1 className="mt-2 text-3xl font-bold text-navy-900 md:text-4xl">Get a number, or bring the one you have</h1>
      <p className="mt-4 text-navy-700">
        Every Kiatri plan includes at least one number. You can take a new one from us, or port an existing
        number in from another provider — both are handled as part of ordering, no extra product to buy.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-navy-900/10 bg-white p-6 shadow-card">
          <h2 className="font-bold text-navy-900">Get a new number</h2>
          <p className="mt-2 text-sm text-navy-700">
            Included with every plan. Pick your plan on{' '}
            <Link href="/pricing" className="font-medium text-ember-600 hover:text-ember-500">Pricing</Link>{' '}
            and a number is assigned as part of setup — no separate DID search tool on this site yet;
            tell us your preferred area code when you order and we&apos;ll match you as closely as we can.
          </p>
        </div>
        <div className="rounded-2xl border border-navy-900/10 bg-white p-6 shadow-card">
          <h2 className="font-bold text-navy-900">Port your existing number</h2>
          <p className="mt-2 text-sm text-navy-700">
            Keep the number your customers already know. Porting is supported on every plan at no extra
            charge — see the steps below for how it works.
          </p>
        </div>
      </div>

      <div className="mt-14">
        <h2 className="text-xl font-bold text-navy-900">How porting works</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {PORT_STEPS.map(({ step, title, description }) => (
            <div key={step} className="flex gap-4">
              <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-ember-500 text-sm font-bold text-white">
                {step}
              </span>
              <div>
                <h3 className="font-semibold text-navy-900">{title}</h3>
                <p className="mt-1 text-sm text-navy-700">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 rounded-2xl border border-navy-900/10 bg-white p-6 shadow-card">
        <h2 className="font-bold text-navy-900">Good to know before you port</h2>
        <ul className="mt-3 space-y-2 text-sm text-navy-700">
          <li className="flex items-start gap-2">
            <CheckIcon className="mt-0.5 h-4 w-4 flex-none text-ember-500" />
            Keep your existing service active until the port completes, to avoid a gap in service.
          </li>
          <li className="flex items-start gap-2">
            <CheckIcon className="mt-0.5 h-4 w-4 flex-none text-ember-500" />
            Account details on the port request must match your current provider&apos;s records exactly, or
            the port will be rejected and need to be resubmitted.
          </li>
        </ul>
      </div>

      <div className="mt-12 rounded-2xl bg-navy-950 p-8 text-center text-white">
        <h2 className="text-xl font-bold">Ready to move your number over?</h2>
        <p className="mt-2 text-navy-200">Order a plan and mention porting, or talk to us first if you want to check timelines.</p>
        <div className="mt-5 flex flex-wrap justify-center gap-4">
          <CTAButton href="/pricing">See pricing</CTAButton>
          <CTAButton href="/contact" variant="ghost" className="border-white/25 text-white hover:border-white/60">
            Ask us first
          </CTAButton>
        </div>
      </div>
    </div>
  );
}
