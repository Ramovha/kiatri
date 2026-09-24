'use client';

import { useEffect, useState } from 'react';
import { normaliseAddonIds, PlanFamily } from './addons';
import { readInitialAddonUrl, writeAddonUrl, removeAddonParams } from './addonUrl';

// The extras switched on for one plan card. Only addons the plan can take are
// ever kept. The selection lives in the address (?plan=line-800&addons=ivr,
// callblock) so Back, forward and shared links restore it; a reload starts
// clean.
export function usePlanAddons(planId: string, family: PlanFamily | null) {
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    if (!family) return;
    const url = readInitialAddonUrl();
    if (url.plan === planId) setSelected(normaliseAddonIds(url.addonIds, family));
  }, [planId, family]);

  function toggle(addonId: string) {
    if (!family) return;
    const next = normaliseAddonIds(selected.includes(addonId) ? selected.filter((id) => id !== addonId) : [...selected, addonId], family);
    setSelected(next);
    if (next.length === 0) writeAddonUrl(planId, []);
    else writeAddonUrl(planId, next);
  }

  return { selected, toggle };
}
