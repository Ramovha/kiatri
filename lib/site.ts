// TODO: confirm the real production domain before launch — the original
// brief names the brand "kiatri.com" (matching the calling.kiatri.com WHMCS
// subdomain), but this client folder is named kiatri.co.za. Update SITE_URL
// once the actual domain is confirmed; it feeds the sitemap and OG/canonical
// metadata, so getting it wrong doesn't break the build but does mean wrong
// URLs in search results and social previews.
export const SITE_URL = 'https://kiatri.com';

export const SITE_NAME = 'Kiatri';

// Derived from SITE_URL so the domain can never drift out of sync between
// metadata (sitemap/OG) and on-page contact details — fix SITE_URL above and
// this follows automatically.
export const SUPPORT_EMAIL = `hello@${new URL(SITE_URL).hostname}`;

// Headline per-minute rate for South African calls. Defined once here and used
// everywhere it appears in copy, so a rate change is a one-line edit.
export const CALL_RATE = 'R0,80';
