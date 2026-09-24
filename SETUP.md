# Setup — before you launch

This is a static marketing site. Everything below needs your attention before
this goes live for real customers.

## 0. Confirm the real domain (required)

`lib/site.ts` currently sets `SITE_URL = 'https://kiatri.com'`, matching the
brand name given in the original brief — but this client folder is named
`kiatri.co.za`, and earlier drafts of the Contact page used a `.co.za`
address. **Confirm which domain is actually correct** and update `SITE_URL`
in `lib/site.ts` if needed — it feeds the sitemap (`app/sitemap.ts`), the
Open Graph/canonical metadata (`app/layout.tsx`), and the support email
shown on the Contact page (`SUPPORT_EMAIL`, derived from `SITE_URL` so the
two can't drift out of sync again).

## 1. Replace WHMCS product/bundle IDs (required)

Every "Order Now" button on the site calls one of two helpers in
[`lib/whmcs.ts`](lib/whmcs.ts):

```ts
orderProductUrl(pid) // -> https://calling.kiatri.com/cart.php?a=add&pid={pid}
orderBundleUrl(bid)  // -> https://calling.kiatri.com/cart.php?a=add&bid={bid}
```

The IDs themselves live in **one file**: [`lib/products.ts`](lib/products.ts).
Each plan/bundle has a `whmcsPid` (or `whmcsBid`) field marked with a `// TODO`
comment — e.g.:

```ts
{
  id: 'pbx-5',
  name: 'PBX 5',
  ...
  whmcsPid: 201, // TODO: replace with real WHMCS product ID
}
```

Once your WHMCS product catalog and pricing are finalized, open
`lib/products.ts` and replace every `whmcsPid`/`whmcsBid` placeholder number
with the real WHMCS product/bundle ID from your admin panel (Setup → Products
→ your product → note the Product ID in the URL, or the Bundle ID for
bundles). No other file needs to change — every button on the site resolves
through these two functions.

If your WHMCS base URL is ever different from `https://calling.kiatri.com`,
update the single `WHMCS_BASE` constant at the top of `lib/whmcs.ts`.

The header's "Client Login" link (`components/Header.tsx`) currently points
to `https://calling.kiatri.com/clientarea.php`, WHMCS's default client-area
path — confirm this is actually the enabled login URL for your install
before launch (it's a guess based on the default install, not something
this session verified against the live site).

## 2. Replace placeholder pricing (required before real customers order)

`lib/products.ts` prices (`priceZAR`) are illustrative — derived from a raw
CAD/USD→ZAR conversion of a reference catalog, **not** a real costed South
African sell price (DIDWW wholesale cost + margin still need to be applied).
Every price on the site currently renders with an "Illustrative pricing"
note (`components/PricingDisclaimer.tsx`, and the smaller note under each
`PricingCard`).

Once real ZAR pricing is finalized:
1. Update `priceZAR` for each plan in `lib/products.ts`.
2. Optionally remove/soften the illustrative-pricing UI once every number on
   the page is a confirmed, final sell price — the disclaimer and per-card
   note are both driven from `pricingStatus: 'illustrative-pending-costing'`,
   so you can gate them on that field if you want some plans final and others
   still pending during a phased rollout.

## 2a. DIDWW cost research — confirmed vs still-open items (required)

`lib/products.ts` → `linePlans` (Pay-As-You-Go, Line 200, Line 800) pricing was
last revised against a real DIDWW sandbox quote and 2026 South African market
rates, not a pure currency conversion. Confirmed so far:

- Setup/NRC: R0.00 (DIDWW waives it on API-driven orders, which is how
  ictVoIP Box orders — reliable, not a fluke).
- Monthly DID rental (MRC): R13.02/month ($0.80 @ R16.27/USD).
- Inbound per-minute rate: R0.163/min ($0.01/min).

Still open — **confirm before treating `linePlans` pricing as final**:

1. **Outbound termination rate is not public.** DIDWW requires this be
   enabled via their sales team and pulled from the account portal (SIP
   Trunking → Rates → South Africa). The R0.35–R0.45/min PayGo sell rate in
   `linePlans` assumes outbound cost is roughly the same order of magnitude
   as the confirmed inbound rate — a placeholder, not a real cost basis.
   Outbound and inbound are often priced differently; get the real number
   before finalizing.
2. **DID+0 vs DID+2 not confirmed.** DIDWW numbers come in two types — DID+0
   (no bundled voice channels, capacity bought separately, lower MRC) or
   DID+2 (2 dedicated channels bundled in, higher MRC). Which type the
   R13.02/month quote represents hasn't been confirmed — this affects what
   capacity a customer actually gets for that price.
3. **Provincial coverage: only 4 of 9 confirmed.** Gauteng, KwaZulu-Natal,
   Western Cape, and Eastern Cape are confirmed available via real DID
   numbers seen in sandbox order history. Free State, Mpumalanga, North
   West, Northern Cape, and Limpopo are **not yet confirmed** — DIDWW's
   public pages don't list coverage, only their live DID Search tool does
   (ictVoIP Box → DID Search → South Africa → Region/Province dropdown).
   **Do not claim or imply nationwide South African coverage anywhere on
   the site until this is verified** — current copy is intentionally scoped
   to "major cities" rather than a national claim; keep it that way until
   confirmed.
4. **$30 minimum DIDWW account balance** to activate production (~R488
   one-time) is an operational cost to Kiatri, not something to pass to
   customers or mention in customer-facing copy.

Once the real outbound rate and DID type are confirmed, rebuild the PayGo
per-minute sell rate using ictVoIP's own formula — `Final Rate = (Base +
Custom) × (1 + Markup%)` — rather than the current placeholder, and update
the rate bullet in `linePlans[0].features` in `lib/products.ts` to match.

## 3. Replace `[REPLACE WITH REAL DATA]` placeholders (required)

Search the codebase for `REPLACE WITH REAL DATA` — every hit is a spot where
we deliberately avoided inventing a number, testimonial, or contact detail:

```bash
grep -rn "REPLACE WITH REAL DATA" app components
```

This includes: the About page support hours, the Contact page phone
number/email, the Business page SLA figure and integrations list.

Two sections aren't currently rendered at all rather than showing visible
placeholder text: the Home page's trust-bar stats (`components/TrustBar.tsx`
— uptime/response-time/review-score/customer-count) and its social-proof
section (testimonials/logos). Once real data exists for either, re-enable it
in `app/page.tsx` (the `<TrustBar />` import/render, and the commented-out
social-proof section) — see the comments there for exactly what to restore.

## 4. Legal pages (required — do not launch without this)

`app/legal/terms`, `app/legal/privacy`, and `app/legal/sla` all render a
`[LEGAL REVIEW NEEDED]` banner (`components/LegalBanner.tsx`) and contain
placeholder/boilerplate legal text only. Have a qualified legal professional
review and finalize all three before this site is used to actually process
customer orders. Once approved, you can remove the `<LegalBanner />` call
from each page.

The contracting entity is named as **Kiatri (Pty) Ltd** in Terms, Privacy,
About, and the footer copyright — search for `[LEGAL REVIEW NEEDED — insert
registration number]` in `app/legal/terms/page.tsx` and fill in the real
company registration number. Note: the site does **not** publicly disclose
any parent-company/ownership structure (e.g. a holding company) — that was a
deliberate choice pending your explicit confirmation that you want it public;
add it yourself in `app/about/page.tsx` if you do.

## 5. Brand (optional)

No existing kiatri.com brand assets were provided, so an original placeholder
look was designed: dark navy + a warm "ember" orange accent
(`tailwind.config.ts`), a text-based "k" wordmark (`components/Header.tsx`,
`components/Footer.tsx`), and hand-drawn inline SVG icons
(`components/icons/index.tsx`) instead of stock photography. To swap in real
branding:
- Update the `navy`/`ember` color values in `tailwind.config.ts`.
- Replace the `<span>k</span>` logo mark in `Header.tsx`/`Footer.tsx` with a
  real logo (SVG preferred, inlined or in `public/`).
- Set a real font in `app/globals.css` (`--font-sans`) and `app/layout.tsx`
  if you don't want the system-font fallback.

## 4a. Site structure — /pricing is canonical (post-consolidation)

The site previously had the same plan data duplicated across three pages. It
now works like this:

- **`/pricing`** — the single canonical page for every plan tier: VoIP
  Plans (PBX), Line Plans, SIP Trunk Plans, Residential — via the tabbed
  `PlanCategoryTabs` switcher (`components/PlanCategoryTabs.tsx`), plus the
  Call Center section and the bundled starter-price example. Every "Order
  Now" / "see pricing" link site-wide should point here.
- **`/business`** — narrative-only: SLA/support/trust pillars and the
  "VoIP Business Services" feature tour. It does **not** show plan tables —
  link to `/pricing` for those.
- **`/addons`** — standalone page for attachable extras (CallerID Block,
  Virtual Receptionist, Caller ID Lookup, Virtual Fax).
- **`/products`** and **`/small-business`** — retired. Each is now a thin
  redirect stub (meta-refresh + a link) pointing at `/pricing`
  (`/small-business` → `/pricing#line`), and `netlify.toml` carries a real
  301 for both on the deployed site. Keep both mechanisms — the static
  fallback page covers any host that doesn't apply Netlify's redirect rules.
