'use client';

import { useState } from 'react';
import { CheckIcon, CheckCircleIcon } from './icons';
import { addonAvailability, builderAddons, formatAddonPrice, shortAddonName, PlanFamily } from '@/lib/addons';

// The one addon switch panel, used by the pricing builder and by every plan
// card. It shows ONLY the addons this plan family can have (anything else is
// not shown at all); what each one costs and what it does comes straight from
// the data file. `selected` is controlled by the caller, which also builds the
// order link (lib/addons.ts buildOrderLink).
export default function AddonToggles({
  family,
  selected,
  onToggle,
  compact = false,
}: {
  family: PlanFamily;
  selected: string[];
  onToggle: (addonId: string) => void;
  compact?: boolean;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const rows = builderAddons
    .map((addon) => ({ addon, ...addonAvailability(addon, family) }))
    .filter((row) => row.state !== 'unavailable');

  if (rows.length === 0) return null;

  return (
    <div className={compact ? 'mt-5 border-t border-navy-900/10 pt-4' : ''} data-testid="addon-toggles">
      <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">Add extras</p>
      <div className="mt-2 space-y-2">
        {rows.map(({ addon, state }) => {
          const active = selected.includes(addon.id);
          const open = openId === addon.id;
          const info = (
            <button
              type="button"
              aria-expanded={open}
              aria-controls={`addon-info-${addon.slug}`}
              aria-label={`About ${addon.name}`}
              onClick={() => setOpenId(open ? null : addon.id)}
              className="flex h-5 w-5 flex-none items-center justify-center rounded-full border border-navy-900/25 text-[11px] font-bold italic leading-none text-navy-700 hover:border-navy-900/50"
            >
              i
            </button>
          );
          return (
            <div key={addon.id} data-addon={addon.slug} data-state={state} className={`rounded-xl border border-navy-900/10 px-3 py-2 text-sm ${state === 'soon' ? 'opacity-60' : ''}`}>
              <div className="flex items-center justify-between gap-3">
                {state === 'included' ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-signal-500/15 px-3 py-1 text-xs font-bold text-navy-900">
                    <CheckCircleIcon className="h-4 w-4 text-signal-500" />
                    {shortAddonName(addon)} included
                  </span>
                ) : (
                  <span className="min-w-0">
                    <span className="block font-medium text-navy-800">{addon.name}</span>
                    {state === 'available' && <span className="block text-xs text-navy-700">{formatAddonPrice(addon)}</span>}
                  </span>
                )}
                <span className="flex flex-none items-center gap-2.5">
                  {info}
                  {state === 'soon' && <span className="text-xs font-semibold uppercase tracking-wide text-navy-400">Coming soon</span>}
                  {state === 'available' && (
                    <button
                      type="button"
                      role="switch"
                      aria-checked={active}
                      aria-label={`Toggle ${addon.name}`}
                      onClick={() => onToggle(addon.id)}
                      className={`relative h-6 w-11 flex-none rounded-full transition ${active ? 'bg-ember-500' : 'bg-navy-200'}`}
                    >
                      <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${active ? 'left-6' : 'left-1'}`} />
                    </button>
                  )}
                </span>
              </div>
              {open && (
                <div id={`addon-info-${addon.slug}`} data-testid="addon-info" className="mt-2 border-t border-navy-900/10 pt-2 text-xs text-navy-700">
                  <p>{addon.tagline}</p>
                  <ul className="mt-1.5 space-y-1">
                    {addon.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-1.5">
                        <CheckIcon className="mt-0.5 h-3.5 w-3.5 flex-none text-ember-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-1.5 font-semibold text-navy-900">{formatAddonPrice(addon)}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
