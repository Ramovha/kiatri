import { builderAddons, addonBySlug } from './addons';

// Keeps the plan and addon selection in the page address, e.g.
//   /business?plan=line-800&addons=ivr,callblock#line
// so Back, refresh and shared links restore it. Client-side only.

export interface UrlSelection {
  plan: string | null;
  addonIds: string[]; // addon product ids (e.g. "addon-virtual-receptionist"), unknown slugs dropped
  style: string | null; // "prepaid" | "capped" (Home plans)
}

export function readAddonUrl(): UrlSelection {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get('addons') ?? params.get('addon') ?? ''; // ?addon= is the older spelling
  const addonIds = raw
    .split(',')
    .map((slug) => addonBySlug(slug.trim().toLowerCase())?.id)
    .filter((id): id is string => !!id);
  return { plan: params.get('plan'), addonIds, style: params.get('style') };
}

// Updates the address in place (no reload, no extra history entry), keeping
// any other query parameters and the #hash.
export function writeAddonUrl(plan: string, addonIds: string[], style?: string | null) {
  const params = new URLSearchParams(window.location.search);
  ['plan', 'addons', 'addon', 'style'].forEach((key) => params.delete(key));
  const slugs = builderAddons.filter((a) => addonIds.includes(a.id)).map((a) => a.slug);
  const parts = [params.toString(), `plan=${plan}`, slugs.length ? `addons=${slugs.join(',')}` : '', style ? `style=${style}` : ''].filter(Boolean);
  window.history.replaceState(null, '', `${window.location.pathname}?${parts.join('&')}${window.location.hash}`);
}
