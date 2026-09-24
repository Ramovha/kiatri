'use client';

import { useMemo, useState } from 'react';
import { pbxTiers, trunkPlans, linePlans, addons, Plan } from '@/lib/products';
import { planOrderUrl } from '@/lib/whmcs';
import { formatZAR } from '@/lib/format';
import OrderButton from './OrderButton';

type BaseType = 'pbx' | 'line' | 'trunk';

const BASE_TYPES: { value: BaseType; label: string }[] = [
  { value: 'pbx', label: 'Cloud PBX (seats)' },
  { value: 'line', label: 'Single Line' },
  { value: 'trunk', label: 'SIP Trunk only' },
];

// Every addon that could plausibly attach to something built here.
// "Virtual Receptionist (IVR)" is filtered per base type below — our own
// data marks it Line Plans/Residential-only, since PBX tiers already
// include full IVR natively (see lib/products.ts eligibilityNote).
const CALCULATOR_ADDON_IDS = ['addon-callerid-block', 'addon-virtual-fax', 'addon-virtual-receptionist'];

// Excludes the quote-only Enterprise SIP Trunk — this calculator only ever
// computes a real self-serve total, and Enterprise has no fixed price to
// add up. It's still shown as a card on /business; just not selectable here.
const sellableTrunkPlans = trunkPlans.filter((plan) => typeof plan.priceZAR === 'number');

