'use client';

import { useState } from 'react';
import { Addon } from '@/lib/products';
import { addonAvailability, worksWith, slugFromFamily, labelFromFamily, PlanFamily } from '@/lib/addons';
import { orderProductUrl } from '@/lib/whmcs';
import { formatZAR } from '@/lib/format';
import { CheckIcon, CheckCircleIcon, ClockIcon } from './icons';
import CTAButton from './CTAButton';

// Existing customers pick the addon from their own account: they log in and
// only see the addons their service qualifies for.
const EXISTING_CUSTOMER_URL = 'https://calling.kiatri.com/cart.php?gid=addons';

// Deliberately its own component rather than reusing PricingCard — addons
// have a shape PricingCard doesn't (a once-off setup fee, per-plan
// availability, and an "Add to my plan" choice instead of a plain Order
// button).
export default function AddonCard({ addon, family }: { addon: Addon; family: PlanFamily }) {
  const [open, setOpen] = useState(false);
  const { state, reason } = addonAvailability(addon, family);
  const planLabel = labelFromFamily(family);
  const isComingSoonAddon = addon.status === 'coming-soon';
  const dimmed = state === 'unavailable' || state === 'soon';
  const compatible = worksWith(addon);
  const builderLink = `/pricing?plan=${slugFromFamily(family)}&addon=${addon.slug}#${slugFromFamily(family)}`;

  return (
    <div
      className={`flex h-full flex-col rounded-2xl border bg-white p-6 shadow-card ${
        dimmed ? 'border-navy-900/10 opacity-60' : 'border-navy-900/10'
      }`}
    >
      {isComingSoonAddon && (
        <span className="mb-3 inline-flex w-fit items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-navy-400">
          <ClockIcon className="h-3.5 w-3.5" />
          Coming soon
        </span>
      )}
      {state === 'included' && (
        <span className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-signal-500/15 px-3 py-1 text-xs font-bold text-navy-900">
          <CheckCircleIcon className="h-4 w-4 text-signal-500" />
          Included with {planLabel}
        </span>
      )}
      <h3 className="text-lg font-bold text-navy-900">{addon.name}</h3>
      <p className="mt-1 text-sm text-navy-700">{addon.tagline}</p>
      {addon.description && <p className="mt-2 text-sm text-navy-700">{addon.description}</p>}

      {typeof addon.priceZAR === 'number' && state !== 'included' ? (
        <>
          <div className="mt-4 flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-navy-900">{formatZAR(addon.priceZAR)}</span>
            <span className="text-sm text-navy-700">/month</span>
          </div>
          {typeof addon.setupFeeZAR === 'number' && (
            <p className="mt-1 text-xs text-navy-700">+ {formatZAR(addon.setupFeeZAR)} once-off setup</p>
          )}
        </>
      ) : isComingSoonAddon ? (
        <p className="mt-4 text-sm text-navy-700">Pricing to be confirmed</p>
      ) : null}

      <ul className="mt-5 flex-1 space-y-2.5 text-sm text-navy-800">
        {addon.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <CheckIcon className="mt-0.5 h-4 w-4 flex-none text-ember-500" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {!isComingSoonAddon && compatible.length > 0 && (
        <p className="mt-4 text-xs text-navy-700">
          <span className="font-semibold text-navy-900">Works with:</span> {compatible.join(' · ')}
        </p>
      )}

      {dimmed && reason && !isComingSoonAddon && <p className="mt-3 text-sm font-medium text-navy-800">{reason}</p>}

      {isComingSoonAddon ? (
        <span className="mt-6 flex w-full items-center justify-center rounded-full border border-navy-900/15 px-6 py-3 text-sm font-semibold text-navy-400">
          Notify me
        </span>
      ) : state === 'available' ? (
        <div className="mt-6">
          <button
            type="button"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex min-h-[44px] w-full items-center justify-center rounded-full border border-navy-900/15 px-6 py-3 text-sm font-semibold text-navy-900 transition hover:border-navy-900/40"
          >
            Add to my plan
          </button>
          {open && (
            <div className="mt-3 space-y-4 rounded-xl border border-navy-900/10 bg-navy-100/40 p-4">
              <div>
                <p className="text-sm font-bold text-navy-900">Already a Kiatri customer?</p>
                <CTAButton href={EXISTING_CUSTOMER_URL} external variant="ghost" size="sm" className="mt-2 w-full">
                  Add to my existing line
                </CTAButton>
              </div>
              <div>
                <p className="text-sm font-bold text-navy-900">New to Kiatri?</p>
                <CTAButton href={builderLink} size="sm" className="mt-2 w-full">
                  Choose a plan with this addon
                </CTAButton>
              </div>
            </div>
          )}
        </div>
      ) : null}

      {addon.slug === 'fax' && (
        <p className="mt-4 text-xs text-navy-700">
          Only need fax?{' '}
          <a href={orderProductUrl(13)} className="font-semibold text-ember-600 hover:text-ember-500">
            Get Virtual Fax on its own
          </a>
        </p>
      )}
    </div>
  );
}
