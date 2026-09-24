import { Addon } from '@/lib/products';
import { orderProductUrl } from '@/lib/whmcs';
import { formatZAR } from '@/lib/format';
import { CheckIcon, ClockIcon } from './icons';
import CTAButton from './CTAButton';

// Deliberately its own component rather than reusing PricingCard — addons
// have a shape PricingCard doesn't (an optional one-off setup fee, an
// eligibility restriction, and a disabled "coming soon" state with no price
// or Order button at all).
export default function AddonCard({ addon }: { addon: Addon }) {
  const isComingSoon = addon.status === 'coming-soon';

  return (
    <div
      className={`flex h-full flex-col rounded-2xl border bg-white p-6 shadow-card ${
        isComingSoon ? 'border-navy-900/10 opacity-60' : 'border-navy-900/10'
      }`}
    >
      {isComingSoon && (
        // Deliberately quiet — a muted label, not a filled pill — so it
        // reads as materially lower-priority than the bold "Most Popular"
        // ribbon used elsewhere on the site, not just a same-shape badge
        // in a different color.
        <span className="mb-3 inline-flex w-fit items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-navy-400">
          <ClockIcon className="h-3.5 w-3.5" />
          Coming soon
        </span>
      )}
      <h3 className="text-lg font-bold text-navy-900">{addon.name}</h3>
      <p className="mt-1 text-sm text-navy-700">{addon.tagline}</p>
      {addon.description && <p className="mt-2 text-sm text-navy-700">{addon.description}</p>}

      {addon.eligibilityNote && (
        <p className="mt-3 rounded-lg border border-ember-500/20 bg-ember-500/5 px-3 py-2 text-xs text-navy-800">
          {addon.eligibilityNote}
        </p>
      )}

      {typeof addon.priceZAR === 'number' ? (
        <>
          <div className="mt-4 flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-navy-900">{formatZAR(addon.priceZAR)}</span>
            <span className="text-sm text-navy-700">/month</span>
          </div>
          {typeof addon.setupFeeZAR === 'number' && (
            <p className="mt-1 text-xs text-navy-700">
              + {formatZAR(addon.setupFeeZAR)} once-off setup (illustrative)
            </p>
          )}
          <p className="mt-1 text-xs text-navy-400">Illustrative — see pricing page for details</p>
        </>
      ) : (
        <p className="mt-4 text-sm text-navy-700">Pricing to be confirmed</p>
      )}

      <ul className="mt-5 flex-1 space-y-2.5 text-sm text-navy-800">
        {addon.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <CheckIcon className="mt-0.5 h-4 w-4 flex-none text-ember-500" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {isComingSoon || !addon.whmcsPid ? (
        <span className="mt-6 flex w-full items-center justify-center rounded-full border border-navy-900/15 px-6 py-3 text-sm font-semibold text-navy-400">
          Notify me
        </span>
      ) : (
        <CTAButton href={orderProductUrl(addon.whmcsPid)} external variant="ghost" className="mt-6 w-full">
          Order Now
        </CTAButton>
      )}
    </div>
  );
}
