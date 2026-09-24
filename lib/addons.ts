import { addons, Addon } from './products';

// Which addon works with which plan — the single source of truth for the
// Addons page and the pricing builder.

export type PlanFamily = 'home' | 'business' | 'pbx' | 'trunk';

export const PLAN_FAMILIES: { family: PlanFamily; slug: string; label: string; short: string }[] = [
  { family: 'home', slug: 'home-line', label: 'Home Line', short: 'Home Line' },
  { family: 'business', slug: 'business-line', label: 'Business Line', short: 'Business Line' },
  { family: 'pbx', slug: 'cloud-pbx', label: 'Cloud PBX', short: 'Cloud PBX' },
  { family: 'trunk', slug: 'sip-trunk', label: 'SIP Trunk', short: 'SIP Trunk' },
];

export const familyFromSlug = (slug: string | null): PlanFamily | null =>
  PLAN_FAMILIES.find((f) => f.slug === slug)?.family ?? null;
export const slugFromFamily = (family: PlanFamily) => PLAN_FAMILIES.find((f) => f.family === family)!.slug;
export const labelFromFamily = (family: PlanFamily) => PLAN_FAMILIES.find((f) => f.family === family)!.label;

// What an addon can do on a plan family.
type Eligibility = 'eligible' | 'included' | 'no';

const ELIGIBILITY: Record<string, Record<PlanFamily, Eligibility>> = {
  'addon-callerid-block': { home: 'eligible', business: 'eligible', pbx: 'eligible', trunk: 'no' },
  'addon-virtual-receptionist': { home: 'no', business: 'eligible', pbx: 'included', trunk: 'no' },
  'addon-virtual-fax': { home: 'eligible', business: 'eligible', pbx: 'eligible', trunk: 'eligible' },
};

// Where the billing system can ATTACH the addon to the plan's cart item today.
// An addon that is eligible but not attachable yet shows "Coming soon" rather
// than being sold without actually being added. Confirmed by testing the
// live cart: Business Line takes all three; Home Line takes call blocking
// only. Add a family here once the addon is enabled for those products
// (Cloud PBX bundles also need addon support in the cart link).
const ATTACHABLE: Record<string, PlanFamily[]> = {
  'addon-callerid-block': ['home', 'business'],
  'addon-virtual-receptionist': ['business'],
  'addon-virtual-fax': ['business'],
};

const REASON_NAME: Record<string, string> = {
  'addon-callerid-block': 'Call blocking',
  'addon-virtual-receptionist': 'The Virtual Receptionist',
  'addon-virtual-fax': 'Virtual Fax',
};

export type AddonState = 'available' | 'included' | 'unavailable' | 'soon';

export interface Availability {
  state: AddonState;
  reason?: string;
}

export function addonAvailability(addon: Addon, family: PlanFamily): Availability {
  if (addon.status === 'coming-soon') return { state: 'soon', reason: 'Coming soon.' };
  const rule = ELIGIBILITY[addon.id]?.[family] ?? 'no';
  const plan = labelFromFamily(family);
  if (rule === 'included') return { state: 'included' };
  if (rule === 'no') return { state: 'unavailable', reason: `${REASON_NAME[addon.id] ?? addon.name} isn't available on ${plan} plans.` };
  if (typeof addon.whmcsAddonId !== 'number' || !(ATTACHABLE[addon.id] ?? []).includes(family)) return { state: 'soon', reason: `Coming soon for ${plan}.` };
  return { state: 'available' };
}

// "Works with: Home Line · Business Line · Cloud PBX"
export function worksWith(addon: Addon): string[] {
  return PLAN_FAMILIES.filter((f) => {
    const rule = ELIGIBILITY[addon.id]?.[f.family];
    return rule === 'eligible' || rule === 'included';
  }).map((f) => f.short);
}

// Every addon in display order, for the pricing builder's toggles.
export const BUILDER_ADDON_IDS = ['addon-callerid-block', 'addon-virtual-receptionist', 'addon-virtual-fax'];
export const builderAddons = BUILDER_ADDON_IDS.map((id) => addons.find((a) => a.id === id)!);
export const addonBySlug = (slug: string) => addons.find((a) => a.slug === slug);
