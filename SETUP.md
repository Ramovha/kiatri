# Setup — before you launch

This is a static marketing site. Everything below needs your attention before
this goes live for real customers.

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

## 3. Replace `[REPLACE WITH REAL DATA]` placeholders (required)

Search the codebase for `REPLACE WITH REAL DATA` — every hit is a spot where
we deliberately avoided inventing a number, testimonial, or contact detail:

```bash
grep -rn "REPLACE WITH REAL DATA" app components
```

This includes: trust-bar stats on the Home page, the About page support
hours, the Contact page phone number/email, the Business page SLA figure and
integrations list.

## 4. Legal pages (required — do not launch without this)

`app/legal/terms`, `app/legal/privacy`, and `app/legal/sla` all render a
`[LEGAL REVIEW NEEDED]` banner (`components/LegalBanner.tsx`) and contain
placeholder/boilerplate legal text only. Have a qualified legal professional
review and finalize all three before this site is used to actually process
customer orders. Once approved, you can remove the `<LegalBanner />` call
from each page.

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
- Click through all pages in `npm run dev` — Home, Products, Pricing,
  Business, Small Business, About, Contact, and all three Legal pages.
- Confirm every "Order Now"/"Get Started" button lands on the correct
  `calling.kiatri.com/cart.php?a=add&pid=...` URL with the **real** product
  ID once you've completed step 1 above.
- Run Lighthouse against the **deployed** Netlify URL, not local dev
  (`npm run dev` is unoptimized and won't reflect real production
  performance).
