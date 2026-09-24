import { ComponentType } from 'react';
import {
  QueueIcon,
  MenuTreeIcon,
  RecordDotIcon,
} from '@/components/icons';

// Single source of truth for every plan/tier shown on the site.
//
// PRICING NOTE: `priceZAR` values for pbxTiers and trunkPlans below are
// derived from the icttech.ca / ictVoIP.ca reference worksheet's raw
// CAD/USD → ZAR conversions — NOT final sell prices; DIDWW wholesale cost
// data and a margin model still need to be applied. `linePlans` pricing was
// revised against real 2026 South African market rates (WhichVoIP, HostworX)
// and a real DIDWW sandbox DID quote (R13.02/mo MRC, R0.163/min inbound) —
// still illustrative, but grounded in real cost/market data rather than a
// straight currency conversion. The confirmed-vs-open items from that DIDWW
// research (outbound per-minute rate not yet confirmed; DID+0 vs DID+2
// capacity type not yet confirmed; only 4 of 9 provinces confirmed available)
// are tracked in SETUP.md — check there before finalizing linePlans pricing
// or making any coverage claims in copy. Every price is rendered on the site
// with an "illustrative pricing" note (see PricingDisclaimer component)
// until replaced with a real costed number.
//
// ORDER LINKS: `whmcsPid` (product) and `whmcsBid` (bundle) are the real
// billing-system IDs. Bundles must always use `bid`, never the `pid` of the
// hidden products inside them. A plan with neither ID (or `comingSoon`)
// renders a disabled "Coming soon" button — see components/OrderButton.tsx.

export type PricingStatus = 'illustrative-pending-costing';

export interface PlanOrderStyle {
  label: string;
  description: string;
  whmcsPid?: number;
  comingSoon?: boolean;
}

export interface Plan {
  id: string;
  name: string;
  tagline: string;
  minutesIncluded: string;
  // Overrides the "Minutes" spec-row label — used by the Pay-As-You-Go line
  // plan, which has no bundled minutes at all (see `billingNote` below).
  minutesLabel?: string;
  capacity: string; // seats, channels, or "pay-as-you-go" — label varies by catalog section
  didIncluded: string;
  features: string[];
  priceZAR?: number; // omitted for the quote-only "Talk to us" tier — see whmcsPid/ctaHref below
  // Short note rendered directly under the price — for a metered/PAYG plan,
  // clarifies that the price shown is a base fee, not an all-inclusive
  // bundle (e.g. "+ per-minute call charges from your prepaid balance").
  billingNote?: string;
  // Short note rendered near the bottom of the card — for a metered/PAYG
  // plan, explains what happens at zero balance. Keep honest: only state
  // behaviour the billing system actually implements (e.g. autosuspend),
  // never imply a grace period that doesn't exist.
  balanceNote?: string;
  // Small business-size label shown above the plan name (e.g. "Small
  // Business" / "Growing Business" / "Established Business" / "Large Business") — used on the VoIP Plans
  // (PBX) tab only, purely additive labeling, doesn't change price/specs.
  segment?: string;
  // Overrides the "Capacity" spec-row label — the Residential tab avoids the
  // word "capacity" entirely per its jargon-free tone requirement.
  capacityLabel?: string;
  // Residential cards don't show a capacity/channels row at all (out of
  // scope for that tab's simple framing) — set true to omit it.
  hideCapacityRow?: boolean;
  // Shown directly under the Minutes row — every bundled-minutes plan needs
  // to say what happens once those minutes run out (ictVoIP's own docs list
  // this as a required field for both "Hybrid" and "Metered" package types).
  // Not set on plans that are already fully metered (Pay-As-You-Go, Home
  // Pay-As-You-Go) or genuinely unlimited (Home Unlimited) — see
  // OVERAGE_RATE_NOTE below for the one shared rate used everywhere else.
  overageNote?: string;
  pricingStatus: PricingStatus;
  // Both optional to support a quote-only "Talk to us" tier (e.g. Enterprise
  // SIP Trunk) alongside self-serve plans — omit both and set ctaHref/
  // ctaLabel instead. Every self-serve plan still sets whmcsPid as before.
  whmcsPid?: number; // billing-system product ID (cart.php?a=add&pid=)
  whmcsBid?: number; // billing-system bundle ID (cart.php?a=add&bid=) — used instead of pid for PBX tiers
  // No orderable product exists yet — render a disabled "Coming soon" button.
  comingSoon?: boolean;
  // Cards that are sold in more than one style (Home 200 / Home 400: Prepaid
  // or Capped) list each style here instead of a single order button. A style
  // with no whmcsPid renders a disabled "Coming soon" button.
  orderStyles?: PlanOrderStyle[];
  ctaHref?: string; // used when there's no whmcsPid (e.g. "/contact")
  ctaLabel?: string; // defaults to 'Order Now' in PricingCard when whmcsPid is set
  popular?: boolean;
}