- Tabs deep-link via URL hash: `/pricing#voip`, `#line`, `#trunks`,
  `#residential` each preselect that tab (see the `useEffect` in
  `PlanCategoryTabs.tsx`) and `/pricing#call-center` scrolls to the Call
  Center section. Use these exact hashes when linking to a specific tab.

## 6a. Still-missing pages (deliberately deferred, not oversights)

A gap review against typical UCaaS/contact-centre marketing sites turned up
more than could reasonably ship in one pass. Built so far, beyond the
original 8-page brief: `/faq`, `/security` (Security & Compliance), `/numbers`
(Numbers & Porting), plus SEO hygiene (`app/sitemap.ts`, `app/opengraph-image.tsx`,
OG/Twitter metadata in `app/layout.tsx`).

Still not built, and why:
- **Named competitor comparison pages** ("Kiatri vs X") — explicitly decided
  against, to avoid trademark/comparative-advertising risk. Revisit only if
  you deliberately want to take on that legal exposure.
- **Solutions-by-industry pages, integrations page, case studies, blog,
  partner/reseller page** — straightforward to add later; not built yet for
  lack of real content (industry-specific copy, actual integration list,
  real customer stories) rather than technical difficulty.
- **Book-a-demo/free-trial flow, support knowledge base with search, a real
  status/uptime-monitor page, API/developer docs** — each needs a real
  backend or third-party tool (a form service, a help-desk platform, an
  uptime-monitoring service, actual API documentation to publish), which
  is out of scope for a static marketing site with no backend of its own.
  Decide on tooling for these before building them.

