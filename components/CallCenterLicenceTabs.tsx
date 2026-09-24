'use client';

import { useState } from 'react';
import { callCenterTiers, CallCenterTier } from '@/lib/products';
import TierFeatureCard from './TierFeatureCard';
import PillTabs from './PillTabs';
import BillingPeriodToggle from './BillingPeriodToggle';
import { BillingPeriod } from '@/lib/format';
import { ClockIcon } from './icons';

type LicenceType = 'named' | 'usage' | 'concurrent';

const LICENCE_TABS = [
  { id: 'named', label: 'Named' },
  { id: 'usage', label: 'Usage-Based' },
  { id: 'concurrent', label: 'Concurrent' },
];

// Swaps a tier's pricing display for its Usage-Based figures (fixed PBX +
// base fee, then per-minute) without touching its features/ctaLabel —
// licence type changes HOW you pay, not WHAT you get. The Usage-Based
// version is still its own distinct WHMCS bundle (whmcsBid), since the
// billing mechanism differs from the Named flat total. Tiers with no
// `usagePricing` (Enterprise) render unchanged, since it's a custom quote
// either way.
function toUsageView(tier: CallCenterTier): CallCenterTier {
  if (!tier.usagePricing) return tier;
  return {
    ...tier,
    priceZAR: tier.usagePricing.baseZAR,
    priceSuffix: tier.usagePricing.baseSuffix,
    priceNote: tier.usagePricing.priceNote,
    whmcsBid: tier.usagePricing.whmcsBid ?? tier.whmcsBid,
  };
}

// Named and Usage-Based are both real, live pricing today — confirmed via
// ictVoIP Billing's Package Management (per-extension metered billing with
// rate structures, free minutes, and markup already supported — the same
// engine powering Line Plans Pay-As-You-Go). Concurrent is the one
// genuinely Coming Soon licence type: our current extension model assigns
// billing to fixed, named extensions, not a floating pool, and that needs
// Hot Desking to ship first.
export default function CallCenterLicenceTabs() {
  const [tab, setTab] = useState<LicenceType>('named');
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly');

  return (
    <div>
      <PillTabs options={LICENCE_TABS} activeId={tab} onChange={(id) => setTab(id as LicenceType)} />

      {tab !== 'concurrent' && (
        <div className="mt-6">
          <BillingPeriodToggle billingPeriod={billingPeriod} onChange={setBillingPeriod} />
        </div>
      )}

      {tab === 'named' && (
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {callCenterTiers.map((tier) => (
            <TierFeatureCard
              key={tier.id}
              tier={tier}
              highlight={tier.id === 'call-center-pro'}
              billingPeriod={billingPeriod}
            />
          ))}
        </div>
      )}

      {tab === 'usage' && (
        <>
          <p className="mx-auto mt-6 max-w-2xl text-center text-navy-700">
            Same bundle, same seat count — just a smaller fixed base plus metered per-minute billing instead
            of one flat total, built on the same metered engine as our Line Plans.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {callCenterTiers.map((tier) => (
              <TierFeatureCard
                key={tier.id}
                tier={toUsageView(tier)}
                highlight={tier.id === 'call-center-pro'}
                billingPeriod={billingPeriod}
              />
            ))}
          </div>
        </>
      )}

      {tab === 'concurrent' && (
        <ComingSoonPanel
          title="Concurrent licensing"
          description="Pay for simultaneous active seats, not your total headcount. This depends on Hot Desking (Coming Soon above) shipping first: our current extension model assigns billing to fixed, named extensions, not a floating pool — concurrent licensing needs agents to log in from any device rather than a fixed extension."
        />
      )}
    </div>
  );
}

function ComingSoonPanel({ title, description }: { title: string; description: string }) {
  return (
    <div className="mx-auto mt-8 max-w-lg rounded-2xl border border-dashed border-navy-900/15 bg-navy-100/30 p-8 text-center">
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-navy-400">
        <ClockIcon className="h-3.5 w-3.5" />
        Coming soon
      </span>
      <h3 className="mt-3 font-display text-lg font-bold text-navy-900">{title}</h3>
      <p className="mt-2 text-sm text-navy-700">{description}</p>
      <span className="mt-5 inline-flex items-center justify-center rounded-full border border-navy-900/15 px-6 py-3 text-sm font-semibold text-navy-400">
        Notify me
      </span>
    </div>
  );
}