// One shared overage rate reused on every bundled-minutes plan, so
// customers see a single consistent number instead of a different rate per
// card. Real, confirmed rate as of the Ringotel cost pass (R0.5236/min
// real cost) — no longer the earlier R0.35–R0.45/min illustrative range.
const OVERAGE_RATE_NOTE = 'Keep talking from R0,80/min.';

// --- Line Plans: single SIP line, no PBX required (icttech.ca residential +
// business VoIP plans for structure; ZAR pricing below is benchmarked against
// real 2026 South African entry-tier competitors — see PRICING NOTE below —
// not a straight currency conversion of the icttech reference). ---
//
// PayGo is structurally different from Line 200 / Line 800: it's a low base
// line-rental fee plus a separately maintained prepaid balance metered per
// call (matches the backend's metered/PAYG billing mode), not a bundled-
// minutes subscription. See `minutesLabel`, `billingNote`, `balanceNote`.
export const linePlans: Plan[] = [
  {
    id: 'line-payg',
    name: 'Pay-As-You-Go',
    tagline: 'Entry-level line — top up and pay only for what you use',
    minutesLabel: 'Billing',
    minutesIncluded: 'Pay only for the calls you make, from R0,80/min, from your prepaid balance.',
    capacity: '1 channel',
    didIncluded: '1 local number, or bring your own',
    features: [
      'International calling — Coming Soon',
      'Calls from R0,80/min, local and mobile',
      'Self-service control panel with balance top-up',
      'Low-balance email alerts before you run out',
      'Voicemail to email',
      'Bring your own IP phone or app',
      'No lock-in',
    ],
    priceZAR: 89,
    balanceNote: 'Calls pause automatically if your balance runs out — top up anytime to resume.',
    pricingStatus: 'illustrative-pending-costing',
    whmcsPid: 8,
  },
  {
    id: 'line-200',
    name: 'Line 200',
    tagline: 'Reliable single line for a small business or home office',
    minutesIncluded: '200 minutes every month',
    overageNote: OVERAGE_RATE_NOTE,
    capacity: '1–2 channels',
    didIncluded: '1 local number, or bring your own',
    features: [
      'International calling — Coming Soon',
      'Self-service control panel with balance top-up',
      'Low-balance email alerts before you run out',
      'Voicemail to email',
      'Bring your own IP phone or app',
      'No lock-in',
    ],
    priceZAR: 220,
    pricingStatus: 'illustrative-pending-costing',
    whmcsPid: 9,
    popular: true,
  },
  {
    id: 'line-800',
    name: 'Line 800',
    tagline: 'More bundled minutes for regular calling',
    minutesIncluded: '800 minutes every month',
    overageNote: OVERAGE_RATE_NOTE,
    capacity: '1–2 channels',
    didIncluded: '1 local number, or bring your own',
    features: [
      'International calling — Coming Soon',
      'Self-service control panel with balance top-up',
      'Low-balance email alerts before you run out',
      'Voicemail to email',
      'Bring your own IP phone or app',
      'No lock-in',
    ],
    priceZAR: 700,
    pricingStatus: 'illustrative-pending-costing',
    whmcsPid: 10,
  },
  {
    id: 'line-1600',
    name: 'Line 1600',
    tagline: 'High-volume single line for heavy callers',
    minutesIncluded: '1 600 minutes every month',
    overageNote: OVERAGE_RATE_NOTE,
    capacity: '1–2 channels',
    didIncluded: '1 local number, or bring your own',
    features: [
      'International calling — Coming Soon',
      'Self-service control panel with balance top-up',
      'Low-balance email alerts before you run out',
      'Voicemail to email',
      'Bring your own IP phone or app',
      'No lock-in',
    ],
    priceZAR: 1280,
    pricingStatus: 'illustrative-pending-costing',
    whmcsPid: 17,
  },
  {
    id: 'line-3200',
    name: 'Line 3200',
    tagline: 'Our highest single-line tier for call-heavy operations',
    minutesIncluded: '3 200 minutes every month',
    overageNote: OVERAGE_RATE_NOTE,
    capacity: '1–2 channels',
    didIncluded: '1 local number, or bring your own',
    features: [
      'International calling — Coming Soon',
      'Self-service control panel with balance top-up',
      'Low-balance email alerts before you run out',
      'Voicemail to email',
      'Bring your own IP phone or app',
      'No lock-in',
    ],
    priceZAR: 2540,
    pricingStatus: 'illustrative-pending-costing',
    whmcsPid: 18,
  },
];

