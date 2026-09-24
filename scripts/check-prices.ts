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
import { CALL_RATE, YEARLY_PRICING_BUNDLES } from '../lib/site';
import { addonAvailability, builderAddons, PlanFamily } from '../lib/addons';

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
      signal: AbortSignal.timeout(60000),
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

async function post(path: string, body: string, jar: Jar): Promise<string> {
  const url = path.startsWith('http') ? path : BASE + path;
  const res = await fetch(url, {
    method: 'POST',
    redirect: 'manual',
    body,
    headers: { cookie: Array.from(jar.entries()).map(([k, v]) => `${k}=${v}`).join('; '), 'content-type': 'application/x-www-form-urlencoded', 'user-agent': 'kiatri-price-check' },
    signal: AbortSignal.timeout(60000),
  });
  return res.text();
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
  yearlyBundles: Record<number, boolean>; // bundle id -> billing really has an annual cycle
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
  const out: Billing = { products: {}, bundles: {}, addons: {}, yearlyBundles: {} };

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

  // Yearly: only for bundles the site offers a Yearly option on. Adding one
  // with billingcycle=annually must produce Annually lines in the cart.
  for (const bid of YEARLY_PRICING_BUNDLES) {
    const jar: Jar = new Map();
    await get(`/cart.php?a=add&bid=${bid}&billingcycle=annually`, jar);
    out.yearlyBundles[bid] = /ZAR Annually/.test(text(await get('/cart.php?a=view', jar)));
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

  // The site only offers Yearly where billing has an annual price.
  for (const bid of YEARLY_PRICING_BUNDLES) {
    compared++;
    if (!b.yearlyBundles[bid]) diffs.push({ what: `Yearly offered on the site for bundle ${bid}`, site: 'Yearly', billing: 'no annual price' });
  }
  if (YEARLY_PRICING_BUNDLES.length === 0) notes.push('· yearly pricing: not offered on the site (YEARLY_PRICING_BUNDLES is empty)');

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

// ---- addon attachment check ---------------------------------------------------
// Every plan + addon combination the site offers as a toggle is added to a live
// cart, and billing must attach it to that plan. Products take the addon on the
// add link; a bundle's addon attaches to its PBX product by submitting that
// cart item's configure form — exactly what whmcs/kiatri-cart.php does.
// Keep these in step with BUNDLE_PBX_TITLE in whmcs/kiatri-cart.php.
const BUNDLE_PBX_TITLE: Record<number, string> = { 1: 'PBX 5', 2: 'PBX 10', 3: 'PBX 25', 4: 'PBX 50', 5: 'PBX 10', 6: 'PBX 25' };

interface Combo { label: string; family: PlanFamily; pid?: number; bid?: number; addonId: number; addonName: string }

function offeredCombos(): Combo[] {
  const plans: { label: string; family: PlanFamily; pid?: number; bid?: number }[] = [
    // Home 200/400 are ordered through their Prepaid style (a product of its own).
    ...residentialPlans.flatMap((p) => {
      const pid = p.whmcsPid ?? p.orderStyles?.find((style) => style.whmcsPid)?.whmcsPid;
      return pid ? [{ label: p.name, family: 'home' as const, pid }] : [];
    }),
    ...linePlans.map((p) => ({ label: p.name === 'Pay-As-You-Go' ? 'Business Line Pay-As-You-Go' : p.name, family: 'business' as const, pid: p.whmcsPid })),
    ...pbxTiers.map((p) => ({ label: p.name, family: 'pbx' as const, bid: p.whmcsBid })),
    ...callCenterTiers.filter((t) => t.whmcsBid).map((t) => ({ label: t.name, family: 'pbx' as const, bid: t.whmcsBid })),
    ...trunkPlans.filter((p) => p.whmcsPid).map((p) => ({ label: p.name, family: 'trunk' as const, pid: p.whmcsPid })),
  ];
  const combos: Combo[] = [];
  for (const plan of plans) {
    for (const addon of builderAddons) {
      if (addonAvailability(addon, plan.family).state === 'available' && addon.whmcsAddonId) {
        combos.push({ ...plan, addonId: addon.whmcsAddonId, addonName: addon.name });
      }
    }
  }
  return combos;
}

async function attaches(c: Combo): Promise<string | null> {
  const jar: Jar = new Map();
  const wanted = `${c.addonName} Addon`;
  if (c.pid !== undefined) {
    await get(`/cart.php?a=add&pid=${c.pid}&billingcycle=monthly&skipconfig=1&addons%5B${c.addonId}%5D=on`, jar);
  } else {
    await get(`/cart.php?a=add&bid=${c.bid}`, jar);
    const view = await get('/cart.php?a=view', jar);
    const title = BUNDLE_PBX_TITLE[c.bid!];
    const found = Array.from(view.matchAll(/class="item-title">\s*([^<]*?)\s*<a[^>]*href="[^"]*a=confproduct&(?:amp;)?i=(\d+)"/g)).filter((m) => m[1] === title);
    if (found.length === 0) return `could not find "${title}" in the cart`;
    const index = found[found.length - 1][2];
    const conf = await get(`/cart.php?a=confproduct&i=${index}`, jar);
    if (!conf.includes(`name="addons[${c.addonId}]"`)) return 'billing does not offer this addon on the PBX product in the bundle';
    const token = conf.match(/name="token"\s+value="([^"]+)"/)?.[1];
    if (!token) return 'no form token on the configure page';
    await post(`/cart.php?a=confproduct&i=${index}`, new URLSearchParams({ token, configure: 'true', i: index, [`addons[${c.addonId}]`]: 'on' }).toString(), jar);
  }
  const after = text(await get('/cart.php?a=view', jar));
  if (!after.includes(wanted)) return c.pid !== undefined ? 'billing did not attach the addon to the product' : 'the addon did not attach after the configure form was submitted';
  return null;
}

async function checkAddonAttachments() {
  // ADDON_CHECK_ONLY="PBX 10" limits the run to one plan; ADDON_CHECK_VERBOSE=1 prints every result.
  const only = process.env.ADDON_CHECK_ONLY;
  const queue = offeredCombos().filter((c) => !only || c.label === only);
  const failures: { combo: Combo; why: string }[] = [];
  const unverified: string[] = [];
  // A time budget (default 8 minutes) keeps a slow billing site from stalling a build:
  // combinations not reached in time are reported as unverified, never as passing.
  const deadline = Date.now() + Number(process.env.ADDON_CHECK_BUDGET_MS ?? 8 * 60 * 1000);
  await Promise.all(
    Array.from({ length: 4 }, async () => {
      for (let c = queue.shift(); c; c = queue.shift()) {
        if (Date.now() > deadline) {
          unverified.push(`${c.label} + ${c.addonName} (out of time)`);
          continue;
        }
        let why: string | null;
        try {
          why = await attaches(c);
        } catch {
          try {
            why = await attaches(c); // one retry: the billing site can be slow
          } catch (err) {
            unverified.push(`${c.label} + ${c.addonName} (${(err as Error).message})`);
            continue;
          }
        }
        compared++;
        if (process.env.ADDON_CHECK_VERBOSE === '1') console.log(`  ${why ? '✗' : '✓'} ${c.label} + ${c.addonName}${why ? ' — ' + why : ''}`);
        if (why) failures.push({ combo: c, why });
      }
    }),
  );
  if (unverified.length) notes.push(`⚠ ${unverified.length} toggle combination(s) could not be checked (billing too slow or unreachable): ${unverified.join('; ')}`);
  failures
    .sort((a, b) => (a.combo.label + a.combo.addonName).localeCompare(b.combo.label + b.combo.addonName))
    .forEach(({ combo, why }) => diffs.push({ what: `Toggle offered: ${combo.label} + ${combo.addonName} (${why})`, site: 'offered', billing: 'not attached' }));
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
  if (process.env.SKIP_ADDON_CHECK !== '1') {
    try {
      await checkAddonAttachments();
    } catch (err) {
      console.warn(`⚠ addon attachment check could not run (${(err as Error).message}).`);
    }
  }
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
