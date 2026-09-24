import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Privacy Policy' };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold text-navy-900">Privacy Policy</h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-navy-700">
        <p>
          This Privacy Policy explains what personal information Kiatri (Pty) Ltd ("Kiatri", "we", "us")
          collects, why, and how it is protected, in line with South Africa's Protection of Personal
          Information Act (POPIA). Kiatri (Pty) Ltd is the responsible party for personal information
          processed through the Services, invoiced and contracted under its own name.
        </p>
        <h2 className="text-lg font-bold text-navy-900">1. Information we collect</h2>
        <p>
          Account and billing details are collected and processed through our billing portal
          (calling.kiatri.com). This marketing site itself does not run a database or backend — it does not
          collect form submissions or set tracking cookies.
        </p>
        <h2 className="text-lg font-bold text-navy-900">2. Call data</h2>
        <p>
          Call detail records (numbers, duration, timestamps) are processed to provide billing and the
          Services. Call recording, where enabled, is subject to the consent requirements described in our
          SLA &amp; Acceptable Use policy.
        </p>
        <h2 className="text-lg font-bold text-navy-900">3. Contact</h2>
        <p>Questions about this policy can be sent to our support address on the Contact page.</p>
      </div>
    </div>
  );
}
