import { Plan } from '@/lib/products';
import { orderProductUrl } from '@/lib/whmcs';
import { formatZAR, yearlyMonthlyEquivalent, BillingPeriod } from '@/lib/format';
import { CheckIcon } from './icons';
import CTAButton from './CTAButton';

export default function PricingCard({
  plan,
  billingPeriod = 'monthly',
  highlighted = false,
}: {
  plan: Plan;
  billingPeriod?: BillingPeriod;
  // Set when the visitor arrived with a team size (e.g. /business?users=10)
  // so the matching tier stands out from its neighbours.
  highlighted?: boolean;
}) {
  const isYearly = billingPeriod === 'yearly';
  const displayPriceZAR =
    typeof plan.priceZAR === 'number' && isYearly ? yearlyMonthlyEquivalent(plan.priceZAR) : plan.priceZAR;

  return (
    <div
      className={`relative flex h-full flex-col overflow-hidden rounded-2xl border bg-white p-6 shadow-card ${
        plan.popular || highlighted ? 'border-ember-500' : 'border-navy-900/10'
      } ${highlighted ? 'ring-2 ring-ember-500 ring-offset-2' : ''}`}
      data-highlighted={highlighted || undefined}
    >
      {highlighted && (
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ember-600">Matches your team size</p>
      )}
      {plan.popular && (
        // A corner ribbon rather than an inline pill — "Most Popular" reads
        // as genuinely more important than a muted "Coming soon" label, and
        // being out-of-flow means it doesn't push this card's content down
        // relative to its neighbors in the same row (the old inline badge did).
        <div
          className="absolute right-[-34px] top-[18px] w-[140px] rotate-45 bg-ember-500 py-1 text-center text-[10px] font-bold uppercase tracking-wider text-white shadow-sm"
          aria-hidden
        >
          Most Popular
        </div>
      )}
      {plan.popular && <span className="sr-only">Most popular</span>}
      {plan.segment && (
        <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">{plan.segment}</p>
      )}
      <h3 className="text-lg font-bold text-navy-900">{plan.name}</h3>
      <p className="mt-1 text-sm text-navy-700">{plan.tagline}</p>

      {typeof displayPriceZAR === 'number' ? (
        <>
          <div className="mt-4 flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-navy-900">{formatZAR(displayPriceZAR)}</span>
            <span className="text-sm text-navy-700">/month</span>
          </div>
          {isYearly && <p className="mt-1 text-xs font-medium text-ember-600">Billed annually</p>}
          {plan.billingNote && (
            <p className="mt-1 text-xs font-medium text-ember-600">{plan.billingNote}</p>
          )}
          <p className="mt-1 text-xs text-navy-400">Illustrative — see pricing page for details</p>
        </>
      ) : (
        <p className="mt-4 text-2xl font-extrabold text-navy-900">Talk to us</p>
      )}

      <dl className="mt-5 grid grid-cols-2 gap-3 border-y border-navy-900/10 py-4 text-sm">
        <div className={plan.hideCapacityRow ? 'col-span-2' : undefined}>
          <dt className="text-navy-400">{plan.minutesLabel ?? 'Minutes'}</dt>
          <dd className="font-medium text-navy-900">{plan.minutesIncluded}</dd>
        </div>
        {!plan.hideCapacityRow && (
          <div>
            <dt className="text-navy-400">{plan.capacityLabel ?? 'Capacity'}</dt>
            <dd className="font-medium text-navy-900">{plan.capacity}</dd>
          </div>
        )}
        {plan.overageNote && (
          <p className="col-span-2 text-xs leading-snug text-navy-400">{plan.overageNote}</p>
        )}
        <div className="col-span-2">
          <dt className="text-navy-400">Number</dt>
          <dd className="font-medium text-navy-900">{plan.didIncluded}</dd>
        </div>
      </dl>

      <ul className="mt-5 flex-1 space-y-2.5 text-sm text-navy-800">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <CheckIcon className="mt-0.5 h-4 w-4 flex-none text-ember-500" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {plan.balanceNote && (
        <p className="mt-4 text-xs text-navy-700">{plan.balanceNote}</p>
      )}

      {plan.whmcsPid ? (
        <CTAButton
          href={orderProductUrl(plan.whmcsPid, isYearly ? 'annually' : 'monthly')}
          external
          variant={plan.popular ? 'primary' : 'ghost'}
          className="mt-6 w-full"
        >
          {plan.ctaLabel ?? 'Order Now'}
        </CTAButton>
      ) : (
        <CTAButton href={plan.ctaHref ?? '/contact'} variant={plan.popular ? 'primary' : 'ghost'} className="mt-6 w-full">
          {plan.ctaLabel ?? 'Talk to us'}
        </CTAButton>
      )}
    </div>
  );
}
