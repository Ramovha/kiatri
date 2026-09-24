// Every "Order Now" / "Get Started" button on the site must resolve through
// one of these two helpers rather than a hardcoded URL, so that plugging in
// real WHMCS IDs later is a single-file edit (lib/products.ts) — see SETUP.md.

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
