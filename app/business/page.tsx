import type { Metadata } from 'next';
import CTAButton from '@/components/CTAButton';
import { ShieldIcon, HeadsetIcon, ServerRackIcon, CheckIcon } from '@/components/icons';
import { orderProductUrl } from '@/lib/whmcs';
import { pbxTiers } from '@/lib/products';

export const metadata: Metadata = {
  title: 'For Business',
  description: 'SLA-backed hosted VoIP, dedicated support, and custom SIP trunk sizing for South African businesses.',
};

const PILLARS = [
  {
    icon: ShieldIcon,
    title: 'SLA-backed reliability',
    description: '[REPLACE WITH REAL DATA — publish your actual SLA uptime commitment once finalized] with credits if we miss it.',
  },
  {
    icon: HeadsetIcon,
    title: 'Dedicated support contact',
    description: 'A named local support contact for your account, not a rotating ticket queue.',
  },
  {
    icon: ServerRackIcon,
    title: 'Custom trunk sizing',
    description: 'Tell us your peak concurrent call volume and we’ll size channels and minutes to match — no guessing from a generic tier.',
  },
];

const INTEGRATIONS = [
  '[REPLACE WITH REAL DATA — list actual supported CRM/helpdesk integrations]',
  '[REPLACE WITH REAL DATA]',
  '[REPLACE WITH REAL DATA]',
];

export default function BusinessPage() {
  return (
    <>
      <div className="border-b border-navy-900/10 bg-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-ember-600">For Business</p>
          <h1 className="mt-2 text-3xl font-bold text-navy-900 md:text-4xl">
            Built for teams that can&apos;t afford a dropped call
          </h1>
          <p className="mt-4 max-w-2xl text-navy-700">
            SME and enterprise customers get a dedicated support relationship, custom trunk sizing, and
            integration support beyond the self-service tiers.
          </p>
          <CTAButton href="/contact" className="mt-6">Request a custom quote</CTAButton>
        </div>
      </div>

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-6">
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
        </div>
      </section>

      <section className="border-t border-navy-900/10 bg-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-bold text-navy-900">Standard tiers, or a custom build</h2>
          <p className="mt-2 max-w-2xl text-navy-700">
            Start from a standard Cloud PBX tier and layer on custom trunk sizing, or talk to us for a fully
            bespoke setup across multiple sites.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {pbxTiers.map((plan) => (
              <div key={plan.id} className="rounded-2xl border border-navy-900/10 p-6">
                <h3 className="font-bold text-navy-900">{plan.name}</h3>
                <p className="mt-1 text-sm text-navy-700">{plan.capacity} · {plan.minutesIncluded}</p>
                <a
                  href={orderProductUrl(plan.whmcsPid)}
                  className="mt-4 inline-block text-sm font-semibold text-ember-600 hover:text-ember-500"
                >
                  Order this tier →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-bold text-navy-900">Integrations</h2>
          <ul className="mt-4 space-y-2 text-sm text-navy-700">
            {INTEGRATIONS.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <CheckIcon className="mt-0.5 h-4 w-4 flex-none text-ember-500" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
