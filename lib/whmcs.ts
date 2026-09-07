// Every "Order Now" / "Get Started" button on the site must resolve through
// one of these two helpers rather than a hardcoded URL, so that plugging in
// real WHMCS IDs later is a single-file edit (lib/products.ts) — see SETUP.md.

const WHMCS_BASE = 'https://calling.kiatri.com/cart.php';

export function orderProductUrl(pid: number): string {
  return `${WHMCS_BASE}?a=add&pid=${pid}`;
}

export function orderBundleUrl(bid: number): string {
  return `${WHMCS_BASE}?a=add&bid=${bid}`;
}