// --- Cloud PBX / tenant tiers (seats + minutes bundled, instant provisioning) ---
export const pbxTiers: Plan[] = [
  {
    id: 'pbx-5',
    name: 'PBX 5',
    segment: 'Small Business',
    tagline: 'Full PBX for a small team',
    minutesIncluded: '200 minutes every month',
    overageNote: OVERAGE_RATE_NOTE,
    capacity: '5 seats',
    didIncluded: '1 local number, or bring your own',
    features: [
      'Full PBX feature set',
      'Web-based admin portal',
      'Instant seat provisioning',
      'Bring your own IP phones',
      'Simplified management, less IT workload',
    ],
    // R324 PBX component + R220 Line 200 (bundled minutes tier) = R544 total.
    priceZAR: 544,
    pricingStatus: 'illustrative-pending-costing',
    whmcsBid: 1,
  },
  {
    id: 'pbx-10',
    name: 'PBX 10',
    segment: 'Growing Business',
    tagline: 'Growing teams that need more headroom',
    minutesIncluded: '800 minutes every month',
    overageNote: OVERAGE_RATE_NOTE,
    capacity: '10 seats',
    didIncluded: '1 local number, or bring your own',
    features: [
      'Full PBX feature set',
      'Web-based admin portal',
      'Instant seat provisioning',
      'Bring your own IP phones',
      'Simplified management, less IT workload',
    ],
    // R340 PBX component + R700 Line 800 (bundled minutes tier) = R1,040 total.
    priceZAR: 1040,
    pricingStatus: 'illustrative-pending-costing',
    whmcsBid: 2,
    popular: true,
  },
  {
    id: 'pbx-25',
    name: 'PBX 25',
    segment: 'Established Business',
    tagline: 'Established offices and multi-department setups',
    // Bundled minutes tier bumped from 800 to 1,600 to match the Line 1600
    // component now underlying this total (see priceZAR comment below) —
    // keeping the old 800-minute copy at the new higher price would read as
    // a price increase with nothing to show for it.
    minutesIncluded: '1 600 minutes every month',
    overageNote: OVERAGE_RATE_NOTE,
    capacity: '25 seats',
    didIncluded: '1 local number, or bring your own',
    features: [
      'Full PBX feature set',
      'Web-based admin portal',
      'Instant seat provisioning',
      'Bring your own IP phones',
      'Simplified management, less IT workload',
    ],
    // R1,280 PBX component + R1,280 Line 1600 (bundled minutes tier) = R2,560 total.
    priceZAR: 2560,
    pricingStatus: 'illustrative-pending-costing',
    whmcsBid: 3,
  },
  {
    id: 'pbx-50',
    name: 'PBX 50',
    segment: 'Large Business',
    tagline: 'Large teams and multi-department operations',
    // Bundled minutes tier bumped to 3,200 to match the Line 3200 component
    // underlying this total — same reasoning as PBX 25 above.
    minutesIncluded: '3 200 minutes every month',
    overageNote: OVERAGE_RATE_NOTE,
    capacity: '50 seats',
    didIncluded: '1 local number, or bring your own',
    features: [
      'Full PBX feature set',
      'Web-based admin portal',
      'Instant seat provisioning',
      'Bring your own IP phones',
      'Simplified management, less IT workload',
    ],
    // R2,210 PBX component + R2,540 Line 3200 (bundled minutes tier) = R4,750 total.
    priceZAR: 4750,
    pricingStatus: 'illustrative-pending-costing',
    whmcsBid: 4,
  },
];

