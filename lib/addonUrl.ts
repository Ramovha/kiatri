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

// True only once per page load: client-side navigations inside the same
// document must not re-read the original load's "reload" type.
let bootHandled = false;

// Reads the selection for the first time on a page. A reload starts clean:
// the addons are dropped from the address and nothing is restored. Back,
// forward and shared links restore the selection.
export function readInitialAddonUrl(): UrlSelection {
  if (!bootHandled) {
    bootHandled = true;
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    if (nav?.type === 'reload') removeAddonParams();
  }
  return readAddonUrl();
}

// Removes the addon selection from the address (used when the page is
// reloaded), keeping the plan, other parameters and the #hash.
export function removeAddonParams() {
  const params = new URLSearchParams(window.location.search);
  ['addons', 'addon'].forEach((key) => params.delete(key));
  const rest = params.toString();
  window.history.replaceState(null, '', `${window.location.pathname}${rest ? '?' + rest : ''}${window.location.hash}`);
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
