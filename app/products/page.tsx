import type { Metadata } from 'next';
import Link from 'next/link';

// This route moved to /pricing (single canonical plan/pricing page — see
// kiatri-consolidate-pages-prompt.md). The netlify.toml [[redirects]] entry
// handles this with a real 301 on the deployed site; this page is a static
// fallback so the link still works even off Netlify (e.g. local preview,
// GitHub Pages) where that redirect rule doesn't apply.
export const metadata: Metadata = {
  title: 'Redirecting…',
  robots: { index: false, follow: false },
};

export default function ProductsRedirectPage() {
  return (
    <>
      <meta httpEquiv="refresh" content="0; url=/pricing" />
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="text-2xl font-bold text-navy-900">This page has moved</h1>
        <p className="mt-3 text-navy-700">
          Products and pricing now live together on our{' '}
          <Link href="/pricing" className="font-semibold text-ember-600 hover:text-ember-500">
            Pricing
          </Link>{' '}
          page.
        </p>
      </div>
    </>
  );
}
