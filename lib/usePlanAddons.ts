'use client';

import { useEffect, useState } from 'react';
import { normaliseAddonIds, PlanFamily } from './addons';
import { readAddonUrl, writeAddonUrl } from './addonUrl';

// The addon switches on one plan card. Restores this plan's selection from
// the address on load (?plan=line-800&addons=ivr,callblock) and writes every
// change back to it, so Back, refresh and shared links keep the toggles.
export function usePlanAddons(planId: string, family: PlanFamily | null) {
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    if (!family) return;
    const url = readAddonUrl();
    if (url.plan === planId) setSelected(normaliseAddonIds(url.addonIds, family));
  }, [planId, family]);

  function toggle(addonId: string) {
    if (!family) return;
    const next = normaliseAddonIds(selected.includes(addonId) ? selected.filter((id) => id !== addonId) : [...selected, addonId], family);
    setSelected(next);
    writeAddonUrl(planId, next);
  }

  return { selected, toggle };
}
