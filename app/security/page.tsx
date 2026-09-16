import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldIcon, MapPinIcon, ClockIcon } from '@/components/icons';

export const metadata: Metadata = {
  title: 'Security & Compliance',
  description: 'How Kiatri handles data protection, call data, infrastructure redundancy, and POPIA compliance.',
};

const FACTS = [
  { icon: ShieldIcon, title: 'Redundant infrastructure', description: 'Multiple points of presence with automatic failover on our SIP trunk tiers.' },
  { icon: MapPinIcon, title: 'Data hosting location', description: '[REPLACE WITH REAL DATA — confirm and disclose actual hosting region/country before publishing]' },
  { icon: ClockIcon, title: 'Uptime commitment', description: '[REPLACE WITH REAL DATA — publish a real, measured SLA figure once finalized]' },
];

export default function SecurityPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-sm font-semibold uppercase tracking-wide text-ember-600">Security &amp; Compliance</p>
      <h1 className="mt-2 text-3xl font-bold text-navy-900 md:text-4xl">How we protect your data and your calls</h1>
      <p className="mt-4 text-navy-700">
        This page summarizes our security and compliance posture in plain language. For the full legal text,
        see our{' '}
        <Link href="/legal/privacy" className="font-medium text-ember-600 hover:text-ember-500">Privacy Policy</Link>{' '}
        and{' '}
        <Link href="/legal/sla" className="font-medium text-ember-600 hover:text-ember-500">SLA &amp; Acceptable Use</Link>{' '}
        policy.
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

      <div className="mt-12 space-y-6 text-navy-700">
        <section>
          <h2 className="text-xl font-bold text-navy-900">POPIA compliance</h2>
          <p className="mt-2">
            Kiatri (Pty) Ltd is the responsible party for personal information processed through the
            Services, in line with South Africa&apos;s Protection of Personal Information Act (POPIA). See
            our <Link href="/legal/privacy" className="font-medium text-ember-600 hover:text-ember-500">Privacy Policy</Link> for what we collect, why, and your rights as a data subject.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-navy-900">Call data &amp; recording</h2>
          <p className="mt-2">
            Call detail records (numbers, duration, timestamps) are processed to provide billing and the
            Services. Where call recording is enabled on your account, it is subject to the consent
            requirements set out in our SLA &amp; Acceptable Use policy — recording a call without the
            required consent is your responsibility to manage, not ours to police on your behalf.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-navy-900">Infrastructure redundancy</h2>
          <p className="mt-2">
            Calls are carried over redundant SIP infrastructure across multiple points of presence, with
            automatic failover on our SIP trunk tiers, so a single point of failure doesn&apos;t take your
            line down. We don&apos;t publish internal network topology or server details publicly — if you
            need infrastructure detail for a procurement or compliance review, contact us directly and
            we&apos;ll work through it with you under NDA if required.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-navy-900">Reporting a security issue</h2>
          <p className="mt-2">
            If you believe you&apos;ve found a security vulnerability affecting Kiatri, contact us directly
            via the <Link href="/contact" className="font-medium text-ember-600 hover:text-ember-500">Contact page</Link> rather than disclosing it publicly, and we&apos;ll respond.
            [REPLACE WITH REAL DATA — publish a dedicated security contact address and response-time
            commitment once established.]
          </p>
        </section>
      </div>
    </div>
  );
}
