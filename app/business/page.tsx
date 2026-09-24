import type { Metadata } from 'next';
import PromoBanner from '@/components/PromoBanner';
import PlanCategoryTabs, { PlanCategory } from '@/components/PlanCategoryTabs';
import PlanPicker from '@/components/PlanPicker';
import CTAButton from '@/components/CTAButton';
import { faxOnlyCardIfAvailable } from '@/components/FaxOnlyCard';
import ExistingCustomerLine from '@/components/ExistingCustomerLine';
import FeatureTabs, { FeatureTab } from '@/components/FeatureTabs';
import { HeadsetIcon, ServerRackIcon } from '@/components/icons';
import { pbxTiers, trunkPlans, linePlans } from '@/lib/products';
import { formatZAR } from '@/lib/format';

const cheapestPbx = [...pbxTiers].sort((a, b) => (a.priceZAR ?? 0) - (b.priceZAR ?? 0))[0];
const popularTrunk = trunkPlans.find((plan) => plan.popular) ?? trunkPlans[0];
const popularLine = linePlans.find((plan) => plan.popular) ?? linePlans[0];

// The tabbed tier browser — moved here from /pricing, which is now the
// interactive "configure and see the cost" calculator instead. This is
// where people land to compare the actual tier cards side by side.
const PLAN_CATEGORIES: PlanCategory[] = [
  {
    id: 'voip',
    label: 'VoIP Plans',
    description:
      'Seats, extensions, and a full PBX feature set on every tier — pick the seat count and bundled minutes that match your team. From small teams to full departments — pick the tier that matches your business size.',
    plans: pbxTiers,
  },
  {
    id: 'line',
    label: 'Line Plans',
    description: 'A single business phone line — no PBX needed. Pick your bundled minutes.',
    plans: linePlans,
    visualizerPlan: popularLine,
    footer: faxOnlyCardIfAvailable(),
  },
  {
    id: 'trunks',
    label: 'SIP Trunk Plans',
    description:
      'Bulk calling capacity for a PBX or PABX you already run, sized by channels and bulk minutes instead of seats.',
    plans: trunkPlans,
    visualizerPlan: popularTrunk,
  },
];

// NOTE: this page carries the browsing/deciding content for PBX/Line/Trunk —
// the narrative trust pillars, the tabbed tier browser (PLAN_CATEGORIES
// above), the VoIP Business Services feature tour, and the "Which plan fits
// you" guided quiz at the very bottom. The Call Center Pro/Enterprise/AI
// Receptionist content moved to its own page — /call-center — since it
// outgrew being a section here. /pricing is the interactive "configure and
// see the exact cost" calculator, and cross-links back here for browsing.

export const metadata: Metadata = {
  title: 'For Business',
  description: 'SLA-backed hosted VoIP, dedicated support, and custom SIP trunk sizing for South African businesses.',
};

