'use client';

import { useEffect, useState } from 'react';

// Reads ?topic=business-account (from the home page plan finder and Business
// Accounts button) and prefills the email subject — the contact page has no
// form, so the mailto subject is the enquiry type.
export default function ContactEmailCard({ email }: { email: string }) {
  const [businessAccount, setBusinessAccount] = useState(false);

  useEffect(() => {
    setBusinessAccount(new URLSearchParams(window.location.search).get('topic') === 'business-account');
  }, []);

  const href = businessAccount
    ? `mailto:${email}?subject=${encodeURIComponent('Business Account enquiry')}`
    : `mailto:${email}`;

  return (
    <a
      href={href}
      className="rounded-2xl border border-navy-900/10 bg-white p-6 shadow-card transition hover:border-ember-500/50"
    >
      <h3 className="font-bold text-navy-900">Email us</h3>
      <p className="mt-2 text-sm text-navy-700">{email}</p>
      {businessAccount && (
        <p className="mt-1 text-xs font-semibold text-ember-600">Enquiry type: Business Account</p>
      )}
    </a>
  );
}
