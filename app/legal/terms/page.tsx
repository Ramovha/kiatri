import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Terms of Service' };

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold text-navy-900">Terms of Service</h1>
      <div className="prose-legal mt-6 space-y-4 text-sm leading-relaxed text-navy-700">
        <p>
          These Terms of Service ("Terms") govern your access to and use of the hosted VoIP and call center
          services (the "Services") provided by Kiatri (Pty) Ltd, a company registered in the Republic of
          South Africa ("Kiatri", "we", "us"), ordered and billed through calling.kiatri.com. By ordering or using the
          Services, you agree to these Terms.
        </p>
        <h2 className="text-lg font-bold text-navy-900">1. Accounts and billing</h2>
        <p>
          All orders, invoicing, and payment are handled through our billing system. You are responsible for
          keeping your account and payment details current. Suspension for non-payment follows the process
          described in your order confirmation.
        </p>
        <h2 className="text-lg font-bold text-navy-900">2. Acceptable use</h2>
        <p>
          You agree not to use the Services for unlawful robocalling, spoofing, fraud, or any activity that
          violates South African telecommunications regulation. See our SLA &amp; Acceptable Use policy for
          detail.
        </p>
        <h2 className="text-lg font-bold text-navy-900">3. Service changes</h2>
        <p>
          We may modify plan features, pricing, or included minutes with notice as described in your order
          terms. Material changes to active contracts will be communicated in advance.
        </p>
        <h2 className="text-lg font-bold text-navy-900">4. Governing law</h2>
        <p>These Terms are governed by the laws of the Republic of South Africa.</p>
      </div>
    </div>
  );
}