// --- SIP trunk / calling capacity tiers (channels + bulk minutes) ---
export const trunkPlans: Plan[] = [
  {
    id: 'trunk-3400',
    name: 'Metro 3400',
    tagline: 'Entry-level trunk for a small call volume',
    minutesIncluded: '3 400 minutes every month',
    overageNote: OVERAGE_RATE_NOTE,
    capacity: '3 channels',
    didIncluded: '1 local number included',
    features: [
      'International calling — Coming Soon',
      'Self-service control panel',
      'Global points of presence',
      'Multi-PBX support',
      'Automatic failover',
      'Live support',
    ],
    priceZAR: 2690,
    pricingStatus: 'illustrative-pending-costing',
    whmcsPid: 26,
  },
  {
    id: 'trunk-5400',
    name: 'Metro 5400',
    tagline: 'Our most popular trunk for growing call volume',
    minutesIncluded: '5 400 minutes every month',
    overageNote: OVERAGE_RATE_NOTE,
    capacity: '4 channels',
    didIncluded: '1 local number included',
    features: [
      'International calling — Coming Soon',
      'Self-service control panel',
      'Global points of presence',
      'Multi-PBX support',
      'Automatic failover',
      'Live support',
    ],
    priceZAR: 4260,
    pricingStatus: 'illustrative-pending-costing',
    whmcsPid: 27,
    popular: true,
  },
  {
    id: 'trunk-8400',
    name: 'Metro 8400',
    tagline: 'High-volume trunking for busy contact lines',
    minutesIncluded: '8 400 minutes every month',
    overageNote: OVERAGE_RATE_NOTE,
    capacity: '6 channels',
    didIncluded: '1 local number included',
    features: [
      'International calling — Coming Soon',
      'Self-service control panel',
      'Global points of presence',
      'Multi-PBX support',
      'Automatic failover',
      'Live support',
    ],
    priceZAR: 6620,
    pricingStatus: 'illustrative-pending-costing',
    whmcsPid: 28,
  },
  {
    id: 'trunk-enterprise',
    name: 'Enterprise SIP Trunk',
    tagline: 'Custom channel count and bulk minutes for high-volume or multi-site trunking',
    minutesIncluded: 'Custom bulk minutes',
    capacity: 'Custom channels',
    didIncluded: 'Custom DID allocation',
    features: [
      'International calling — Coming Soon',
      'Self-service control panel',
      'Global points of presence',
      'Multi-PBX support',
      'Automatic failover',
      'Live support',
      'Dedicated capacity planning',
    ],
    pricingStatus: 'illustrative-pending-costing',
    ctaHref: '/contact',
    ctaLabel: 'Talk to us',
    // No priceZAR/whmcsPid — quote-only, matching Call Center's Enterprise
    // tier: we size channels and bulk minutes to the account, not a
    // published self-serve tier.
  },
];