## 6. Contact form (optional, currently a TODO)

The Contact page (`app/contact/page.tsx`) currently uses `mailto:`/`tel:`
links only, since this is a static site with no backend. If you want an
actual contact form, wire up a third-party form service (Formspree, Netlify
Forms, a serverless function) or point it at a WHMCS support-ticket API
endpoint.

## Running & deploying

```bash
npm install
npm run dev      # local dev server at http://localhost:3000
npm run build    # static export to ./out
```

Deploy target is Netlify by default (`netlify.toml` is already configured:
build = `npm run build`, publish = `out`) — connect the repo in the Netlify
dashboard and it should build with no extra configuration. The `out/` folder
is plain static files, so it also works unmodified on Vercel, GitHub Pages,
or any static host if you change hosts later.

## Verifying before launch

- `npm run build` completes without errors.
- Click through all pages in `npm run dev` — Home, Pricing (all four tabs:
  VoIP, Line, Trunk, Residential), Addons, Business, About, Contact, FAQ,
  Security, Numbers, and all three Legal pages. Also confirm `/products` and
  `/small-business` redirect to `/pricing` (and `/pricing#line`).
- Confirm every "Order Now"/"Get Started" button lands on the correct
  `calling.kiatri.com/cart.php?a=add&pid=...` URL with the **real** product
  ID once you've completed step 1 above.
- Run Lighthouse against the **deployed** Netlify URL, not local dev
  (`npm run dev` is unoptimized and won't reflect real production
  performance).
