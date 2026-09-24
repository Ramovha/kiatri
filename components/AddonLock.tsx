'use client';

import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { builderAddons, lockBlockers, addonNames, shortAddonName, PlanFamily } from '@/lib/addons';
import { readAddonUrl, writeAddonUrl, removeAddonParams } from '@/lib/addonUrl';
import type { Addon } from '@/lib/products';

// The addon lock. One addon selection per page. As soon as any addon is
// selected, only plans that work with ALL selected addons stay orderable; the
// rest are greyed out, say why, and offer "Remove <addon>". Unselecting the
// addon unlocks everything.
//
// The selection lives in the address (?plan=line-800&addons=ivr) so Back,
// forward and shared links restore it (and the lock). Reloading the page
// starts clean: the selection is dropped and everything unlocks.

interface LockApi {
  selected: string[]; // addon product ids, in display order
  locked: boolean;
  toggle: (addonId: string, planId?: string) => void;
  remove: (addonId: string) => void;
  clear: () => void;
  blockers: (family: PlanFamily) => Addon[];
}

const inert: LockApi = { selected: [], locked: false, toggle: () => {}, remove: () => {}, clear: () => {}, blockers: () => [] };
const LockContext = createContext<LockApi>(inert);
export const useAddonLock = () => useContext(LockContext);

// True only once per page load: client-side navigations to a page inside the
// same document must not re-read the original load's "reload" type.
let bootHandled = false;

const canonical = (ids: string[]) => builderAddons.filter((addon) => ids.includes(addon.id)).map((addon) => addon.id);

export function AddonLockProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<string[]>([]);
  const lastPlan = useRef<string | null>(null);

  useEffect(() => {
    const url = readAddonUrl();
    lastPlan.current = url.plan;
    let ids = url.addonIds;
    if (!bootHandled) {
      bootHandled = true;
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
      if (nav?.type === 'reload') {
        // A reload starts clean: no addons, nothing locked, and none in the address.
        if (ids.length) removeAddonParams();
        ids = [];
      }
    }
    setSelected(canonical(ids));
  }, []);

  function commit(next: string[], planId?: string) {
    const ids = canonical(next);
    setSelected(ids);
    if (planId) lastPlan.current = planId;
    if (ids.length === 0) removeAddonParams();
    else writeAddonUrl(lastPlan.current ?? '', ids);
  }

  const api: LockApi = {
    selected,
    locked: selected.length > 0,
    toggle: (addonId, planId) => commit(selected.includes(addonId) ? selected.filter((id) => id !== addonId) : [...selected, addonId], planId),
    remove: (addonId) => commit(selected.filter((id) => id !== addonId)),
    clear: () => commit([]),
    blockers: (family) => lockBlockers(family, selected),
  };

  return <LockContext.Provider value={api}>{children}</LockContext.Provider>;
}

// "Showing plans that work with: Virtual Receptionist (IVR). [Clear addons]"
export function AddonLockBar() {
  const lock = useAddonLock();
  if (!lock.locked) return null;
  const names = addonNames(builderAddons.filter((addon) => lock.selected.includes(addon.id)));
  return (
    <div role="status" data-testid="lock-bar" className="mb-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 rounded-xl border border-ember-500/30 bg-ember-500/10 px-4 py-2.5 text-sm text-navy-900">
      <span>
        Showing plans that work with: <strong>{names}</strong>.
      </span>
      <button type="button" onClick={lock.clear} className="font-semibold text-ember-600 underline hover:text-ember-500">
        Clear addons
      </button>
    </div>
  );
}

// Why a plan is locked, with a way out: "Not available with IVR · Remove IVR".
export function AddonLockNote({ blockers, className = '' }: { blockers: Addon[]; className?: string }) {
  const lock = useAddonLock();
  if (blockers.length === 0) return null;
  return (
    <div data-testid="lock-note" className={`rounded-lg border border-ember-500/25 bg-ember-500/10 px-3 py-2 text-xs ${className}`}>
      <p className="font-semibold text-navy-900">Not available with {addonNames(blockers)}</p>
      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
        {blockers.map((addon) => (
          <button key={addon.id} type="button" onClick={() => lock.remove(addon.id)} className="font-semibold text-ember-600 underline hover:text-ember-500">
            Remove {shortAddonName(addon)}
          </button>
        ))}
      </div>
    </div>
  );
}
