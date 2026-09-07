// Single source of truth for every plan/tier shown on the site.
//
// PRICING NOTE: `priceZAR` values below are derived from the icttech.ca /
// ictVoIP.ca reference worksheet's raw CAD/USD → ZAR conversions. Per that
// worksheet, these are NOT final sell prices — DIDWW wholesale cost data and
// a margin model still need to be applied. Every price is rendered on the
// site with an "illustrative pricing" note (see PricingDisclaimer component)
// until this is replaced with a real costed number.
//
// WHMCS NOTE: every `whmcsPid` / `whmcsBid` below is a placeholder. Replace
// with the real WHMCS product/bundle ID once catalog + pricing are final —
// see SETUP.md for the exact steps.

export type PricingStatus = 'illustrative-pending-costing';

export interface Plan {
  id: string;
  name: string;
  tagline: string;
  minutesIncluded: string;
  capacity: string; // seats, channels, or "pay-as-you-go" — label varies by catalog section
  didIncluded: string;
  features: string[];
  priceZAR: number;
  pricingStatus: PricingStatus;
  whmcsPid: number; // TODO: replace with real WHMCS product ID
  popular?: boolean;
}

// --- VoIP / SIP line plans (icttech.ca residential + business VoIP plans) ---
export const voipPlans: Plan[] = [
  {
    id: 'voip-paygo-plus',
    name: 'PayGo Plus',
    tagline: 'A real number, pay only for what you dial',
    minutesIncluded: 'Pay-as-you-go',
    capacity: '1 line',
    didIncluded: '1 local number included',
    features: [
      'Premium SIP quality',
      'International calling, billed per minute',
      'Month-to-month, no contract',
      'Full call log & reporting',
      'Free inter-network calling to other Kiatri numbers',
      'Voicemail to email',
      'Keep your existing number (porting supported)',
    ],
    priceZAR: 70.5,
    pricingStatus: 'illustrative-pending-costing',
    whmcsPid: 101, // TODO: replace with real WHMCS product ID
  },
  {
    id: 'voip-200-plus',
    name: '200 Plus',
    tagline: 'Perfect for a home office or a small team',
    minutesIncluded: '200 minutes included',
    capacity: '1–2 lines',
    didIncluded: '1 local number included',
    features: [
      'Premium SIP quality',
      'International calling',
      'Month-to-month, no contract',
      'Full call log & reporting',
      'Free inter-network calling to other Kiatri numbers',
      'Voicemail to email',
      'Keep your existing number (porting supported)',
      'Extra numbers available per line',
    ],
    priceZAR: 141.6,
    pricingStatus: 'illustrative-pending-costing',
    whmcsPid: 102, // TODO: replace with real WHMCS product ID
    popular: true,
  },
];

// --- Cloud PBX / tenant tiers (seats + minutes bundled, instant provisioning) ---
export const pbxTiers: Plan[] = [
  {
    id: 'pbx-5',
    name: 'PBX 5',
    tagline: 'Full PBX for a small team',
    minutesIncluded: '200 minutes included',
    capacity: '5 seats',
    didIncluded: '1 DID or port your number',
    features: [
      'Full PBX feature set',
      'Web-based admin portal',
      'Instant seat provisioning',
      'Bring your own IP phones, or use ours',
      'Simplified management, less IT workload',
    ],
    priceZAR: 543.2,
    pricingStatus: 'illustrative-pending-costing',
    whmcsPid: 201, // TODO: replace with real WHMCS product ID
  },
  {
    id: 'pbx-10',
    name: 'PBX 10',
    tagline: 'Growing teams that need more headroom',
    minutesIncluded: '800 minutes included',
    capacity: '10 seats',
    didIncluded: '1 DID or port your number',
    features: [
      'Full PBX feature set',
      'Web-based admin portal',
      'Instant seat provisioning',
      'Bring your own IP phones, or use ours',
      'Simplified management, less IT workload',
    ],
    priceZAR: 1038.4,
    pricingStatus: 'illustrative-pending-costing',
    whmcsPid: 202, // TODO: replace with real WHMCS product ID
    popular: true,
  },
  {
    id: 'pbx-25',
    name: 'PBX 25',
    tagline: 'Established offices and multi-department setups',
    minutesIncluded: '800 minutes included',
    capacity: '25 seats',
    didIncluded: '1 DID or port your number',
    features: [
      'Full PBX feature set',
      'Web-based admin portal',
      'Instant seat provisioning',
      'Bring your own IP phones, or use ours',
      'Simplified management, less IT workload',
    ],
    priceZAR: 2559.2,
    pricingStatus: 'illustrative-pending-costing',
    whmcsPid: 203, // TODO: replace with real WHMCS product ID
  },
];

