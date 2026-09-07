# Competitive positioning notes (internal — not for the live site)

This file names real competitors for the client's own reference. None of
this appears in the site's actual copy (`app/**`, `components/**`) — the
live site never names a competitor, per the brief's constraint.

## Research method
Reviewed public marketing/pricing pages and third-party pricing breakdowns
for RingCentral, Nextiva, Dialpad, 8x8, Vonage Business, and Aircall via web
search (September 2026) — structural/positioning patterns only, no copy or
layout code was copied.

## Patterns adopted, and why

**Itemized, unbundled pricing (seats vs. calling capacity shown separately).**
All three of RingCentral, Nextiva, and Dialpad lead with a low per-seat
"starting at" price that excludes calling capacity, add-ons, and features
most businesses end up needing — the real cost only appears once you start
configuring ([Cloudtalk: RingCentral pricing](https://www.cloudtalk.io/blog/ringcentral-pricing/),
[Ringly: Dialpad pricing](https://www.ringly.io/blog/dialpad-pricing)). We
adopted the opposite: the Pricing page shows Cloud PBX seat tiers and SIP
trunk calling tiers as two separate itemized tables (`app/pricing/page.tsx`),
with an explicit "device vs. airtime" framing, plus one representative
combined "starting from" figure for people who just want a single number.
This is more honest and, per the brief, should reduce checkout confusion and
buyer's remorse.

**Trust-bar pattern (uptime / support / reviews / customer count) up top.**
Every major competitor puts some version of a stats bar near the hero. We
kept the pattern (`components/TrustBar.tsx`) because it's a proven trust
signal, but populated it with `[REPLACE WITH REAL DATA]` placeholders rather
than inventing numbers — the brief explicitly prohibits fabricating
uptime/review figures, and a fake-looking stat bar would undermine the exact
trust it's meant to build.

**Fast-provisioning as the headline claim, not a footnote.** Enterprise
incumbents generally gate anything beyond a self-serve trial behind a sales
call. Kiatri's actual technical differentiator — ictVoIP Box automated
provisioning after payment — became the hero headline and repeats across
Home, Small Business, and B2C-style CTA copy ("live in minutes, not days").

**Per-seat tiered cards with a "Most popular" highlight.** A near-universal
SaaS pricing pattern (all six competitors use some form of this). Kept
structurally (`components/PricingCard.tsx`) because it's a well-understood
UI convention, not because any single competitor's specific card design was
copied — layout, colors, and copy are original.

## Patterns deliberately avoided, and why

**Vague "starting from $X/user" as the only price shown.** This is the
single biggest pattern we pushed against — see "itemized pricing" above. It
works for competitors optimizing for a low anchor price on a landing page,
but it's the exact confusion the brief asked us to fix.

**Global-enterprise-scale framing (8x8's positioning).** 8x8 markets scale
and global reach as its main differentiator. Kiatri is intentionally a
smaller, more personal, South Africa-focused operation — claiming
enterprise-global scale would be both false and off-strategy. The About page
leans into "a smaller company, on purpose" instead.

**Integration-breadth-first framing (Aircall's positioning).** Aircall leads
with "every call logged to Salesforce/HubSpot/Zendesk automatically."
Kiatri doesn't yet have a comparable integration catalog, so the Business
page lists integrations as an honest `[REPLACE WITH REAL DATA]` placeholder
rather than overclaiming — once real integrations exist, this section is
ready to fill in without restructuring the page.

**Generic stock photography / cluttered feature-grid pages.** Common across
the incumbent sites (handshake/headset stock photos, dense feature-comparison
tables). We used hand-drawn inline SVG icons (`components/icons/`) and fewer,
better-labeled feature groups instead, per the brief's "more personality and
clarity" direction.

**Naming competitors on-site.** Never done, anywhere in `app/**` or
`components/**` — verified by grepping the built site for competitor names
before calling this done (see `SETUP.md` verification section). Avoids
trademark/comparative-advertising risk the brief flagged.