// --- Residential: individuals/home users, deliberately simpler than Line
// Plans (which is small-business framed). No "seats/channels/capacity/PBX/
// trunk" jargon anywhere in this family's copy — keep it warm and plain. ---
export const residentialPlans: Plan[] = [
  {
    id: 'residential-payg',
    name: 'Home Pay-As-You-Go',
    tagline: 'Perfect for light or occasional use at home',
    minutesLabel: 'Billing',
    minutesIncluded: 'Pay as you go from your prepaid balance',
    capacity: '1 line',
    hideCapacityRow: true,
    didIncluded: '1 local number, or bring your own',
    features: [
      'Keep your existing number (porting)',
      'Simple self-service app/portal',
      'Voicemail to email',
      'Use our app or your own cordless phone',
      'No lock-in, cancel anytime',
    ],
    priceZAR: 79,
    billingNote: '+ calls from R0,80/min from your prepaid balance',
    balanceNote: 'Calls pause automatically if your balance runs out — top up anytime to resume.',
    pricingStatus: 'illustrative-pending-costing',
    whmcsPid: 1,
  },
  {
    id: 'residential-200',
    name: 'Home 200',
    tagline: 'Reliable home line with bundled minutes',
    minutesIncluded: '200 minutes every month',
    capacity: '1 line',
    hideCapacityRow: true,
    didIncluded: '1 local number, or bring your own',
    features: [
      'Keep your existing number (porting)',
      'Simple self-service app/portal',
      'Voicemail to email',
      'Use our app or your own cordless phone',
      'No lock-in, cancel anytime',
    ],
    priceZAR: 180,
    pricingStatus: 'illustrative-pending-costing',
    // Prepaid orders pid 4. Capped has no product yet: add its whmcsPid here
    // (and drop comingSoon) once it exists.
    orderStyles: [
      { label: 'Prepaid', description: 'Keep talking after your minutes from R0,80/min.', whmcsPid: 4 },
      { label: 'Capped', description: 'One fixed price. Nothing extra, ever.', comingSoon: true },
    ],
    popular: true,
  },
  {
    id: 'residential-400',
    name: 'Home 400',
    tagline: 'More bundled minutes for households that call a lot',
    minutesIncluded: '400 minutes every month',
    capacity: '1 line',
    hideCapacityRow: true,
    didIncluded: '1 local number, or bring your own',
    features: [
      'Keep your existing number (porting)',
      'Simple self-service app/portal',
      'Voicemail to email',
      'Use our app or your own cordless phone',
      'No lock-in, cancel anytime',
    ],
    priceZAR: 340,
    pricingStatus: 'illustrative-pending-costing',
    orderStyles: [
      { label: 'Prepaid', description: 'Keep talking after your minutes from R0,80/min.', whmcsPid: 5 },
      { label: 'Capped', description: 'One fixed price. Nothing extra, ever.', comingSoon: true },
    ],
  },
  {
    id: 'residential-unlimited',
    name: 'Home Unlimited',
    tagline: 'Talk as much as you like — one flat monthly price',
    minutesIncluded: 'Unlimited local calling',
    capacity: '1 line',
    hideCapacityRow: true,
    didIncluded: '1 local number, or bring your own',
    features: [
      'Unlimited local calling up to a fair-use cap of ~355 minutes/month — typical household usage stays well within it',
      'International calling — Coming Soon',
      'Keep your existing number (porting)',
      'Simple self-service app/portal',
      'Voicemail to email',
      'Use our app or your own cordless phone',
      'No lock-in, cancel anytime',
    ],
    // Real cost data (R13.02/mo DID rental + R0.5236/min real call cost)
    // puts break-even at ~355 min/month for this price — disclosed above as
    // a fair-use cap rather than silently reviewing/throttling heavy users,
    // since "unlimited" with an undisclosed cap would be misleading. Price
    // kept at R199 (still comfortably above real cost at typical usage) —
    // revisit if real usage data shows the cap needs adjusting.
    priceZAR: 199,
    pricingStatus: 'illustrative-pending-costing',
    comingSoon: true, // no billing product yet
  },
];

