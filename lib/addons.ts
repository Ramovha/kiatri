import { addons, Addon, Plan, residentialPlans, linePlans, pbxTiers, trunkPlans } from './products';
import { formatZAR } from './format';
import { orderCartUrl } from './whmcs';

// The single source of truth for addons: which plan can take which addon,
// what it costs, and how it is attached to an order. Every page that shows an
// addon (the pricing builder, the plan cards on /voice and /business, and the
// /addons information page) reads from here and from lib/products.ts. No page
// hard-codes an addon, a price or a rule.

export type PlanFamily = 'home' | 'business' | 'pbx' | 'trunk';

export const PLAN_FAMILIES: { family: PlanFamily; slug: string; label: string; noun: string }[] = [
  { family: 'home', slug: 'home-line', label: 'Home Line', noun: 'Home' },
  { family: 'business', slug: 'business-line', label: 'Business Line', noun: 'Business Line' },
  { family: 'pbx', slug: 'cloud-pbx', label: 'Cloud PBX', noun: 'Cloud PBX' },
  { family: 'trunk', slug: 'sip-trunk', label: 'SIP Trunk', noun: 'SIP Trunk' },
];

export const familyFromSlug = (slug: string | null): PlanFamily | null =>
  PLAN_FAMILIES.find((f) => f.slug === slug)?.family ?? null;
export const slugFromFamily = (family: PlanFamily) => PLAN_FAMILIES.find((f) => f.family === family)!.slug;
export const labelFromFamily = (family: PlanFamily) => PLAN_FAMILIES.find((f) => f.family === family)!.label;
const nounFromFamily = (family: PlanFamily) => PLAN_FAMILIES.find((f) => f.family === family)!.noun;

// ---- plans -----------------------------------------------------------------

// Every orderable plan card, keyed by its id (used in ?plan=line-800).
const PLAN_LOOKUP: { plan: Plan; family: PlanFamily }[] = [
  ...residentialPlans.filter((plan) => plan.id !== 'residential-unlimited').map((plan) => ({ plan, family: 'home' as const })),
  ...linePlans.map((plan) => ({ plan, family: 'business' as const })),
  ...pbxTiers.map((plan) => ({ plan, family: 'pbx' as const })),
  ...trunkPlans.filter((plan) => typeof plan.priceZAR === 'number').map((plan) => ({ plan, family: 'trunk' as const })),
];

export const planById = (id: string | null) => PLAN_LOOKUP.find((entry) => entry.plan.id === id);
export const familyOfPlanId = (id: string): PlanFamily | null => planById(id)?.family ?? null;

// ---- eligibility -----------------------------------------------------------

// What an addon can do on a plan family.
type Eligibility = 'eligible' | 'included' | 'no';

const ELIGIBILITY: Record<string, Record<PlanFamily, Eligibility>> = {
  'addon-callerid-block': { home: 'eligible', business: 'eligible', pbx: 'eligible', trunk: 'no' },
  'addon-virtual-receptionist': { home: 'no', business: 'eligible', pbx: 'included', trunk: 'no' },
  'addon-virtual-fax': { home: 'no', business: 'eligible', pbx: 'eligible', trunk: 'eligible' },
};

// Where the billing system attaches the addon to the plan's cart item. An
// addon that is eligible but not listed here shows "Coming soon" rather than
// being sold without actually being added. Bundles (Cloud PBX and Call Center)
// attach it to their PBX product. `npm run check:prices` adds every offered
// combination to a live cart and fails if billing does not attach it, so a
// toggle can never be shown for a product that can't take it.
// Confirmed against live billing: call blocking on Home and Business Line, IVR
// on Business Line, fax on Business Line and the Metro trunks. Cloud PBX and
// Call Center (bundles) are added here ('pbx') once billing attaches call
// blocking and fax to the PBX products — `npm run check:prices` says when.
const ATTACHABLE: Record<string, PlanFamily[]> = {
  'addon-callerid-block': ['home', 'business'],
  'addon-virtual-receptionist': ['business'],
  'addon-virtual-fax': ['business', 'trunk'],
};

// Short names used in sentences ("IVR isn't available on Home plans.").
const SHORT_NAME: Record<string, string> = {
  'addon-callerid-block': 'Call blocking',
  'addon-virtual-receptionist': 'IVR',
  'addon-virtual-fax': 'Virtual Fax',
};
export const shortAddonName = (addon: Addon) => SHORT_NAME[addon.id] ?? addon.name;

export type AddonState = 'available' | 'included' | 'unavailable' | 'soon';

export interface Availability {
  state: AddonState;
  reason?: string;
}