// --- SIP trunk / calling capacity tiers (channels + bulk minutes) ---
export const trunkPlans: Plan[] = [
  {
    id: 'trunk-3400',
    name: 'Metro 3400',
    tagline: 'Entry-level trunk for a small call volume',
    minutesIncluded: '3,400 minutes included',
    capacity: '3 channels',
    didIncluded: '1 DID included',
    features: [
      'International calling',
      'Self-service control panel',
      'Global points of presence',
      'Multi-PBX support',
      'Automatic failover',
      'Live support',
    ],
    priceZAR: 770.1,
    pricingStatus: 'illustrative-pending-costing',
    whmcsPid: 301, // TODO: replace with real WHMCS product ID
  },
  {
    id: 'trunk-5400',
    name: 'Metro 5400',
    tagline: 'Our most popular trunk for growing call volume',
    minutesIncluded: '5,400 minutes included',
    capacity: '4 channels',
    didIncluded: '1 DID included',
    features: [
      'International calling',
      'Self-service control panel',
      'Global points of presence',
      'Multi-PBX support',
      'Automatic failover',
      'Live support',
    ],
    priceZAR: 1066.38,
    pricingStatus: 'illustrative-pending-costing',
    whmcsPid: 302, // TODO: replace with real WHMCS product ID
    popular: true,
  },
  {
    id: 'trunk-8400',
    name: 'Metro 8400',
    tagline: 'High-volume trunking for busy contact lines',
    minutesIncluded: '8,400 minutes included',
    capacity: '6 channels',
    didIncluded: '1 DID included',
    features: [
      'International calling',
      'Self-service control panel',
      'Global points of presence',
      'Multi-PBX support',
      'Automatic failover',
      'Live support',
    ],
    priceZAR: 1599.63,
    pricingStatus: 'illustrative-pending-costing',
    whmcsPid: 303, // TODO: replace with real WHMCS product ID
  },
];

// --- Call center features — roadmap framing, tied to the CommHub direction ---
// These are positioned as where Kiatri's call-center layer is headed, built on
// top of the PBX/trunk foundation above. Do not present as fully live without
// confirming current feature status first.
export interface RoadmapFeature {
  name: string;
  description: string;
  status: 'available' | 'roadmap';
}

export const callCenterFeatures: RoadmapFeature[] = [
  {
    name: 'Call queues',
    description: 'Route inbound calls into a queue with hold music and position announcements.',
    status: 'available',
  },
  {
    name: 'IVR / auto-attendant',
    description: 'Build multi-level menus so callers reach the right person or team on the first try.',
    status: 'available',
  },
  {
    name: 'Call recording',
    description: 'Record and archive calls for training, quality, and dispute resolution.',
    status: 'available',
  },
  {
    name: 'Live wallboards',
    description: 'Real-time queue and agent stats on a shared screen for the floor.',
    status: 'roadmap',
  },
  {
    name: 'CRM-aware call pop',
    description: 'Surface caller context automatically as calls come in.',
    status: 'roadmap',
  },
];

// --- WHMCS bundle example (seats + trunk sold together) ---
export interface Bundle {
  id: string;
  name: string;
  description: string;
  whmcsBid: number; // TODO: replace with real WHMCS bundle ID
}

export const bundles: Bundle[] = [
  {
    id: 'starter-bundle',
    name: 'Starter Office Bundle',
    description: 'PBX 5 seats + Metro 3400 trunk, provisioned together.',
    whmcsBid: 401, // TODO: replace with real WHMCS bundle ID
  },
];
