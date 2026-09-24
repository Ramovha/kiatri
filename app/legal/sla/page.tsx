import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'SLA & Acceptable Use' };

export default function SlaPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold text-navy-900">Service Level Agreement &amp; Acceptable Use</h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-navy-700">
        <h2 className="text-lg font-bold text-navy-900">1. Acceptable use</h2>
        <p>The Services may not be used for:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Unlawful robocalling, caller ID spoofing, or unsolicited bulk calling/SMS</li>
          <li>Fraudulent or deceptive call traffic, including toll fraud</li>
          <li>Any activity that violates ICASA regulation or South African law</li>
          <li>Reselling capacity outside agreed reseller terms</li>
        </ul>
      </div>
    </div>
  );
}
