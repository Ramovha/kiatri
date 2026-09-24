import { linePlans, pbxTiers, trunkPlans, residentialPlans, homeProducts, Plan } from './products';
import { CALL_RATE } from './site';
import { formatZAR } from './format';

// Everything the /pricing page derives from the plan data: included-minute
// numbers, the "from" price, family price ranges (for structured data), the
// "best for" labels and the FAQ. Nothing here is hardcoded twice — prices and
// minutes are always read from lib/products.ts.

export { CALL_RATE };

export function includedMinutes(plan: { minutesIncluded: string }): number | null {
  // Handles "1,600" and "1 600" (with a normal or non-breaking space).
  const match = plan.minutesIncluded.match(/^([\d,\s\u00a0]+?)\s+minutes/);
  return match ? Number(match[1].replace(/[^\d]/g, '')) : null;
}

// 1600 -> "1 600" (South African grouping, same as formatZAR).
export function formatMinutes(minutes: number): string {
  return minutes.toLocaleString('en-ZA');
}

export const homePayg = residentialPlans.find((plan) => plan.id === 'residential-payg')!;
export const businessPayg = linePlans.find((plan) => plan.id === 'line-payg')!;
export const meteredTrunks = trunkPlans.filter((plan) => typeof plan.priceZAR === 'number');

const linePrices = [homePayg, businessPayg].map((plan) => plan.priceZAR!);
export const LINES_FROM_ZAR = Math.min(...linePrices);
export const PBX_FROM_ZAR = Math.min(...pbxTiers.map((plan) => plan.priceZAR!));

export const BEST_FOR: Record<string, string> = {
  'residential-payg': 'Light or occasional calling',
  'home-200': 'Everyday home calling',
  'home-400': 'Busy households',
  'line-payg': 'Light or occasional calling',
  'line-200': 'Solo professionals',
  'line-800': 'Busy small offices',
  'line-1600': 'Growing offices',
  'line-3200': 'High-volume offices',
  'pbx-5': 'Small teams of up to 5',
  'pbx-10': 'Teams of up to 10',
  'pbx-25': 'Growing teams of up to 25',
  'pbx-50': 'Larger teams of up to 50',
  'trunk-3400': 'Steady business calling',
  'trunk-5400': 'Heavy business calling',
  'trunk-8400': 'High-volume calling',
};

function range(prices: number[]) {
  return { low: Math.min(...prices), high: Math.max(...prices), count: prices.length };
}

export const FAMILY_PRICE_RANGES = {
  home: range([homePayg.priceZAR!, ...homeProducts.map((product) => product.priceZAR)]),
  business: range(linePlans.map((plan) => plan.priceZAR!)),
  pbx: range(pbxTiers.map((plan) => plan.priceZAR!)),
  trunk: range(meteredTrunks.map((plan) => plan.priceZAR!)),
};

export interface FaqItem {
  question: string;
  answer: string;
}

export const PRICING_FAQS: FaqItem[] = [
  {
    question: 'How much does VoIP cost in South Africa with Kiatri?',
    answer: `Lines start from ${formatZAR(LINES_FROM_ZAR)} per month and calls from ${CALL_RATE} per minute, with no VAT added. Cloud PBX plans for teams start from ${formatZAR(PBX_FROM_ZAR)} per month for 5 users, and every Cloud PBX tier includes its minutes every month, then calls from ${CALL_RATE} per minute.`,
  },
  {
    question: 'What is a cloud PBX?',
    answer:
      'A cloud PBX is a complete business phone system hosted online. Your team gets extensions, call routing and an auto-attendant without buying hardware.',
  },
  {
    question: 'Can I keep my existing phone number?',
    answer: 'Yes. You can port your current South African number to Kiatri, or choose a new local number.',
  },
  {
    question: 'Are there any surprise charges?',
    answer:
      'No. Prepaid plans let you control your spend and top up anytime, and Capped plans have one fixed monthly price.',
  },
  {
    question: 'Do you offer VoIP for home use?',
    answer:
      'Yes. Our Home Line plans give you a reliable home phone line with a real local number, on pay-as-you-go or a monthly bundle.',
  },
  {
    question: 'Is there a lock-in period?',
    answer:
      'Pay-as-you-go plans have no lock-in. Larger businesses can choose a Business Account with one monthly invoice.',
  },
  {
    question: 'Do you offer international calling?',
    answer: 'International calling is coming soon. Local South African calling is available now.',
  },
];

export type { Plan };
