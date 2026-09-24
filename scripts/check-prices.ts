/**
 * Price check: the billing system is the source of truth.
 *
 * Reads every price the customer would be charged from the billing system's
 * public storefront and cart (product listings, and real carts for bundles and
 * addons), then compares them with lib/products.ts and lib/addons.ts. Any
 * difference is printed and the script exits 1.
 *
 *   npm run check:prices                 report, exit 1 on any difference
 *   PRICE_CHECK_STRICT=1 npm run build   same check as part of the build
 *   SKIP_PRICE_CHECK=1                   skip (offline work)
 *
 * As a build step (`prebuild`) it FAILS the build when a price differs on the
 * production branch (main) and prints warnings on every other branch, so
 * previews can still be reviewed. An unreachable billing system is a warning,
 * never a failed deploy: it cannot tell us that anything differs.
 *
 * It uses no credentials. If API credentials are ever added, the reads in
 * `fetchBilling()` are the only part that would change.
 */
import { linePlans, pbxTiers, trunkPlans, residentialPlans, homeProducts, addons, phoneHardwareOptions, callCenterTiers } from '../lib/products';
import { CALL_RATE } from '../lib/site';

const BASE = process.env.BILLING_BASE_URL ?? 'https://calling.kiatri.com';
const GROUPS = ['home-voice', 'connect-a-phone', 'business-line-plans', 'addons', 'sip-trunks'];

const isHook = process.argv.includes('--hook');
const onMain = process.env.CF_PAGES_BRANCH === 'main' || process.env.GITHUB_REF_NAME === 'main';
const strict = process.env.PRICE_CHECK_STRICT === '1' || (isHook && onMain) || !isHook;

if (process.env.SKIP_PRICE_CHECK === '1') {
  console.log('price check skipped (SKIP_PRICE_CHECK=1)');
  process.exit(0);
}

// ---- tiny HTTP client with a cookie jar and manual redirects ---------------
type Jar = Map<string, string>;
async function get(path: string, jar: Jar, hops = 15): Promise<string> {
  let url = path.startsWith('http') ? path : BASE + path;
  for (let i = 0; i < hops; i++) {
    const res = await fetch(url, {
      redirect: 'manual',
      headers: { cookie: Array.from(jar.entries()).map(([k, v]) => `${k}=${v}`).join('; '), 'user-agent': 'kiatri-price-check' },
      signal: AbortSignal.timeout(20000),
    });
    for (const c of res.headers.getSetCookie()) {
      const [kv] = c.split(';');
      const eq = kv.indexOf('=');
      jar.set(kv.slice(0, eq), kv.slice(eq + 1));
    }
    const loc = res.headers.get('location');
    if (res.status >= 300 && res.status < 400 && loc) {
      url = new URL(loc, url).toString();
      continue;
    }
    return res.text();
  }
  throw new Error('too many redirects for ' + path);
}

const text = (html: string) =>
  html
    .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
const money = (s: string) => Number(s.replace(/,/g, ''));

interface Price { monthly?: number; once?: number; setup: number }

// ---- billing side -----------------------------------------------------------
interface Billing {
  products: Record<number, Price & { name: string; desc: string }>;
  bundles: Record<number, Price>;
  addons: Record<number, Price & { name: string }>; // Product Addon id -> price
}

function parsePriceText(t: string): Price {
  const amounts = Array.from(t.matchAll(/R([\d,]+\.\d\d) ZAR/g)).map((m) => money(m[1]));
  const setupMatch = t.match(/R([\d,]+\.\d\d) ZAR Setup Fee|R([\d,]+\.\d\d) Setup Fee/);
  const setup = setupMatch ? money(setupMatch[1] ?? setupMatch[2]) : 0;
  const first = amounts[0];
  // A price with no billing-cycle word ("R1,499.00 ZAR") is a once-off price.
  return /Monthly/i.test(t) ? { monthly: first, setup } : { once: first, setup };
}

