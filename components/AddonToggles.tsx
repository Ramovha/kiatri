'use client';

import { CheckCircleIcon } from './icons';
import { addonAvailability, builderAddons, formatAddonPrice, shortAddonName, PlanFamily } from '@/lib/addons';

// The one addon switch panel, used by the pricing builder and by every plan
// card. It shows only the addons this plan family can have; what each one
// costs comes straight from the data file. `selected` is controlled by the
// caller, which also builds the order link (lib/addons.ts buildOrderLink).
export default function AddonToggles({
  family,
  selected,
  onToggle,
  notices = [],
  compact = false,
}: {
  family: PlanFamily;
  selected: string[];
  onToggle: (addonId: string) => void;
  // Why an addon was switched off (e.g. after changing plan).
  notices?: string[];
  compact?: boolean;
}) {
  const rows = builderAddons
    .map((addon) => ({ addon, ...addonAvailability(addon, family) }))
    .filter((row) => row.state !== 'unavailable');

  if (rows.length === 0 && notices.length === 0) return null;

  return (
    <div className={compact ? 'mt-5 border-t border-navy-900/10 pt-4' : ''} data-testid="addon-toggles">
      <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">Add extras</p>
      <div className="mt-2 space-y-2">
        {rows.map(({ addon, state }) => {
          const active = selected.includes(addon.id);
          if (state === 'included') {
            return (
              <div key={addon.id} data-addon={addon.slug} data-state="included" className="flex items-center gap-2 rounded-xl border border-navy-900/10 px-3 py-2 text-sm">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-signal-500/15 px-3 py-1 text-xs font-bold text-navy-900">
                  <CheckCircleIcon className="h-4 w-4 text-signal-500" />
                  {shortAddonName(addon)} included
                </span>
              </div>
            );
          }
          if (state === 'soon') {
            return (
              <div key={addon.id} data-addon={addon.slug} data-state="soon" className="flex items-center justify-between gap-3 rounded-xl border border-navy-900/10 px-3 py-2 text-sm opacity-60">
                <span className="text-navy-800">{addon.name}</span>
                <span className="text-xs font-semibold uppercase tracking-wide text-navy-400">Coming soon</span>
              </div>
            );
          }
          return (
            <div key={addon.id} data-addon={addon.slug} data-state="available" className="flex items-center justify-between gap-3 rounded-xl border border-navy-900/10 px-3 py-2 text-sm">
              <span className="min-w-0">
                <span className="block font-medium text-navy-800">{addon.name}</span>
                <span className="block text-xs text-navy-700">{formatAddonPrice(addon)}</span>
              </span>
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
            </div>
          );
        })}
      </div>
      {notices.length > 0 && (
        <ul role="status" className="mt-2 space-y-1 text-xs font-medium text-ember-600" data-testid="addon-notices">
          {notices.map((text) => (
            <li key={text}>{text}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
