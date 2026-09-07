import type { Metadata } from 'next';
import { ClockIcon, MapPinIcon, ShieldIcon } from '@/components/icons';

export const metadata: Metadata = {
  title: 'About & Trust',
  description: 'Kiatri is a South African hosted VoIP company — who we are and how our infrastructure is built.',
};

const FACTS = [
  { icon: MapPinIcon, title: 'South African company', description: 'Based and operated in South Africa, serving South African businesses and homes.' },
  { icon: ClockIcon, title: 'Support hours', description: '[REPLACE WITH REAL DATA — confirm actual support hours before publishing]' },
  { icon: ShieldIcon, title: 'Infrastructure', description: 'Redundant SIP infrastructure across multiple points of presence, with automatic failover on our trunk tiers.' },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-sm font-semibold uppercase tracking-wide text-ember-600">About &amp; Trust</p>
      <h1 className="mt-2 text-3xl font-bold text-navy-900 md:text-4xl">A smaller company, on purpose</h1>
      <p className="mt-4 text-navy-700">
        We&apos;re not trying to be the biggest phone company in the world — we&apos;re trying to be the one
        that picks up the phone when you call us. Kiatri runs hosted VoIP and call center services for South
        African homes and businesses, with people you can actually reach behind every account.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {FACTS.map(({ icon: Icon, title, description }) => (
          <div key={title} className="rounded-2xl border border-navy-900/10 bg-white p-6 shadow-card">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-900 text-white">
              <Icon className="h-5 w-5" />
            </span>
            <h3 className="mt-4 font-bold text-navy-900">{title}</h3>
            <p className="mt-2 text-sm text-navy-700">{description}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 space-y-4 text-navy-700">
        <h2 className="text-xl font-bold text-navy-900">How our infrastructure works</h2>
        <p>
          Calls are carried over redundant SIP infrastructure with multiple points of presence and automatic
          failover on our SIP trunk tiers, so a single point of failure doesn&apos;t take your line down. We
          don&apos;t publish internal network topology or server details publicly — if you need infrastructure
          detail for a procurement or compliance review, contact us directly and we&apos;ll work through it
          with you under NDA if required.
        </p>
        <h2 className="text-xl font-bold text-navy-900">Billing &amp; account management</h2>
        <p>
          Orders, invoices, and account management run through our billing portal at{' '}
          <span className="font-medium text-navy-900">calling.kiatri.com</span>. This marketing site links you
          there to check out — it isn&apos;t itself a login or billing system.
        </p>
      </div>
    </div>
  );
}
