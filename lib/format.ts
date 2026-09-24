export function formatZAR(amount: number): string {
  return `R${amount.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export type BillingPeriod = 'monthly' | 'yearly';

// Illustrative — confirm the final percentage before launch. Applied only
// when a visitor explicitly switches to Yearly; Monthly pricing never
// changes.
export const YEARLY_DISCOUNT_RATE = 0.15;

// Monthly-equivalent price when billed annually — e.g. R543.20 -> R461.72.
export function yearlyMonthlyEquivalent(monthlyPriceZAR: number): number {
  return monthlyPriceZAR * (1 - YEARLY_DISCOUNT_RATE);
}

// Pulls a usable channel count out of a capacity string for the channel
// visualizer — e.g. "4 channels" -> 4, "1–2 channels" -> 2 (takes the upper
// end of a range so the visualizer shows the most it can actually carry).
export function parseChannelCount(capacity: string): number {
  const numbers = capacity.match(/\d+/g);
  if (!numbers || numbers.length === 0) return 1;
  return Number(numbers[numbers.length - 1]);
}
