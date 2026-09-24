'use client';

import { useEffect, useState } from 'react';
import { CallCenterTier, callCenterTiers, pbxTiers } from '@/lib/products';
import { formatZAR } from '@/lib/format';
import { formatMinutes, includedMinutes } from '@/lib/pricing';
import { CALL_RATE } from '@/lib/site';
import { buildOrderLink, orderSummary } from '@/lib/addons';
import { usePlanAddons } from '@/lib/usePlanAddons';
import { CheckIcon } from './icons';
import AddonToggles from './AddonToggles';
import CTAButton from './CTAButton';
import OrderButton from './OrderButton';

type CardId = 'call-center-essentials' | 'call-center-pro' | 'business-accounts';

// ?agents= comes from the home page widget: 5 or 10 -> Essentials, 25 -> Pro,
// 50 -> the Business Accounts card.
const AGENTS_TO_CARD: Record<string, CardId> = {
  '5': 'call-center-essentials',
  '10': 'call-center-essentials',
  '25': 'call-center-pro',
  '50': 'business-accounts',
};

const cardClasses = (highlight: boolean, emphasise: boolean) =>
  `relative flex h-full flex-col rounded-2xl border bg-white p-6 shadow-card ${
    highlight ? 'border-ember-500 ring-2 ring-ember-500 ring-offset-2 ring-offset-navy-950' : emphasise ? 'border-ember-500' : 'border-navy-900/10'
  }`;

function MatchLabel() {
  return <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ember-600">Matches your team size</p>;
}

function PlanCard({ tier, highlight }: { tier: CallCenterTier; highlight: boolean }) {
  const pbx = pbxTiers.find((plan) => plan.id === tier.pbxTierId)!;
  const minutes = includedMinutes(pbx);
  // Extras attach to the PBX product inside the bundle (same rules as Cloud PBX).
  const extras = usePlanAddons(tier.id, 'pbx');
  return (
    <div className={cardClasses(highlight, !!tier.popular)} data-card={tier.id} data-highlighted={highlight || undefined}>
      {highlight && <MatchLabel />}
      <h3 className="text-lg font-bold text-navy-900">{tier.name}</h3>
      <p className="mt-1 text-sm text-navy-700">{tier.tagline}</p>

      {typeof tier.priceZAR === 'number' ? (
        <div className="mt-4 flex items-baseline gap-1">
          <span className="text-3xl font-extrabold text-navy-900">{formatZAR(tier.priceZAR)}</span>
          <span className="text-sm text-navy-700">/month</span>
        </div>
      ) : (
        <p className="mt-4 text-2xl font-extrabold text-navy-900">Talk to us</p>
      )}
      <p className="mt-1 text-xs text-navy-700">{tier.priceNote}</p>
      {minutes && (
        <p className="mt-3 text-sm font-medium text-navy-900">
          {formatMinutes(minutes)} minutes every month. Keep talking from {CALL_RATE}/min.
        </p>
      )}

      <ul className="mt-5 flex-1 space-y-3 border-t border-navy-900/10 pt-5 text-sm">
        {tier.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5">
            <span className="flex h-7 w-7 flex-none items-center justify-center rounded-lg bg-ember-500/10 text-ember-600">
              <CheckIcon className="h-4 w-4" />
            </span>
            <span className="pt-0.5 font-medium text-navy-900">{feature}</span>
          </li>
        ))}
      </ul>
      {tier.footnote && <p className="mt-3 text-xs text-navy-700">{tier.footnote}</p>}

      {typeof tier.priceZAR !== 'number' ? (
        <CTAButton href="/contact?topic=call-center" variant={tier.popular ? 'primary' : 'ghost'} className="mt-6 w-full">
          Talk to us
        </CTAButton>
      ) : (
      <>
      {/* Same extras rules as Cloud PBX: IVR included, call blocking and fax as toggles. */}
      <AddonToggles family="pbx" selected={extras.selected} onToggle={extras.toggle} compact />

      <p data-testid="order-summary" className="mt-6 text-xs font-semibold text-navy-900">
        {orderSummary(tier.name, 'pbx', extras.selected)}
      </p>
      <OrderButton
        plan={{ whmcsBid: tier.whmcsBid }}
        url={buildOrderLink({ whmcsBid: tier.whmcsBid }, 'pbx', extras.selected)}
        variant={tier.popular ? 'primary' : 'ghost'}
        className="mt-3 w-full"
      >
        Order Now
      </OrderButton>
      </>
      )}
    </div>
  );
}

function BusinessAccountsCard({ highlight }: { highlight: boolean }) {
  return (
    <div className={cardClasses(highlight, false)} data-card="business-accounts" data-highlighted={highlight || undefined}>
      {highlight && <MatchLabel />}
      <h3 className="text-lg font-bold text-navy-900">Larger or multi-site call centres</h3>
      <p className="mt-2 flex-1 text-sm text-navy-700">
        50+ agents, several sites or special routing? One monthly invoice for your whole team, with terms tailored to your
        business.
      </p>
      <CTAButton href="/contact?topic=business-account" className="mt-6 w-full">
        Talk to our business team →
      </CTAButton>
    </div>
  );
}

export default function CallCenterPlans() {
  const [highlight, setHighlight] = useState<CardId | null>(null);

  useEffect(() => {
    const agents = new URLSearchParams(window.location.search).get('agents');
    setHighlight((agents && AGENTS_TO_CARD[agents]) || null);
  }, []);

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {callCenterTiers.map((tier) => (
        <PlanCard key={tier.id} tier={tier} highlight={highlight === tier.id} />
      ))}
      <BusinessAccountsCard highlight={highlight === 'business-accounts'} />
    </div>
  );
}