// --- Home Line products: Home 200 / Home 400 each come in two styles, and each
// style is its own billing product. "Prepaid" includes the minutes plus the
// freedom to keep talking; "Capped" is one fixed monthly price. The Capped
// products are not created in the billing system yet, so they carry no
// whmcsPid and render a disabled "Coming soon" button until one is added. ---
export type HomeStyle = 'prepaid' | 'capped';

export interface HomeProduct {
  id: string;
  name: string;
  plan: 'Home 200' | 'Home 400';
  style: HomeStyle;
  priceZAR: number;
  minutes: number;
  whmcsPid?: number;
  comingSoon?: boolean;
}

// Same monthly price as the residential plan of the same name. NOTE: the
// Capped price is not confirmed separately — it mirrors Prepaid until the
// Capped products exist and are priced.
const home200Price = residentialPlans.find((plan) => plan.id === 'residential-200')!.priceZAR!;
const home400Price = residentialPlans.find((plan) => plan.id === 'residential-400')!.priceZAR!;

export const homeProducts: HomeProduct[] = [
  { id: 'home-200-prepaid', name: 'Home 200 Prepaid', plan: 'Home 200', style: 'prepaid', priceZAR: home200Price, minutes: 200, whmcsPid: 4 },
  { id: 'home-200-capped', name: 'Home 200 Capped', plan: 'Home 200', style: 'capped', priceZAR: home200Price, minutes: 200, comingSoon: true },
  { id: 'home-400-prepaid', name: 'Home 400 Prepaid', plan: 'Home 400', style: 'prepaid', priceZAR: home400Price, minutes: 400, whmcsPid: 5 },
  { id: 'home-400-capped', name: 'Home 400 Capped', plan: 'Home 400', style: 'capped', priceZAR: home400Price, minutes: 400, comingSoon: true },
];

// --- Addons: attachable extras sold alongside any plan above. Kept as a
// separate type from Plan since the shape genuinely differs (optional price
// for "coming soon" items, a one-off setup fee, an eligibility restriction) —
// forcing these into Plan/PricingCard would make both harder to read.
export interface Addon {
  id: string;
  // Short id used in links and query strings (?addon=ivr).
  slug?: 'callblock' | 'ivr' | 'fax';
  // Billing-system Product Addon ID — attaches the addon to a plan's cart
  // item (addons[ID]=on) instead of selling it as a separate product.
  // Confirm against the billing system before changing.
  whmcsAddonId?: number;
  name: string;
  tagline: string;
  // Longer explanatory copy shown below the tagline — used by items whose
  // tagline alone doesn't say enough (e.g. AI Virtual Receptionist).
  description?: string;
  priceZAR?: number; // omitted for "coming soon" items with no price yet
  setupFeeZAR?: number;
  features: string[];
  eligibilityNote?: string;
  status: 'available' | 'coming-soon';
  pricingStatus: PricingStatus;
  whmcsPid?: number; // omitted for coming-soon items with no orderable product yet
}