// Cart lines: "<name> Edit Remove ... R220.00 ZAR Monthly" and addons
// "<name> Addon R60.00 ZAR Monthly R40.00 Setup Fee".
function parseCart(html: string) {
  const t = text(html);
  const body = t.slice(t.indexOf('Product/Options'), t.indexOf('Apply Promo Code') > 0 ? t.indexOf('Apply Promo Code') : undefined);
  const lines: { name: string; addon: boolean; monthly: number; setup: number }[] = [];
  const re = /([A-Za-z0-9][A-Za-z0-9 ()\/.\-]*?) (Edit Remove .*?|Addon )R([\d,]+\.\d\d) ZAR (Monthly|One Time|Annually)(?: R([\d,]+\.\d\d) Setup Fee)?/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(body))) {
    lines.push({ name: m[1].trim(), addon: m[2].startsWith('Addon'), monthly: m[4] === 'Monthly' ? money(m[3]) : 0, setup: m[5] ? money(m[5]) : 0 });
  }
  return lines;
}

async function fetchBilling(): Promise<Billing> {
  const out: Billing = { products: {}, bundles: {}, addons: {} };

  for (const slug of GROUPS) {
    const html = await get(`/index.php?rp=/store/${slug}`, new Map());
    for (const chunk of html.split(/<div class="product clearfix" id="product(?=\d)/).slice(1)) {
      const pid = Number(chunk.match(/^(\d+)"/)![1]);
      const name = text(chunk.match(/id="product\d+-name">([\s\S]*?)<\/span>/)?.[1] ?? '');
      const priceHtml = chunk.match(/id="product\d+-price">([\s\S]*?)<\/div>/)?.[1] ?? '';
      const desc = text(chunk.match(/id="product\d+-description">([\s\S]*?)<\/p>/)?.[1] ?? '');
      out.products[pid] = { name, desc, ...parsePriceText(text(priceHtml)) };
    }
  }

  // Bundles: add each to a fresh cart and total the lines it creates.
  for (const bid of [1, 2, 3, 4, 5, 6, 7, 8]) {
    const jar: Jar = new Map();
    await get('/cart.php?a=add&bid=' + bid, jar);
    const lines = parseCart(await get('/cart.php?a=view', jar));
    out.bundles[bid] = { monthly: lines.reduce((n, l) => n + l.monthly, 0), setup: lines.reduce((n, l) => n + l.setup, 0) };
  }

  // Product Addons: attach all of them to a business line and read the lines.
  {
    const jar: Jar = new Map();
    await get('/cart.php?a=add&pid=9&billingcycle=monthly&skipconfig=1&addons%5B4%5D=on&addons%5B5%5D=on&addons%5B6%5D=on', jar);
    const lines = parseCart(await get('/cart.php?a=view', jar));
    const byName = Object.fromEntries(lines.filter((l) => l.addon).map((l) => [l.name, l]));
    const ids: Record<number, string> = { 4: 'CallerID Block/Blacklist', 5: 'Virtual Receptionist (IVR)', 6: 'Virtual Fax' };
    for (const [id, name] of Object.entries(ids)) {
      const line = byName[name];
      if (line) out.addons[Number(id)] = { name, monthly: line.monthly, setup: line.setup };
    }
  }
  return out;
}

// ---- site side --------------------------------------------------------------
interface Diff { what: string; site: string; billing: string }
const diffs: Diff[] = [];
const notes: string[] = [];
const zar = (n?: number) => (n === undefined ? '—' : `R${n.toFixed(2)}`);

let compared = 0;
function compare(what: string, site: number | undefined, billing: number | undefined) {
  if (site === undefined && billing === undefined) return;
  compared++;
  if (site === undefined || billing === undefined || Math.abs(site - billing) > 0.004) diffs.push({ what, site: zar(site), billing: zar(billing) });
}

function compareAll(b: Billing) {
  const sitePids = new Set<number>(); // products the site actually sells
  const prod = (pid: number | undefined, label: string, site: { priceZAR?: number }, once = false, siteSetup = 0) => {
    if (pid === undefined) return;
    sitePids.add(pid);
    const p = b.products[pid];
    if (!p) return void diffs.push({ what: `${label} (pid ${pid}) not found in billing`, site: zar(site.priceZAR), billing: '—' });
    compare(`${label} (pid ${pid}) price`, site.priceZAR, once ? p.once : p.monthly);
    compare(`${label} (pid ${pid}) setup fee`, siteSetup, p.setup);
  };

  for (const p of linePlans) prod(p.whmcsPid, p.name === 'Pay-As-You-Go' ? 'Business Line Pay-As-You-Go' : p.name, p);
  for (const p of trunkPlans) prod(p.whmcsPid, p.name, p);
  for (const p of residentialPlans) prod(p.whmcsPid, p.name, p);
  for (const p of homeProducts) if (p.whmcsPid) prod(p.whmcsPid, p.name, { priceZAR: p.priceZAR });
  for (const h of phoneHardwareOptions) if (h.whmcsPid) prod(h.whmcsPid, h.name, h, h.priceSuffix === 'once-off');

  for (const p of pbxTiers) {
    const bundle = b.bundles[p.whmcsBid!];
    compare(`${p.name} (bid ${p.whmcsBid}) monthly total`, p.priceZAR, bundle?.monthly);
    compare(`${p.name} (bid ${p.whmcsBid}) setup`, 0, bundle?.setup);
  }
  for (const t of callCenterTiers) {
    if (t.whmcsBid) {
      compare(`${t.name} (bid ${t.whmcsBid}) monthly total`, t.priceZAR, b.bundles[t.whmcsBid]?.monthly);
    }
    if (t.usagePricing?.whmcsBid) {
      compare(`${t.name} usage-based (bid ${t.usagePricing.whmcsBid}) monthly total`, t.usagePricing.baseZAR, b.bundles[t.usagePricing.whmcsBid]?.monthly);
    }
  }
  for (const a of addons) {
    if (!a.whmcsAddonId) continue;
    const billing = b.addons[a.whmcsAddonId];
    compare(`${a.name} (addon ${a.whmcsAddonId}) monthly`, a.priceZAR, billing?.monthly);
    compare(`${a.name} (addon ${a.whmcsAddonId}) setup fee`, a.setupFeeZAR ?? 0, billing?.setup);
  }
  // Virtual Fax is also sold on its own (pid 13).
  const fax = addons.find((a) => a.slug === 'fax');
  if (fax?.whmcsPid) prod(fax.whmcsPid, 'Virtual Fax (sold on its own)', fax);

  // Call rate quoted in the billing system's own product descriptions.
  const siteRate = money(CALL_RATE.replace('R', '').replace(',', '.'));
  const rates = new Map<string, number[]>();
  for (const [pid, p] of Object.entries(b.products)) {
    if (!sitePids.has(Number(pid))) continue;
    const m = p.desc.match(/R(\d+[.,]\d+)\/min/);
    if (m) rates.set(pid, [Number(m[1].replace(',', '.'))]);
  }
  Array.from(rates.entries()).forEach(([pid, [rate]]) => compare(`Call rate quoted in billing product "${b.products[Number(pid)].name}" (pid ${pid})`, siteRate, rate));
}

async function main() {
  let billing: Billing;
  try {
    billing = await fetchBilling();
  } catch (err) {
    console.warn(`⚠ price check could not reach the billing system (${(err as Error).message}). Nothing was compared.`);
    process.exit(process.env.PRICE_CHECK_STRICT === '1' ? 1 : 0);
  }
  compareAll(billing);
  for (const n of notes) console.log(n);
  if (diffs.length === 0) {
    console.log(`✓ price check: all ${compared} prices match the billing system.`);
    return;
  }
  const w = Math.max(...diffs.map((d) => d.what.length));
  console.log(`\n${strict ? '✗' : '⚠'} price check: ${diffs.length} of ${compared} compared prices differ between the site and the billing system\n`);
  console.log('  ' + 'ITEM'.padEnd(w) + '  SITE        BILLING');
  for (const d of diffs) console.log('  ' + d.what.padEnd(w) + '  ' + d.site.padEnd(10) + '  ' + d.billing);
  console.log('\nThe billing system is the source of truth: fix lib/products.ts (or the billing system), then re-run.');
  if (strict) process.exit(1);
}

main();