const PILLARS = [
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

const FEATURE_TABS: FeatureTab[] = [
  {
    id: 'portal',
    label: 'Client Portal',
    title: 'One login for your whole account',
    description:
      'Manage numbers, SIP credentials, and voicemail settings, export call log reports, and raise support tickets — all from one web portal.',
    bullets: [
      'Manage DIDs and SIP credentials',
      'Export CDR / call log reports',
      'Raise and track support tickets',
    ],
  },
  {
    id: 'voicemail',
    label: 'Voicemail to Email',
    title: 'Never miss a message',
    description: 'Voicemails are delivered straight to your inbox as an audio attachment, so nothing sits unheard on a handset.',
    bullets: ['Delivered as an email attachment', 'Works for every extension', 'No extra app to check'],
  },
  {
    id: 'callerid',
    label: 'Caller ID',
    title: "Know who's calling, control what they see",
    description: 'Inbound caller ID passes straight through to your extensions, and you can set your outbound caller ID per line.',
    bullets: ['Inbound caller ID on every extension', 'Set outbound caller ID per line or user'],
  },
  {
    id: 'forwarding',
    label: 'Call Forwarding',
    title: 'Calls follow you, not the other way around',
    description: 'Forward to a cellphone or another extension on no-answer, with separate rules for business hours and after hours.',
    bullets: ['Forward on no-answer or busy', 'Different rules for after-hours'],
  },
  {
    id: 'ringgroups',
    label: 'Ring Groups',
    title: 'Route by team, not by person',
    description: 'Ring multiple extensions at once or in sequence, so a call reaches the first available person on the right team.',
    bullets: ['Ring simultaneously or in sequence', 'Route by department'],
  },
  {
    id: 'failover',
    label: 'Failover Routing',
    title: 'Calls still connect if something drops',
    description: 'If your primary destination is unreachable, calls automatically fail over to a backup number so you never just miss it.',
    bullets: ['Automatic failover to a backup destination', 'No manual switch-over needed'],
  },
];

export default function BusinessPage() {
  return (
    <>
      <PromoBanner
        eyebrow="For Business"
        headlineLead="Built for teams"
        headlineAccent="that can't afford a dropped call."
        description="SME and enterprise customers get a dedicated support relationship, custom trunk sizing, and integration support beyond the self-service tiers."
        priceLabel="Business plans start from"
        priceValue={formatZAR(cheapestPbx.priceZAR ?? 0)}
        priceSuffix="/month"
        priceNote="Illustrative — build your exact cost on Pricing"
        ctaLabel="See plans"
        ctaHref="#plans"
      />

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-6 md:grid-cols-2">
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

      <section id="plans" className="scroll-mt-24 border-t border-navy-900/10 bg-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-ember-600">Plans</p>
            <h2 className="mt-2 text-2xl font-bold text-navy-900">Pick a plan type</h2>
          </div>
          <div className="mt-8">
            <PlanCategoryTabs categories={PLAN_CATEGORIES} />
          </div>
          <ExistingCustomerLine className="mt-6" />
          <p className="mt-3 text-center text-sm text-navy-700">
            Want to see the exact monthly total as you configure it? Try our{' '}
            <a href="/pricing#builder" className="font-semibold text-ember-600 hover:text-ember-500">
              cost calculator
            </a>
            . Need queues, IVR, or recording on top? See{' '}
            <a href="/call-center" className="font-semibold text-ember-600 hover:text-ember-500">
              Call Center
            </a>
            .
          </p>
        </div>
      </section>

      <section className="border-t border-navy-900/10 bg-white py-14">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-start gap-4 rounded-2xl border border-navy-900/10 bg-navy-100/40 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-bold text-navy-900">Need something custom or multi-site?</h2>
              <p className="mt-1 text-sm text-navy-700">
                We&apos;ll size trunk and seat count to match a bespoke or multi-location setup, backed by a
                dedicated support contact — beyond the standard tiers above.
              </p>
            </div>
            <CTAButton href="/contact" variant="secondary" className="flex-none">Request a custom quote</CTAButton>
          </div>
        </div>
      </section>

      <section className="bg-navy-950 py-20 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-ember-400">Every Kiatri account includes</p>
          <h2 className="mt-2 text-3xl font-bold">VoIP Business Services</h2>
          <p className="mt-3 max-w-2xl text-navy-200">
            The features underneath every plan — click through to see what your account can do out of the box.
          </p>
          <div className="mt-10">
            <FeatureTabs tabs={FEATURE_TABS} />
          </div>
        </div>
      </section>

      <section id="quiz" className="scroll-mt-24 border-t border-navy-900/10 bg-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-ember-600">Not sure?</p>
            <h2 className="mt-2 text-2xl font-bold text-navy-900">Which plan fits you</h2>
            <p className="mx-auto mt-2 max-w-md text-navy-700">
              Answer a few quick questions and we&apos;ll point you at the right tier — no new pricing, just a
              shortcut to what&apos;s already above.
            </p>
          </div>
          <div className="mx-auto mt-8 max-w-xl">
            <PlanPicker />
          </div>
        </div>
      </section>
    </>
  );
}
