import type { Metadata } from 'next';
import Link from 'next/link';
import { MapPinIcon } from '@/components/icons';
import { SUPPORT_EMAIL } from '@/lib/site';
import ContactEmailCard from '@/components/ContactEmailCard';

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
        customers can also raise a ticket from the billing portal. Common questions may already be answered
        on our <Link href="/faq" className="font-medium text-ember-600 hover:text-ember-500">FAQ page</Link>.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <ContactEmailCard email={SUPPORT_EMAIL} />
        <div className="rounded-2xl border border-navy-900/10 bg-white p-6">
          <div className="flex items-center gap-2">
            <MapPinIcon className="h-5 w-5 text-ember-500" />
            <h3 className="font-bold text-navy-900">Based in</h3>
          </div>
          <p className="mt-2 text-sm text-navy-700">South Africa</p>
        </div>
      </div>
    </div>
  );
}