// Deliberately NOT ported from the icttech.ca reference addon list:
// - e911 Service — US/Canada-specific regulatory product; South Africa's
//   emergency system works differently and would need its own research, not
//   a direct port.
// - Enhanced Voicemail — already included free on every existing plan;
//   selling it separately would contradict existing marketing.
// - Call Forwarding — same reasoning as Enhanced Voicemail, already free.
export const addons: Addon[] = [
  {
    id: 'addon-callerid-block',
    slug: 'callblock',
    whmcsAddonId: 4,
    name: 'CallerID Block/Blacklist',
    tagline: 'Block scam and telemarketing calls',
    priceZAR: 60,
    setupFeeZAR: 40,
    features: [
      'Block known scam/telemarketing numbers',
      'Reject specific numbers you choose',
      'Self-service management',
      'Route blocked calls to voicemail or another number',
    ],
    status: 'available',
    pricingStatus: 'illustrative-pending-costing',
  },
  {
    id: 'addon-virtual-receptionist',
    slug: 'ivr',
    whmcsAddonId: 5,
    name: 'Virtual Receptionist (IVR)',
    tagline: 'An auto-attendant menu so your business sounds bigger',
    priceZAR: 80,
    setupFeeZAR: 200,
    features: [
      'Auto-attendant / "Press 1 for Sales" style menu',
      'Up to 20 mailbox users',
      'Voicemail to email',
      'Call routing tree',
    ],
    // PBX plan customers already have full IVR included — this addon is only
    // for customers who don't otherwise have one, so it isn't a duplicate.
    // Residential/Home Voice deliberately excluded: a multi-mailbox
    // "Press 1 for Sales" auto-attendant doesn't fit a single-line home
    // product the way it fits a small-business Line Plan.
    status: 'available',
    pricingStatus: 'illustrative-pending-costing',
  },
  {
    id: 'addon-virtual-fax',
    slug: 'fax',
    whmcsAddonId: 6,
    name: 'Virtual Fax',
    tagline: 'Send and receive faxes online — no fax machine needed',
    priceZAR: 160,
    features: [
      'Receive faxes as PDF attachments to email',
      'Send documents through a self-service virtual fax panel',
      'Email notifications for received faxes',
      'No physical fax machine or line required',
      'Switch it on for a Business Line or a SIP trunk',
    ],
    status: 'available',
    pricingStatus: 'illustrative-pending-costing',
    // The standalone product (pid 13) is no longer sold in billing, so there is no
    // order link and the "Only need fax?" card is not shown. Restore whmcsPid: 13
    // if it comes back.
    
  },
];

// --- Call center ----------------------------------------------------------
// Two self-serve call centre plans, each a bundle of a phone system tier plus
// the call centre features at one flat monthly price. Only features that are
// live today are listed on a plan; everything else is on the roadmap list.
export interface CallCenterFeature {
  name: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
}

// Live today.
export const callCenterFeatures: CallCenterFeature[] = [
  {
    name: 'Call queues',
    description: 'Route inbound calls into a queue with hold music and position announcements.',
    icon: QueueIcon,
  },
  {
    name: 'IVR / auto-attendant',
    description: 'Build multi-level menus so callers reach the right person or team on the first try.',
    icon: MenuTreeIcon,
  },
  {
    name: 'Call recording',
    description: 'Record and archive calls for training, quality, and dispute resolution.',
    icon: RecordDotIcon,
  },
];

// Coming later: one line each, never shown as a plan feature.
export const callCenterRoadmap: string[] = [
  'Live wallboards',
  'CRM call pop',
  'Hot desking',
  'Audio conferencing',
  'Holiday-aware routing with SA public holidays',
  'Call-back requests',
];

export interface CallCenterTier {
  id: string;
  name: string;
  tagline: string;
  priceZAR: number;
  priceNote: string;
  // The Cloud PBX tier inside the bundle — its included minutes are the
  // bundle's included minutes (confirmed against the bundle's cart lines).
  pbxTierId: string;
  // Feature lines shown on the card (live features only).
  features: string[];
  // Optional line under the features.
  footnote?: string;
  whmcsBid: number;
  popular?: boolean;
}

export const callCenterTiers: CallCenterTier[] = [
  {
    id: 'call-center-essentials',
    name: 'Call Center Essentials',
    tagline: 'A complete 10-seat call centre: phone system and call centre features in one plan.',
    // PBX 10 (R1,040) + Essentials (R149 × 10 agents = R1,490) = R2,530.
    priceZAR: 2530,
    priceNote: 'Includes PBX 10 (10 seats) + Call Center Essentials',
    pbxTierId: 'pbx-10',
    features: callCenterFeatures.map((feature) =>
      feature.name === 'Call queues' ? 'Call queues with hold music and position announcements' : feature.name,
    ),
    whmcsBid: 5,
  },
  {
    id: 'call-center-pro',
    name: 'Call Center Pro',
    tagline: 'A complete 25-seat call centre for growing teams.',
    // PBX 25 (R2,560) + Pro (R299 × 25 agents = R7,475) = R10,035.
    priceZAR: 10035,
    priceNote: 'Includes PBX 25 (25 seats) + Call Center Pro',
    pbxTierId: 'pbx-25',
    features: ['Everything in Essentials, for 25 seats'],
    footnote: 'More Pro features are on the way. See our roadmap below.',
    whmcsBid: 6,
    popular: true,
  },
];