export function addonAvailability(addon: Addon, family: PlanFamily): Availability {
  if (addon.status === 'coming-soon') return { state: 'soon', reason: 'Coming soon.' };
  const rule = ELIGIBILITY[addon.id]?.[family] ?? 'no';
  const short = shortAddonName(addon);
  const noun = nounFromFamily(family);
  if (rule === 'included') return { state: 'included' };
  if (rule === 'no') return { state: 'unavailable', reason: `${short} isn't available on ${noun} plans.` };
  if (typeof addon.whmcsAddonId !== 'number' || !(ATTACHABLE[addon.id] ?? []).includes(family)) {
    return { state: 'soon', reason: `${short} is coming soon for ${noun} plans.` };
  }
  return { state: 'available' };
}

// ---- display and ordering --------------------------------------------------

// Every addon in display order.
export const BUILDER_ADDON_IDS = ['addon-callerid-block', 'addon-virtual-receptionist', 'addon-virtual-fax'];
export const builderAddons = BUILDER_ADDON_IDS.map((id) => addons.find((a) => a.id === id)!);
export const addonById = (id: string) => addons.find((a) => a.id === id);

// Old links used ?addon=callerid.
const SLUG_ALIASES: Record<string, string> = { callerid: 'callblock' };
export const addonBySlug = (slug: string) => addons.find((a) => a.slug === (SLUG_ALIASES[slug] ?? slug));

// "+ R80,00/month · R200,00 once-off setup" (setup omitted when there is none).
export function formatAddonPrice(addon: Addon): string {
  const monthly = `+ ${formatZAR(addon.priceZAR ?? 0)}/month`;
  return addon.setupFeeZAR ? `${monthly} · ${formatZAR(addon.setupFeeZAR)} once-off setup` : monthly;
}

// The addons a plan family can switch on right now, in display order.
export function switchableAddons(family: PlanFamily): Addon[] {
  return builderAddons.filter((addon) => addonAvailability(addon, family).state === 'available');
}

// Keeps only addons the family can switch on, in the canonical order, so the
// same selection always produces the same link.
export function normaliseAddonIds(ids: string[], family: PlanFamily): string[] {
  return builderAddons.filter((a) => ids.includes(a.id) && addonAvailability(a, family).state === 'available').map((a) => a.id);
}

interface OrderableLike {
  whmcsPid?: number;
  whmcsBid?: number;
  comingSoon?: boolean;
}

// ---- safety helpers ---------------------------------------------------------

// A plan family "works with" an addon when the addon can be switched on for it
// or comes with it (Cloud PBX includes IVR). Anything else — not offered, or
// coming soon — does not. Plan cards only ever show addons that work with the
// plan, so this is the safety net behind buildOrderLink().
export function worksWithAddon(addon: Addon, family: PlanFamily): boolean {
  const { state } = addonAvailability(addon, family);
  return state === 'available' || state === 'included';
}

// The selected addons a plan family cannot take.
export function unsupportedAddons(family: PlanFamily, selectedIds: string[]): Addon[] {
  return builderAddons.filter((addon) => selectedIds.includes(addon.id) && !worksWithAddon(addon, family));
}

// "Virtual Receptionist (IVR), CallerID Block/Blacklist"
export const addonNames = (addons: Addon[]) => addons.map((addon) => addon.name).join(', ');

// "Your order: Line 800 + Virtual Receptionist (IVR)". An addon the plan
// already includes is named as included, not added.
export function orderSummary(planName: string, family: PlanFamily, selectedIds: string[]): string {
  const parts = builderAddons
    .filter((addon) => selectedIds.includes(addon.id))
    .map((addon) => (addonAvailability(addon, family).state === 'included' ? `${shortAddonName(addon)} included` : addon.name));
  return `Your order: ${[planName, ...parts].join(' + ')}`;
}

// THE one place an order link is built. A plan and the addons switched on for
// it become one cart item: pid:<plan>[addons:<ids>]. Addons are never added
// as products of their own, and an addon the plan already includes (IVR on
// Cloud PBX) is not added at all. `extras` are further plain items in the same
// order. SAFETY: refuses to build a link for a plan that doesn't work with a
// selected addon — it logs an error and returns null, so the caller keeps the
// button disabled. Returns null too when anything in the order has no order
// link yet.
export function buildOrderLink(plan: OrderableLike, family: PlanFamily, addonIds: string[], extras: OrderableLike[] = []): string | null {
  const blockers = unsupportedAddons(family, addonIds);
  if (blockers.length > 0) {
    console.error(`buildOrderLink: ${labelFromFamily(family)} doesn't work with ${addonNames(blockers)}; not building a link.`);
    return null;
  }
  const ids = builderAddons
    .filter((addon) => addonIds.includes(addon.id) && addonAvailability(addon, family).state === 'available')
    .map((addon) => addon.whmcsAddonId)
    .filter((id): id is number => typeof id === 'number');
  return orderCartUrl([{ product: plan, addonIds: ids }, ...extras]);
}
