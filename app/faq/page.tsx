import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Answers to common questions about Kiatri Cloud PBX, SIP trunks, pricing, and support.',
};

const FAQS: { question: string; answer: ReactNode }[] = [
  {
    question: 'How fast can I actually get set up?',
    answer: (
      <>
        Most orders are provisioned automatically once payment clears — no waiting for a sales call or a
        manual setup queue. See <Link href="/" className="font-medium text-ember-600 hover:text-ember-500">the home page</Link> for how this works.
      </>
    ),
  },
  {
    question: 'Can I keep my existing phone number?',
    answer: (
      <>
        Yes — every plan supports porting your existing number in, alongside the option of a fresh number.
        See <Link href="/numbers" className="font-medium text-ember-600 hover:text-ember-500">Numbers &amp; Porting</Link> for the process and typical timelines.
      </>
    ),
  },
  {
    question: 'Are the prices shown on this site final?',
    answer: (
      <>
        Not yet — every price currently carries an &ldquo;illustrative pricing&rdquo; note while we finish
        costing against real connectivity rates. Confirm the current price at checkout on
        calling.kiatri.com before you order. Details on{' '}
        <Link href="/pricing" className="font-medium text-ember-600 hover:text-ember-500">the Pricing page</Link>.
      </>
    ),
  },
  {
    question: 'What if I outgrow my plan?',
    answer:
      'You can move up a Cloud PBX seat tier or a larger SIP trunk at any time — seats and calling capacity are ordered separately, so you only need to resize whichever one you’ve actually outgrown.',
  },
  {
    question: 'Do I need special hardware?',
    answer:
      'No — bring your own IP phones/softphones, or use ours. Nothing on our plans locks you into buying hardware from us.',
  },
  {
    question: 'Is "local support" really local?',
    answer:
      'Yes — support is answered by our own team in South Africa, in South African business hours, not routed to an offshore ticket queue. Exact hours are listed on the Contact page.',
  },
  {
    question: 'Is my data and call data handled securely?',
    answer: (
      <>
        See our <Link href="/security" className="font-medium text-ember-600 hover:text-ember-500">Security &amp; Compliance</Link> page for how we handle POPIA, call data, and infrastructure redundancy.
      </>
    ),
  },
  {
    question: 'What happens if a payment fails?',
    answer: (
      <>
        Billing and suspension-for-non-payment rules are handled through our billing portal and described in
        our <Link href="/legal/terms" className="font-medium text-ember-600 hover:text-ember-500">Terms of Service</Link>.
      </>
    ),
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-sm font-semibold uppercase tracking-wide text-ember-600">FAQ</p>
      <h1 className="mt-2 text-3xl font-bold text-navy-900 md:text-4xl">Common questions</h1>
      <p className="mt-3 text-navy-700">
        Can&apos;t find what you need here? <Link href="/contact" className="font-medium text-ember-600 hover:text-ember-500">Contact us</Link> directly.
      </p>

      <div className="mt-10 divide-y divide-navy-900/10 rounded-2xl border border-navy-900/10 bg-white shadow-card">
        {FAQS.map(({ question, answer }) => (
          <details key={question} className="group px-6 py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-navy-900 marker:content-none">
              {question}
              <span className="ml-4 flex-none text-ember-500 transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-navy-700">{answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
