'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { pbxTiers, linePlans, homeProducts, HomeStyle } from '@/lib/products';
import { builderAddons, addonAvailability, familyFromSlug, planById, buildOrderLink, orderSummary, lockBlockers, PlanFamily } from '@/lib/addons';
import { readAddonUrl, writeAddonUrl } from '@/lib/addonUrl';
import { homePayg, meteredTrunks, includedMinutes, formatMinutes } from '@/lib/pricing';
import { CALL_RATE } from '@/lib/site';
import { formatZAR } from '@/lib/format';
import OrderButton from './OrderButton';
import AddonToggles from './AddonToggles';
import BusinessAccountsBlock from './BusinessAccountsBlock';
import { AddonLockProvider, AddonLockBar, AddonLockNote, useAddonLock } from './AddonLock';

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

// Every price here is read from lib/products.ts — this is a different lens on the
// same data, not new numbers.
export default function PlanBuilder() {
  return (
    <AddonLockProvider>
      <AddonLockBar />
      <PlanBuilderInner />
    </AddonLockProvider>
  );
}

function PlanBuilderInner() {
  const lock = useAddonLock();
  const [family, setFamily] = useState<Family>('pbx');
  const [homeKey, setHomeKey] = useState<(typeof HOME_PLANS)[number]['key']>('payg');
  const [homeStyle, setHomeStyle] = useState<HomeStyle>('prepaid');
  const [lineIndex, setLineIndex] = useState(0);
  const [pbxIndex, setPbxIndex] = useState(0);
  const [trunkIndex, setTrunkIndex] = useState(0);
  const touched = useRef(false); // the address is only rewritten after the visitor changes something

  // Deep links: ?plan=line-800 restores the plan (the addons are restored by
  // the addon lock, which also reads ?addons=); the older ?plan=business-line
  // selects a plan family; #home-line etc. selects the family too. The ids
  // themselves live on the comparison tables, so the browser handles the
  // scroll; this only syncs the builder.
  useEffect(() => {
    const url = readAddonUrl();
    const known = planById(url.plan);
    let target: Family | null = known?.family ?? familyFromSlug(url.plan);
    if (known) {
      const id = known.plan.id;
      if (known.family === 'home') {
        setHomeKey(id === 'residential-200' ? 'Home 200' : id === 'residential-400' ? 'Home 400' : 'payg');
        if (url.style === 'capped' || url.style === 'prepaid') setHomeStyle(url.style);
      }
      if (known.family === 'business') setLineIndex(Math.max(0, linePlans.findIndex((p) => p.id === id)));
      if (known.family === 'pbx') setPbxIndex(Math.max(0, pbxTiers.findIndex((p) => p.id === id)));
      if (known.family === 'trunk') setTrunkIndex(Math.max(0, meteredTrunks.findIndex((p) => p.id === id)));
    }
    if (target) setFamily(target);
    const fromHash = () => {
      const hash = window.location.hash.replace('#', '');
      const match = FAMILIES.find((f) => f.hash === hash);
      if (match) setFamily(match.value);
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, []);

  const homeIsBundle = homeKey !== 'payg';

  let base: Orderable;
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
    // Every Cloud PBX tier includes its own minutes, then the standard rate.
    base = pbxTiers[pbxIndex];
    baseMinutes = includedMinutes(pbxTiers[pbxIndex]);
    callingLine = `${formatMinutes(baseMinutes ?? 0)} minutes included every month`;
  } else {
    base = meteredTrunks[trunkIndex];
    baseMinutes = includedMinutes(meteredTrunks[trunkIndex]);
    callingLine = `${formatMinutes(baseMinutes ?? 0)} minutes included every month`;
  }

  // The addon lock: this plan is orderable only if it works with EVERY
  // selected addon. Addons it merely includes (IVR on Cloud PBX) are shown as
  // included and are not added to the cart or the total.
  const selectedIds = lock.selected;
  const blockers = lock.blockers(family);
  const qualifies = blockers.length === 0;
  const selectedAddons = builderAddons.filter((addon) => selectedIds.includes(addon.id) && addonAvailability(addon, family).state === 'available');
  const includedAddons = builderAddons.filter((addon) => selectedIds.includes(addon.id) && addonAvailability(addon, family).state === 'included');
  const setupTotal = selectedAddons.reduce((sum, addon) => sum + (addon.setupFeeZAR ?? 0), 0);

  // If the plan type on screen doesn't work with the selected addons (e.g. a
  // shared link, or arriving from /addons with a different plan type in the
  // address), move to the first plan type that does.
  useEffect(() => {
    if (selectedIds.length === 0 || lockBlockers(family, selectedIds).length === 0) return;
    const next = (['business', 'home', 'pbx', 'trunk'] as Family[]).find((f) => lockBlockers(f, selectedIds).length === 0);
    if (next) setFamily(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIds.join(','), family]);

  const total = useMemo(
    () => (base.priceZAR ?? 0) + selectedAddons.reduce((sum, addon) => sum + (addon.priceZAR ?? 0), 0),
    [base, selectedAddons],
  );

  // One link carries the plan with its addons attached. Checkout opens with
  // each item in the cart once.
  // Never built for a plan that doesn't work with the selected addons.
  const cartUrl = qualifies ? buildOrderLink(base, family, selectedIds) : null;

  // Which plan the address should point at.
  const planId =
    family === 'home'
      ? homeKey === 'payg' ? 'residential-payg' : homeKey === 'Home 200' ? 'residential-200' : 'residential-400'
      : family === 'business' ? linePlans[lineIndex].id
      : family === 'pbx' ? pbxTiers[pbxIndex].id
      : meteredTrunks[trunkIndex].id;
  const styleParam = family === 'home' && homeIsBundle ? homeStyle : null;
  useEffect(() => {
    if (touched.current) writeAddonUrl(planId, selectedIds, styleParam);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planId, selectedIds.join(','), styleParam]);

  const familyInfo = FAMILIES.find((f) => f.value === family)!;

  function toggleAddon(id: string) {
    touched.current = true;
    lock.toggle(id, planId);
  }

  function changeFamily(next: Family) {
    // Plan types that don't work with the selected addons are disabled, so
    // this only ever moves to one that does.
    if (lockBlockers(next, selectedIds).length > 0) return;
    touched.current = true;
    setFamily(next);
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
            <div role="group" aria-label="What do you need?" className="mt-2 flex flex-wrap items-start gap-x-2 gap-y-3">
              {FAMILIES.map((f) => {
                // Plan types that don't work with the selected addons are greyed
                // out and can't be chosen; the reason and a Remove link show below.
                const familyBlockers = lockBlockers(f.value, selectedIds);
                const familyLocked = familyBlockers.length > 0;
                return (
                  <div key={f.value} className="flex flex-col items-start gap-1.5">
                    <button
                      type="button"
                      aria-pressed={f.value === family}
                      disabled={familyLocked}
                      data-locked={familyLocked || undefined}
                      onClick={() => changeFamily(f.value)}
                      className={`min-h-[44px] rounded-xl border px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                        f.value === family
                          ? 'border-navy-900 bg-navy-900 text-white'
                          : 'border-navy-900/10 text-navy-700 hover:border-navy-900/30'
                      }`}
                    >
                      {f.label}
                    </button>
                    {familyLocked && <AddonLockNote blockers={familyBlockers} className="max-w-[12rem]" />}
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-sm text-navy-700">{familyInfo.tagline}</p>
          </div>

          {family === 'home' && (
            <>
              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">Plan</p>
                <div role="group" aria-label="Plan" className="mt-2 flex flex-wrap gap-2">
                  {HOME_PLANS.map((plan) => (
                    <button key={plan.key} type="button" aria-pressed={plan.key === homeKey} onClick={() => { touched.current = true; setHomeKey(plan.key); }} className={chip(plan.key === homeKey)}>
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
                      <button key={style.value} type="button" aria-pressed={style.value === homeStyle} onClick={() => { touched.current = true; setHomeStyle(style.value); }} className={chip(style.value === homeStyle)}>
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
                  <button key={plan.id} type="button" aria-pressed={i === lineIndex} onClick={() => { touched.current = true; setLineIndex(i); }} className={chip(i === lineIndex)}>
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
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">Seats</p>
              <div role="group" aria-label="Seats" className="mt-2 flex flex-wrap gap-2">
                {pbxTiers.map((tier, i) => (
                  <button key={tier.id} type="button" aria-pressed={i === pbxIndex} onClick={() => { touched.current = true; setPbxIndex(i); }} className={chip(i === pbxIndex)}>
                    {tier.capacity.replace(' seats', '')}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-sm text-navy-700">
                {formatMinutes(baseMinutes ?? 0)} minutes every month for your team. Keep talking from {CALL_RATE}/min.
              </p>
            </div>
          )}

          {family === 'trunk' && (
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">Capacity</p>
              <div role="group" aria-label="Capacity" className="mt-2 flex flex-wrap gap-2">
                {meteredTrunks.map((tier, i) => (
                  <button key={tier.id} type="button" aria-pressed={i === trunkIndex} onClick={() => { touched.current = true; setTrunkIndex(i); }} className={chip(i === trunkIndex)}>
                    {formatMinutes(includedMinutes(tier) ?? 0)} minutes
                  </button>
                ))}
              </div>
              <p className="mt-3 text-sm text-navy-700">{bundleLine(baseMinutes ?? 0)}</p>
            </div>
          )}

          <div className="mt-6">
            <AddonToggles family={family} selected={selectedIds} onToggle={toggleAddon} disabled={!qualifies} />
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
              {selectedAddons.map((addon) => (
                <li key={addon.id} className="flex justify-between gap-4">
                  <span>{addon.name}</span>
                  <span>{formatZAR(addon.priceZAR ?? 0)}</span>
                </li>
              ))}
              {includedAddons.map((addon) => (
                <li key={addon.id} data-included className="flex justify-between gap-4">
                  <span>{addon.name}</span>
                  <span>Included</span>
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
            <p data-testid="order-summary" className="text-center text-xs font-semibold text-white">
              {orderSummary(base.name, family, selectedIds)}
            </p>
            <OrderButton plan={base} url={cartUrl} locked={!qualifies} className="w-full">
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
