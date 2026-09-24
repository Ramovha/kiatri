import type { Metadata } from 'next';
import Link from 'next/link';

// This route moved to /business — the Line Plans tab there covers small
// business/solo operators (see kiatri-consolidate-pages-prompt.md). The
// netlify.toml [[redirects]] entry handles this with a real 301 on the
// deployed site; this page is a static fallback for any host without that
// redirect rule.
export const metadata: Metadata = {
  title: 'Redirecting…',
  robots: { index: false, follow: false },
};

export default function SmallBusinessRedirectPage() {
  return (
    <>
      <meta httpEquiv="refresh" content="0; url=/business#line" />
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="text-2xl font-bold text-navy-900">This page has moved</h1>
        <p className="mt-3 text-navy-700">
          Small business plans now live on our{' '}
          <Link href="/business#line" className="font-semibold text-ember-600 hover:text-ember-500">
            Business
          </Link>{' '}
          page, under Line Plans.
        </p>
      </div>
    </>
  );
}
