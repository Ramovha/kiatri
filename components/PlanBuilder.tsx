'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { pbxTiers, linePlans, homeProducts, HomeStyle, Plan } from '@/lib/products';
import { builderAddons, addonAvailability, addonBySlug, familyFromSlug, PlanFamily } from '@/lib/addons';
import { homePayg, meteredTrunks, includedMinutes, formatMinutes } from '@/lib/pricing';
import { CALL_RATE } from '@/lib/site';
import { orderCartUrl } from '@/lib/whmcs';
import { formatZAR } from '@/lib/format';
import OrderButton from './OrderButton';
import BusinessAccountsBlock from './BusinessAccountsBlock';

type Family = PlanFamily;

const FAMILIES: { value: Family; label: string; hash: string; tagline: string }[] = [
  { value: 'home', label: 'Home Line', hash: 'home-line', tagline: 'A reliable home phone line with a real local number.' },
  { value: 'business', label: 'Business Line', hash: 'business-line', tagline: 'Professional business phone lines for growing teams.' },
  { value: 'pbx', label: 'Cloud PBX', hash: 'cloud-pbx', tagline: 'A complete cloud phone system for your whole team.' },
  { value: 'trunk', label: 'SIP Trunk', hash: 'sip-trunk', tagline: 'Connect your existing PBX to South African calling capacity.' },
];

const HOME_PLANS = [
  { key: 'payg', label: 'Pay-As-You-Go' },
  { key: 'Home 200', label: 'Home 200' },
  { key: 'Home 400', label: 'Home 400' },
] as const;

const HOME_STYLES: { value: HomeStyle; label: string; description: string }[] = [
  {
    value: 'prepaid',
    label: 'Prepaid',
    description: `Your minutes, plus the freedom to keep talking. Extra calls from ${CALL_RATE}/min.`,
  },
  { value: 'capped', label: 'Capped', description: 'One fixed price every month. Nothing extra, ever.' },
];

const PBX_CALLING_LABELS = ['Pay-as-you-go', ...meteredTrunks.map((trunk) => `${formatMinutes(includedMinutes(trunk) ?? 0)} minutes`)];

const chip = (active: boolean) =>
  `min-h-[44px] rounded-xl border px-4 py-2 text-sm font-semibold transition ${
    active
      ? 'border-ember-500 bg-ember-500/10 text-ember-600'
      : 'border-navy-900/10 text-navy-700 hover:border-navy-900/30'
  }`;

const bundleLine = (minutes: number) => `${formatMinutes(minutes)} minutes every month. Keep talking from ${CALL_RATE}/min.`;

interface Orderable {
  name: string;
  priceZAR?: number;
  whmcsPid?: number;
  whmcsBid?: number;
  comingSoon?: boolean;
}

