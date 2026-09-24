import { Addon } from '@/lib/products';
import { addonAvailability, worksWith, labelFromFamily, slugFromFamily, PLAN_FAMILIES, PlanFamily } from '@/lib/addons';
import { orderProductUrl } from '@/lib/whmcs';
import { formatZAR } from '@/lib/format';
import { CheckIcon, CheckCircleIcon, ClockIcon } from './icons';

// Information only: an addon is never ordered from here. It is switched on as
// a toggle inside a plan that qualifies for it (plan cards on /voice and
// /business, and the pricing builder). Deliberately its own component rather
// than reusing PricingCard — addons have a shape PricingCard doesn't (a
// once-off setup fee and per-plan availability).
export default function AddonCard({ addon, family }: { addon: Addon; family: PlanFamily }) {
  const { state, reason } = addonAvailability(addon, family);
  const isComingSoonAddon = addon.status === 'coming-soon';
  const dimmed = state === 'unavailable' || state === 'soon';
  const compatible = worksWith(addon);
  const planLabel = labelFromFamily(family);
  // Every plan type this addon can be switched on for. Each link opens the
  // pricing builder with the addon selected and the lock on, so only plans
  // that work with it can be ordered.
  const types = addon.slug ? PLAN_FAMILIES.filter((f) => addonAvailability(addon, f.family).state === 'available') : [];
  const linkFor = (f: PlanFamily) => `/pricing?addons=${addon.slug}#${slugFromFamily(f)}`;

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
      ) : state === 'available' && types.length > 0 ? (
        types.length === 1 ? (
          <a href={linkFor(types[0].family)} className="mt-6 inline-block text-sm font-semibold text-ember-600 hover:text-ember-500">
            Add it when you choose your plan →
          </a>
        ) : (
          <div className="mt-6 text-sm">
            <p className="font-semibold text-navy-900">Add it when you choose your plan:</p>
            <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
              {types.map((f) => (
                <li key={f.family}>
                  <a href={linkFor(f.family)} className="font-semibold text-ember-600 hover:text-ember-500">
                    {f.label} →
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )
      ) : null}

      {addon.slug === 'fax' && addon.whmcsPid && (
        // The only addon that is also sold on its own.
        <p className="mt-4 text-xs text-navy-700">
          Only need fax?{' '}
          <a href={orderProductUrl(addon.whmcsPid)} className="font-semibold text-ember-600 hover:text-ember-500">
            Get Virtual Fax on its own →
          </a>
        </p>
      )}
    </div>
  );
}