// --- Phone hardware options — "Connect a Phone" tab on /voice. A distinct
// shape from Plan/Addon on purpose: Rent/Buy have a real illustrative price
// now (see below) but are still not orderable — pricing and fulfillment
// logistics are separate blockers, and only pricing is solved so far. A
// plain `priceNote` string carries whatever context matters per option
// (same-as-Residential for the BYO option, the required minimum term for
// Rent, the continuing line cost for Buy) rather than forcing every case
// through Plan/Addon's rendering assumptions. ---
export interface PhoneHardwareOption {
  id: string;
  name: string;
  tagline: string;
  description: string;
  priceZAR?: number; // omitted for the BYO option — it has no price of its own, see priceNote
  priceSuffix?: string; // '/month' or 'once-off'
  priceNote: string;
  features: string[];
  status: 'available' | 'coming-soon';
  // Billing-system product ID, recorded for when hardware goes on sale. Do not
  // link to it while status is 'coming-soon'.
  whmcsPid?: number;
}

// Hardware cost reference (2026, real SA retail): a standard SIP/DECT
// cordless phone (Yealink W73P, base + 1 handset) retails R1,092.95–R2,350
// across SA retailers (justelectronics, blacktievoip, and others) — a
// realistic wholesale/cost anchor is R1,200–R1,500. The Buy and Rent prices
// below are built from that, not guessed.
export const phoneHardwareOptions: PhoneHardwareOption[] = [
  {
    id: 'phone-byo',
    name: 'Connect Your Own Phone',
    tagline: 'Already have a cordless SIP phone? Just connect it to our network.',
    description:
      'Compatible with common cordless SIP handsets — Gigaset, Yealink, Panasonic, Snom, and similar. No hardware to buy from us.',
    priceNote: 'Same price as our Residential plans — see Residential for exact pricing.',
    features: [
      'No hardware cost or shipping from Kiatri',
      'Same simple setup as any Residential line',
      'Works with most SIP-compatible cordless phones',
    ],
    status: 'available',
  },
  {
    id: 'phone-rent',
    whmcsPid: 7,
    name: 'Rent a Cordless Phone',
    tagline: 'We ship you the phone, you just plug it in.',
    description: 'A monthly rental bundled with your line service — no upfront hardware cost.',
    priceZAR: 99,
    priceSuffix: '/month',
    // Deliberate, isolated exception to the "No contracts, cancel anytime"
    // language used everywhere else on the site — a rental term is what
    // makes amortizing the hardware cost work. Do not drop this note or
    // this becomes a false claim next to a real monthly rental.
    priceNote: 'Requires a 12-month minimum term, hardware included — not a month-to-month plan like our other tiers.',
    features: [
      'Phone shipped to you',
      'Bundled monthly rental with your line',
      'Support and replacement included',
      '12-month minimum term',
    ],
    status: 'coming-soon',
  },
  {
    id: 'phone-buy',
    whmcsPid: 6,
    name: 'Buy a Cordless Phone',
    tagline: 'One once-off payment, the phone is yours.',
    description: 'A once-off hardware payment — your existing line service price continues unchanged.',
    priceZAR: 1499,
    priceSuffix: 'once-off',
    priceNote: '+ your line service price, unchanged.',
    features: ['Phone is yours to keep', 'One once-off payment', 'Still needs an active line plan'],
    status: 'coming-soon',
  },
];