// Seats and calling capacity priced separately, shown transparently. Every
// price here is read from lib/products.ts — this is a different lens on the
// same data, not new numbers.
export default function PlanBuilder() {
  const [family, setFamily] = useState<Family>('pbx');
  const [homeKey, setHomeKey] = useState<(typeof HOME_PLANS)[number]['key']>('payg');
  const [homeStyle, setHomeStyle] = useState<HomeStyle>('prepaid');
  const [lineIndex, setLineIndex] = useState(0);
  const [pbxIndex, setPbxIndex] = useState(0);
  const [pbxCalling, setPbxCalling] = useState(-1); // -1 = pay-as-you-go
  const [trunkIndex, setTrunkIndex] = useState(0);
  const [addonIds, setAddonIds] = useState<string[]>([]);

  // Deep links: ?plan=business-line&addon=ivr,fax preselects the plan and its
  // addons (only those that plan can take); #home-line etc. selects the plan.
  // The ids themselves live on the comparison tables, so the browser handles
  // the scroll; this only syncs the builder to the same family.
  useEffect(() => {
    const fromQuery = () => {
      const params = new URLSearchParams(window.location.search);
      const target = familyFromSlug(params.get('plan'));
      if (!target) return;
      setFamily(target);
      const wanted = (params.get('addon') ?? '')
        .split(',')
        .map((slug) => addonBySlug(slug.trim()))
        .filter((addon): addon is NonNullable<typeof addon> => !!addon && addonAvailability(addon, target).state === 'available');
      setAddonIds(wanted.map((addon) => addon.id));
    };
    const fromHash = () => {
      const hash = window.location.hash.replace('#', '');
      const match = FAMILIES.find((f) => f.hash === hash);
      if (match) setFamily(match.value);
    };
    fromQuery();
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, []);

  const homeIsBundle = homeKey !== 'payg';

  let base: Orderable;
  let trunkAddOn: Plan | null = null;
  let callingLine: string;
  let baseMinutes: number | null = null;

  if (family === 'home') {
    if (homeKey === 'payg') {
      base = homePayg;
      callingLine = `Calls from ${CALL_RATE}/min`;
    } else {
      const product = homeProducts.find((p) => p.plan === homeKey && p.style === homeStyle)!;
      base = product;
      baseMinutes = product.minutes;
      callingLine = `${formatMinutes(product.minutes)} minutes included every month`;
    }
  } else if (family === 'business') {
    const plan = linePlans[lineIndex];
    base = plan;
    baseMinutes = includedMinutes(plan);
    callingLine = baseMinutes ? `${formatMinutes(baseMinutes)} minutes included every month` : `Calls from ${CALL_RATE}/min`;
  } else if (family === 'pbx') {
    base = pbxTiers[pbxIndex];
    trunkAddOn = pbxCalling >= 0 ? meteredTrunks[pbxCalling] : null;
    const trunkMinutes = trunkAddOn ? includedMinutes(trunkAddOn) : null;
    callingLine = trunkMinutes ? `${formatMinutes(trunkMinutes)} minutes included every month` : `Calls from ${CALL_RATE}/min`;
  } else {
    base = meteredTrunks[trunkIndex];
    baseMinutes = includedMinutes(meteredTrunks[trunkIndex]);
    callingLine = `${formatMinutes(baseMinutes ?? 0)} minutes included every month`;
  }

  // Toggles only for addons this plan can take: available ones switch on,
  // included ones are shown as Included, and ones the billing system can't
  // attach yet show Coming soon. Addons the plan can't have are hidden.
  const addonRows = builderAddons
    .map((addon) => ({ addon, ...addonAvailability(addon, family) }))
    .filter((row) => row.state !== 'unavailable');
  const selectedAddons = addonRows.filter((row) => row.state === 'available' && addonIds.includes(row.addon.id)).map((row) => row.addon);
  const setupTotal = selectedAddons.reduce((sum, addon) => sum + (addon.setupFeeZAR ?? 0), 0);

  const total = useMemo(
    () => (base.priceZAR ?? 0) + (trunkAddOn?.priceZAR ?? 0) + selectedAddons.reduce((sum, addon) => sum + (addon.priceZAR ?? 0), 0),
    [base, trunkAddOn, selectedAddons],
  );

  // One link carries everything selected: the plan, any calling capacity and
  // any addons. Checkout opens with each item in the cart once.
  // Addons are attached to the plan's own cart item, not added as products.
  const cartUrl = orderCartUrl([
    { product: base, addonIds: selectedAddons.map((addon) => addon.whmcsAddonId!) },
    ...(trunkAddOn ? [trunkAddOn] : []),
  ]);
  const familyInfo = FAMILIES.find((f) => f.value === family)!;

  function toggleAddon(id: string) {
    setAddonIds((prev) => (prev.includes(id) ? prev.filter((existing) => existing !== id) : [...prev, id]));
  }

  function changeFamily(next: Family) {
    setFamily(next);
    // Drop toggles for addons the new plan can't take.
    setAddonIds((prev) => prev.filter((id) => addonAvailability(builderAddons.find((a) => a.id === id)!, next).state === 'available'));
  }

  const ivrNote =
    family === 'pbx'
      ? 'Auto-attendant (IVR) included with every Cloud PBX.'
      : family === 'trunk'
        ? 'Auto-attendant (IVR) is available with a Business Line or Cloud PBX.'
        : null;

  return (
    <div>
      <div className="grid gap-0 overflow-hidden rounded-2xl border border-navy-900/10 bg-white shadow-card md:grid-cols-[1.3fr_1fr]">
        <div className="p-6 sm:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">What do you need?</p>
            <div role="group" aria-label="What do you need?" className="mt-2 flex flex-wrap gap-2">
              {FAMILIES.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  aria-pressed={f.value === family}
                  onClick={() => changeFamily(f.value)}
                  className={`min-h-[44px] rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                    f.value === family
                      ? 'border-navy-900 bg-navy-900 text-white'
                      : 'border-navy-900/10 text-navy-700 hover:border-navy-900/30'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <p className="mt-3 text-sm text-navy-700">{familyInfo.tagline}</p>
          </div>

          {family === 'home' && (
            <>
              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">Plan</p>
                <div role="group" aria-label="Plan" className="mt-2 flex flex-wrap gap-2">
                  {HOME_PLANS.map((plan) => (
                    <button key={plan.key} type="button" aria-pressed={plan.key === homeKey} onClick={() => setHomeKey(plan.key)} className={chip(plan.key === homeKey)}>
                      {plan.label}
                    </button>
                  ))}
                </div>
                {!homeIsBundle && <p className="mt-3 text-sm text-navy-700">Top up anytime. Calls from {CALL_RATE}/min.</p>}
              </div>
              {homeIsBundle && (
                <div className="mt-6" data-testid="home-style">
                  <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">Choose your style</p>
                  <div role="group" aria-label="Choose your style" className="mt-2 flex flex-wrap gap-2">
                    {HOME_STYLES.map((style) => (
                      <button key={style.value} type="button" aria-pressed={style.value === homeStyle} onClick={() => setHomeStyle(style.value)} className={chip(style.value === homeStyle)}>
                        {style.label}
                      </button>
                    ))}
                  </div>
                  <p className="mt-3 text-sm text-navy-700">{HOME_STYLES.find((s) => s.value === homeStyle)!.description}</p>
                </div>
              )}
            </>
          )}

          {family === 'business' && (
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">Plan</p>
              <div role="group" aria-label="Plan" className="mt-2 flex flex-wrap gap-2">
                {linePlans.map((plan, i) => (
                  <button key={plan.id} type="button" aria-pressed={i === lineIndex} onClick={() => setLineIndex(i)} className={chip(i === lineIndex)}>
                    {plan.name}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-sm text-navy-700">
                {baseMinutes ? bundleLine(baseMinutes) : `Pay only for the calls you make. From ${CALL_RATE}/min.`}
              </p>
            </div>
          )}

          {family === 'pbx' && (
            <>
              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">Seats</p>
                <div role="group" aria-label="Seats" className="mt-2 flex flex-wrap gap-2">
                  {pbxTiers.map((tier, i) => (
                    <button key={tier.id} type="button" aria-pressed={i === pbxIndex} onClick={() => setPbxIndex(i)} className={chip(i === pbxIndex)}>
                      {tier.capacity.replace(' seats', '')}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">Calling</p>
                <div role="group" aria-label="Calling" className="mt-2 flex flex-wrap gap-2">
                  {PBX_CALLING_LABELS.map((label, i) => (
                    <button key={label} type="button" aria-pressed={i - 1 === pbxCalling} onClick={() => setPbxCalling(i - 1)} className={chip(i - 1 === pbxCalling)}>
                      {label}
                    </button>
                  ))}
                </div>
                <p className="mt-3 text-sm text-navy-700">
                  {trunkAddOn
                    ? `${formatMinutes(includedMinutes(trunkAddOn) ?? 0)} minutes every month for your team. Keep talking from ${CALL_RATE}/min.`
                    : `Pay only for the calls you make. From ${CALL_RATE}/min.`}
                </p>
              </div>
            </>
          )}

          {family === 'trunk' && (
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">Capacity</p>
              <div role="group" aria-label="Capacity" className="mt-2 flex flex-wrap gap-2">
                {meteredTrunks.map((tier, i) => (
                  <button key={tier.id} type="button" aria-pressed={i === trunkIndex} onClick={() => setTrunkIndex(i)} className={chip(i === trunkIndex)}>
                    {formatMinutes(includedMinutes(tier) ?? 0)} minutes
                  </button>
                ))}
              </div>
              <p className="mt-3 text-sm text-navy-700">{bundleLine(baseMinutes ?? 0)}</p>
            </div>
          )}

          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">Addons</p>
            <div className="mt-2 space-y-2">
              {addonRows.map(({ addon, state }) => {
                const active = addonIds.includes(addon.id);
                return (
                  <div key={addon.id} className={`flex items-center justify-between gap-3 rounded-xl border border-navy-900/10 px-4 py-2.5 text-sm ${state === 'soon' ? 'opacity-60' : ''}`}>
                    <span className="text-navy-800">{addon.name}</span>
                    {state === 'included' ? (
                      <span className="rounded-full bg-signal-500/15 px-3 py-1 text-xs font-bold text-navy-900">Included</span>
                    ) : state === 'soon' ? (
                      <span className="text-xs font-semibold uppercase tracking-wide text-navy-400">Coming soon</span>
                    ) : (
                      <span className="flex items-center gap-2.5">
                        <span className="text-right text-xs text-navy-400">
                          +{formatZAR(addon.priceZAR ?? 0)}/mo
                          {addon.setupFeeZAR ? <span className="block">+ {formatZAR(addon.setupFeeZAR)} once-off setup</span> : null}
                        </span>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={active}
                          aria-label={`Toggle ${addon.name}`}
                          onClick={() => toggleAddon(addon.id)}
                          className={`relative h-6 w-11 flex-none rounded-full transition ${active ? 'bg-ember-500' : 'bg-navy-200'}`}
                        >
                          <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${active ? 'left-6' : 'left-1'}`} />
                        </button>
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            {ivrNote && <p className="mt-2 text-xs text-navy-400">{ivrNote}</p>}
          </div>
        </div>

        <div className="flex flex-col justify-between bg-navy-950 p-6 text-white sm:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-navy-300">Your monthly total</p>
            <p className="mt-1 text-4xl font-extrabold" aria-live="polite">
              {formatZAR(total)}
              <span className="text-base font-normal text-navy-300">/mo</span>
            </p>
            <ul className="mt-4 space-y-1.5 border-t border-white/10 pt-4 text-sm text-navy-200">
              <li className="flex justify-between gap-4">
                <span>{base.name}</span>
                <span>{formatZAR(base.priceZAR ?? 0)}</span>
              </li>
              {trunkAddOn && (
                <li className="flex justify-between gap-4">
                  <span>{trunkAddOn.name}</span>
                  <span>{formatZAR(trunkAddOn.priceZAR ?? 0)}</span>
                </li>
              )}
              {selectedAddons.map((addon) => (
                <li key={addon.id} className="flex justify-between gap-4">
                  <span>{addon.name}</span>
                  <span>{formatZAR(addon.priceZAR ?? 0)}</span>
                </li>
              ))}
            </ul>
            {setupTotal > 0 && (
              <div className="mt-3 border-t border-white/10 pt-3 text-sm text-navy-200" data-testid="once-off">
                <p className="text-xs font-semibold uppercase tracking-wide text-navy-300">Once-off</p>
                <ul className="mt-1.5 space-y-1.5">
                  {selectedAddons
                    .filter((addon) => addon.setupFeeZAR)
                    .map((addon) => (
                      <li key={addon.id} className="flex justify-between gap-4">
                        <span>{addon.name} setup</span>
                        <span>{formatZAR(addon.setupFeeZAR!)}</span>
                      </li>
                    ))}
                </ul>
                <p className="mt-1 text-[11px] text-navy-400">Not included in your monthly total.</p>
              </div>
            )}
            <p className="mt-3 text-sm font-semibold text-ember-400">{callingLine}</p>
            <p className="mt-4 rounded-lg border border-signal-400/30 bg-signal-500/10 p-3 text-xs text-signal-200">
              Every item listed. Every rand accounted for.
            </p>
          </div>

          <div className="mt-6 space-y-2">
            <OrderButton plan={base} url={cartUrl} className="w-full">
              Order {base.name}
            </OrderButton>
            <p className="pt-1 text-center text-[11px] text-navy-400">
              Each item is added to your cart. No VAT added. Final price confirmed at checkout. Billing details in our{' '}
              <Link href="/legal/terms" className="underline hover:text-white">
                Terms of Service
              </Link>
              .
            </p>
          </div>
        </div>
      </div>

      {family === 'pbx' && pbxTiers[pbxIndex].capacity === '50 seats' && (
        <div className="mt-6">
          <BusinessAccountsBlock headingLevel="h3" />
        </div>
      )}
    </div>
  );
}
