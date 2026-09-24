// Every "Order Now" / "Get Started" button on the site must resolve through
// one of these helpers rather than a hardcoded URL, so order IDs live in one
// place (lib/products.ts).

const WHMCS_BASE = 'https://calling.kiatri.com/cart.php';

export type BillingCycle = 'monthly' | 'annually';

function cycleParam(billingCycle: BillingCycle): string {
  return billingCycle === 'annually' ? '&billingcycle=annually' : '';
}

// One-click cart page on the billing site (source: whmcs/kiatri-cart.php).
// Accepts every selected item in one link, adds them all, then opens checkout.
export const KIATRI_CART_URL = 'https://calling.kiatri.com/kiatri-cart.php';

// Direct add link for a single product. skipconfig=1 sends the customer
// straight to the cart when the product has no required fields.
export function orderProductUrl(pid: number, billingCycle: BillingCycle = 'monthly'): string {
  return `${WHMCS_BASE}?a=add&pid=${pid}&billingcycle=${billingCycle}&skipconfig=1`;
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

type OrderableLike = { whmcsPid?: number; whmcsBid?: number; comingSoon?: boolean };

// "bid:2,pid:26,pid:12" — bundles first-class alongside products.
export function cartItemToken(plan: OrderableLike): string | null {
  if (plan.comingSoon) return null;
  if (typeof plan.whmcsBid === 'number') return `bid:${plan.whmcsBid}`;
  if (typeof plan.whmcsPid === 'number') return `pid:${plan.whmcsPid}`;
  return null;
}

// One link for everything selected. Returns null when nothing can be ordered
// or ANY selected item has no order link yet, so a partial order is never
// sent to checkout.
export function orderCartUrl(plans: OrderableLike[], billingCycle: BillingCycle = 'monthly'): string | null {
  if (plans.length === 0) return null;
  const tokens = plans.map(cartItemToken);
  if (tokens.some((token) => token === null)) return null;
  return `${KIATRI_CART_URL}?items=${tokens.join(',')}&cycle=${billingCycle}`;
}