// Kiatri's actual pitch — "seats and calling capacity priced separately,
// shown transparently" — made tangible instead of just stated as a
// sentence. Every price here is the same real data from lib/products.ts;
// this is a different lens on it, not new numbers. Works across all three
// business product families (PBX seats, single lines, standalone trunks)
// rather than assuming everyone wants a PBX+trunk combo.
export default function PlanBuilder() {
  const [baseType, setBaseType] = useState<BaseType>('pbx');
  const [pbxIndex, setPbxIndex] = useState(0);
  const [lineIndex, setLineIndex] = useState(0);
  const [trunkOnlyIndex, setTrunkOnlyIndex] = useState(0);
  const [pbxTrunkIndex, setPbxTrunkIndex] = useState(-1); // -1 = no add-on trunk selected (PBX base type only)
  const [addonIds, setAddonIds] = useState<string[]>([]);

  const base: Plan = baseType === 'pbx' ? pbxTiers[pbxIndex] : baseType === 'line' ? linePlans[lineIndex] : sellableTrunkPlans[trunkOnlyIndex];
  const addOnTrunk = baseType === 'pbx' && pbxTrunkIndex >= 0 ? sellableTrunkPlans[pbxTrunkIndex] : null;

  // Mirrors the real eligibility rule rather than showing every addon
  // everywhere — a trunk-only or PBX customer can't order an IVR addon
  // that's either redundant (PBX) or unsupported without a line (trunk).
  const eligibleAddons = addons.filter((addon) => {
    if (!CALCULATOR_ADDON_IDS.includes(addon.id) || addon.status !== 'available') return false;
    if (addon.id === 'addon-virtual-receptionist') return baseType === 'line';
    return true;
  });
  const selectedAddons = eligibleAddons.filter((addon) => addonIds.includes(addon.id));

  const total = useMemo(
    () =>
      (base.priceZAR ?? 0) +
      (addOnTrunk?.priceZAR ?? 0) +
      selectedAddons.reduce((sum, addon) => sum + (addon.priceZAR ?? 0), 0),
    [base, addOnTrunk, selectedAddons],
  );

  function toggleAddon(id: string) {
    setAddonIds((prev) => (prev.includes(id) ? prev.filter((existing) => existing !== id) : [...prev, id]));
  }

  function changeBaseType(next: BaseType) {
    setBaseType(next);
    // Ineligible addons drop out of `selectedAddons` automatically via the
    // eligibleAddons filter above, but clearing the toggle state too keeps
    // the UI from showing a "checked" switch for something no longer shown.
    setAddonIds((prev) => prev.filter((id) => id !== 'addon-virtual-receptionist' || next === 'line'));
  }

  const ivrNote =
    baseType === 'pbx'
      ? "IVR/auto-attendant isn't listed here because it's already included in every PBX tier."
      : baseType === 'trunk'
        ? "IVR/auto-attendant isn't available as a standalone addon for trunk-only setups — it needs a Line Plan or PBX to attach to."
        : null;

  return (
    <div className="grid gap-0 overflow-hidden rounded-2xl border border-navy-900/10 bg-white shadow-card md:grid-cols-[1.3fr_1fr]">
      <div className="p-6 sm:p-8">
        <h3 className="font-display text-lg font-bold text-navy-900">Build your setup</h3>
        <p className="mt-1 text-sm text-navy-700">
          Every piece is priced and ordered separately — move a control and watch the total change.
        </p>

        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">What do you need?</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {BASE_TYPES.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => changeBaseType(type.value)}
                className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                  type.value === baseType
                    ? 'border-navy-900 bg-navy-900 text-white'
                    : 'border-navy-900/10 text-navy-700 hover:border-navy-900/30'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {baseType === 'pbx' && (
          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">Seats</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {pbxTiers.map((tier, i) => (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => setPbxIndex(i)}
                  className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                    i === pbxIndex
                      ? 'border-ember-500 bg-ember-500/10 text-ember-600'
                      : 'border-navy-900/10 text-navy-700 hover:border-navy-900/30'
                  }`}
                >
                  {tier.capacity}
                </button>
              ))}
            </div>
          </div>
        )}

        {baseType === 'line' && (
          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">Line</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {linePlans.map((tier, i) => (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => setLineIndex(i)}
                  className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                    i === lineIndex
                      ? 'border-ember-500 bg-ember-500/10 text-ember-600'
                      : 'border-navy-900/10 text-navy-700 hover:border-navy-900/30'
                  }`}
                >
                  {tier.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {baseType === 'trunk' && (
          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">Trunk capacity</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {sellableTrunkPlans.map((tier, i) => (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => setTrunkOnlyIndex(i)}
                  className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                    i === trunkOnlyIndex
                      ? 'border-ember-500 bg-ember-500/10 text-ember-600'
                      : 'border-navy-900/10 text-navy-700 hover:border-navy-900/30'
                  }`}
                >
                  {tier.minutesIncluded}
                </button>
              ))}
            </div>
          </div>
        )}

        {baseType === 'pbx' && (
          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">Calling capacity</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setPbxTrunkIndex(-1)}
                className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                  pbxTrunkIndex === -1
                    ? 'border-ember-500 bg-ember-500/10 text-ember-600'
                    : 'border-navy-900/10 text-navy-700 hover:border-navy-900/30'
                }`}
              >
                None
              </button>
              {sellableTrunkPlans.map((tier, i) => (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => setPbxTrunkIndex(i)}
                  className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                    i === pbxTrunkIndex
                      ? 'border-ember-500 bg-ember-500/10 text-ember-600'
                      : 'border-navy-900/10 text-navy-700 hover:border-navy-900/30'
                  }`}
                >
                  {tier.minutesIncluded}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">Addons</p>
          <div className="mt-2 space-y-2">
            {eligibleAddons.map((addon) => {
              const active = addonIds.includes(addon.id);
              return (
                <label
                  key={addon.id}
                  className="flex cursor-pointer items-center justify-between rounded-xl border border-navy-900/10 px-4 py-2.5 text-sm"
                >
                  <span className="text-navy-800">{addon.name}</span>
                  <span className="flex items-center gap-2.5">
                    <span className="text-xs text-navy-400">+{formatZAR(addon.priceZAR ?? 0)}/mo</span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={active}
                      aria-label={`Toggle ${addon.name}`}
                      onClick={() => toggleAddon(addon.id)}
                      className={`relative h-5 w-9 flex-none rounded-full transition ${
                        active ? 'bg-ember-500' : 'bg-navy-200'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${
                          active ? 'left-[18px]' : 'left-0.5'
                        }`}
                      />
                    </button>
                  </span>
                </label>
              );
            })}
          </div>
          {ivrNote && <p className="mt-2 text-xs text-navy-400">{ivrNote}</p>}
        </div>
      </div>

      <div className="flex flex-col justify-between bg-navy-950 p-6 text-white sm:p-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-navy-300">Your monthly total</p>
          <p className="mt-1 text-4xl font-extrabold">
            {formatZAR(total)}
            <span className="text-base font-normal text-navy-300">/mo</span>
          </p>
          <ul className="mt-4 space-y-1.5 border-t border-white/10 pt-4 text-sm text-navy-200">
            <li className="flex justify-between">
              <span>{base.name}</span>
              <span>{formatZAR(base.priceZAR!)}</span>
            </li>
            {addOnTrunk && (
              <li className="flex justify-between">
                <span>{addOnTrunk.name}</span>
                <span>{formatZAR(addOnTrunk.priceZAR!)}</span>
              </li>
            )}
            {selectedAddons.map((addon) => (
              <li key={addon.id} className="flex justify-between">
                <span>{addon.name}</span>
                <span>{formatZAR(addon.priceZAR ?? 0)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 rounded-lg border border-signal-400/30 bg-signal-500/10 p-3 text-xs text-signal-200">
            A typical competitor bundles this into one number you can&apos;t break down — here&apos;s exactly
            what you&apos;re paying for.
          </p>
        </div>

        <div className="mt-6 space-y-2">
          <OrderButton plan={base} className="w-full">
            Order {base.name}
          </OrderButton>
          {addOnTrunk && planOrderUrl(addOnTrunk) && (
            <a
              href={planOrderUrl(addOnTrunk)!}
              className="block text-center text-xs font-semibold text-signal-300 hover:text-signal-200"
            >
              + Add {addOnTrunk.name} in your cart
            </a>
          )}
          {selectedAddons.map(
            (addon) =>
              planOrderUrl(addon) && (
                <a
                  key={addon.id}
                  href={planOrderUrl(addon)!}
                  className="block text-center text-xs font-semibold text-signal-300 hover:text-signal-200"
                >
                  + Add {addon.name} in your cart
                </a>
              ),
          )}
          <p className="pt-1 text-center text-[11px] text-navy-400">
            Each item adds to your WHMCS cart separately — illustrative pricing, confirmed at checkout.
          </p>
        </div>
      </div>
    </div>
  );
}
