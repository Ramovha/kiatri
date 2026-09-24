// Every "Order Now" / "Get Started" button on the site must resolve through
// one of these helpers rather than a hardcoded URL, so order IDs live in one
// place (lib/products.ts).

const WHMCS_BASE = 'https://calling.kiatri.com/cart.php';

export type BillingCycle = 'monthly' | 'annually';

function cycleParam(billingCycle: BillingCycle): string {
  return billingCycle === 'annually' ? '&billingcycle=annually' : '';
}

export function orderProductUrl(pid: number, billingCycle: BillingCycle = 'monthly'): string {
  return `${WHMCS_BASE}?a=add&pid=${pid}${cycleParam(billingCycle)}`;
}

// KNOWN LIMITATION: `billingcycle=annually` is confirmed reliable for plain
// products (orderProductUrl above), but there are documented community
// reports that WHMCS does NOT reliably pre-select it for bundles (`bid=`)
// the same way. This has not yet been tested against our own WHMCS install —
// do that before relying on it. It isn't a broken experience either way:
// WHMCS's cart/checkout page always shows its own billing-cycle dropdown
// regardless of this URL param, so a customer can still pick Annual there
// manually if it doesn't arrive pre-selected. Ship the attempt; don't block
// the Yearly toggle on confirming this works — see SETUP.md.
export function orderBundleUrl(bid: number, billingCycle: BillingCycle = 'monthly'): string {
  return `${WHMCS_BASE}?a=add&bid=${bid}${cycleParam(billingCycle)}`;
}

// The one place that decides how a plan is ordered: a bundle (bid) wins over a
// product (pid); a plan with neither has no order link and returns null, so
// callers render a disabled "Coming soon" button instead of a broken link.
export function planOrderUrl(
  plan: { whmcsPid?: number; whmcsBid?: number; comingSoon?: boolean },
  billingCycle: BillingCycle = 'monthly',
): string | null {
  if (plan.comingSoon) return null;
  if (typeof plan.whmcsBid === 'number') return orderBundleUrl(plan.whmcsBid, billingCycle);
  if (typeof plan.whmcsPid === 'number') return orderProductUrl(plan.whmcsPid, billingCycle);
  return null;
}
