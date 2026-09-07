import type { Metadata } from 'next';
import { ClockIcon, MapPinIcon } from '@/components/icons';

export const metadata: Metadata = {
  title: 'Contact & Support',
  description: 'Get in touch with Kiatri for sales, support, or account questions.',
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-sm font-semibold uppercase tracking-wide text-ember-600">Contact &amp; Support</p>
      <h1 className="mt-2 text-3xl font-bold text-navy-900 md:text-4xl">Talk to a real person</h1>
      <p className="mt-4 text-navy-700">
        For sales questions, custom quotes, or support on an existing account, reach us directly. Existing
        customers can also raise a ticket from the billing portal.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <a
          href="mailto:hello@kiatri.co.za"
          className="rounded-2xl border border-navy-900/10 bg-white p-6 shadow-card transition hover:border-ember-500/50"
        >
          <h3 className="font-bold text-navy-900">Email us</h3>
          <p className="mt-2 text-sm text-navy-700">hello@kiatri.co.za</p>
          <p className="mt-1 text-xs text-navy-400">[REPLACE WITH REAL DATA — confirm actual support address]</p>
        </a>
        <a
          href="tel:+27000000000"
          className="rounded-2xl border border-navy-900/10 bg-white p-6 shadow-card transition hover:border-ember-500/50"
        >
          <h3 className="font-bold text-navy-900">Call us</h3>
          <p className="mt-2 text-sm text-navy-700">[REPLACE WITH REAL DATA — real support number]</p>
        </a>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-navy-900/10 bg-white p-6">
          <div className="flex items-center gap-2">
            <ClockIcon className="h-5 w-5 text-ember-500" />
            <h3 className="font-bold text-navy-900">Support hours</h3>
          </div>
          <p className="mt-2 text-sm text-navy-700">[REPLACE WITH REAL DATA]</p>
        </div>
        <div className="rounded-2xl border border-navy-900/10 bg-white p-6">
          <div className="flex items-center gap-2">
            <MapPinIcon className="h-5 w-5 text-ember-500" />
            <h3 className="font-bold text-navy-900">Based in</h3>
          </div>
          <p className="mt-2 text-sm text-navy-700">South Africa</p>
        </div>
      </div>

      <p className="mt-10 rounded-lg border border-dashed border-navy-900/20 p-4 text-xs text-navy-700">
        TODO: this page currently only offers mailto:/tel: links since this is a static marketing site with no
        backend. Wire up a real contact-form service (e.g. Formspree, a serverless function, or a WHMCS support
        ticket API) before launch if a form is required.
      </p>
    </div>
  );
}
