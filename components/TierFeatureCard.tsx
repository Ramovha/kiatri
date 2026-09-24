import { CallCenterTier } from '@/lib/products';
import { orderProductUrl, orderBundleUrl } from '@/lib/whmcs';
import { formatZAR, yearlyMonthlyEquivalent, BillingPeriod } from '@/lib/format';
import { CheckIcon } from './icons';
import CTAButton from './CTAButton';

// Renders a tier where every feature carries its own Available/Coming Soon
// status (Call Center Pro, Enterprise) — different from PricingCard (one
// flat checklist, no per-item status) and AddonCard (one status per whole
// card), so it gets its own small component rather than overloading either.
export default function TierFeatureCard({
  tier,
  highlight = false,
  billingPeriod = 'monthly',
}: {
  tier: CallCenterTier;
  highlight?: boolean;
  billingPeriod?: BillingPeriod;
}) {
  const isYearly = billingPeriod === 'yearly';
  const displayPriceZAR =
    typeof tier.priceZAR === 'number' && isYearly ? yearlyMonthlyEquivalent(tier.priceZAR) : tier.priceZAR;

  // Every self-serve tier here is a WHMCS bundle (whmcsBid) — whmcsPid is
  // only checked as a fallback for any tier that hasn't been migrated.
  const isBundle = typeof tier.whmcsBid === 'number';
  const cycle = isYearly ? 'annually' : 'monthly';

  return (
    <div
      className={`flex h-full flex-col rounded-2xl border bg-white p-6 shadow-card ${
        highlight ? 'border-ember-500' : 'border-navy-900/10'
      }`}
    >
      {/* Fixed-height header and price zones — without these, a longer
          tagline/note (Enterprise) pushes its price and features down
          relative to the shorter cards next to it in the same row, so the
          price rows and CTA buttons no longer line up across the grid even
          though the cards are already equal-height overall. */}
      <div className="min-h-[168px]">
        <h3 className="text-lg font-bold text-navy-900">{tier.name}</h3>
        <p className="mt-1 text-sm text-navy-700">{tier.tagline}</p>
        {tier.note && <p className="mt-2 text-xs text-navy-500">{tier.note}</p>}
      </div>

      <div className="min-h-[88px]">
        {typeof displayPriceZAR === 'number' ? (
          <>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-navy-900">{formatZAR(displayPriceZAR)}</span>
              <span className="text-sm text-navy-700">{tier.priceSuffix ?? '/month'}</span>
            </div>
            {isYearly && <p className="mt-1 text-xs font-medium text-ember-600">Billed annually</p>}
            <p className="mt-1 text-xs text-navy-400">Illustrative — see pricing page for details</p>
          </>
        ) : (
          <p className="mt-4 text-2xl font-extrabold text-navy-900">Talk to us</p>
        )}
        {tier.priceNote && <p className="mt-1 text-xs text-navy-700">{tier.priceNote}</p>}
      </div>

      <ul className="mt-5 flex-1 space-y-3 border-t border-navy-900/10 pt-5 text-sm">
        {tier.features.map((feature) => {
          const Icon = feature.icon ?? CheckIcon;
          return (
            <li key={feature.name} className="flex items-start gap-2.5">
              <span
                className={`flex h-7 w-7 flex-none items-center justify-center rounded-lg ${
                  feature.status === 'available' ? 'bg-ember-500/10 text-ember-600' : 'bg-navy-100 text-navy-400'
                }`}
              >
                <Icon className="h-4 w-4" />
              </span>
              <span>
                <span className={feature.status === 'available' ? 'font-medium text-navy-900' : 'font-medium text-navy-400'}>
                  {feature.name}
                </span>
                {feature.status !== 'available' && (
                  <span className="ml-1.5 text-[10px] font-semibold uppercase tracking-wide text-navy-400">
                    Coming soon
                  </span>
                )}
                <span className="block text-xs text-navy-700">{feature.description}</span>
              </span>
            </li>
          );
        })}
      </ul>

      {isBundle ? (
        <CTAButton
          href={orderBundleUrl(tier.whmcsBid as number, cycle)}
          external
          variant={highlight ? 'primary' : 'ghost'}
          className="mt-6 w-full"
        >
          {tier.ctaLabel}
        </CTAButton>
      ) : tier.whmcsPid ? (
        <CTAButton
          href={orderProductUrl(tier.whmcsPid, cycle)}
          external
          variant={highlight ? 'primary' : 'ghost'}
          className="mt-6 w-full"
        >
          {tier.ctaLabel}
        </CTAButton>
      ) : (
        <CTAButton href={tier.ctaHref} variant={highlight ? 'primary' : 'ghost'} className="mt-6 w-full">
          {tier.ctaLabel}
        </CTAButton>
      )}
      {tier.ctaNote && <p className="mt-2 text-center text-xs text-navy-500">{tier.ctaNote}</p>}
      {/* WHMCS's `billingcycle=annually` URL param is confirmed reliable for
          plain products but not confirmed for bundles (bid=) — see the
          KNOWN LIMITATION comment in lib/whmcs.ts. Flag it here rather than
          silently hoping it pre-selects correctly. */}
      {isYearly && isBundle && (
        <p className="mt-2 text-center text-[11px] text-navy-400">
          If Annual isn&apos;t pre-selected at checkout, choose it manually from the billing cycle dropdown there.
        </p>
      )}
    </div>
  );
}
