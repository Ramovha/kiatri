import type { Metadata } from 'next';
import LegalBanner from '@/components/LegalBanner';

export const metadata: Metadata = { title: 'SLA & Acceptable Use' };

export default function SlaPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <LegalBanner />
      <h1 className="text-3xl font-bold text-navy-900">Service Level Agreement &amp; Acceptable Use</h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-navy-700">
        <h2 className="text-lg font-bold text-navy-900">1. Service level commitment</h2>
        <p>
          [REPLACE WITH REAL DATA] — publish an actual, measured uptime commitment (e.g. a specific
          percentage over a defined period) once available, along with the remedy/credit process for missed
          targets.
        </p>
        <h2 className="text-lg font-bold text-navy-900">2. Support response targets</h2>
        <p>[REPLACE WITH REAL DATA] — response time targets by severity level.</p>
        <h2 className="text-lg font-bold text-navy-900">3. Acceptable use</h2>
        <p>The Services may not be used for:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Unlawful robocalling, caller ID spoofing, or unsolicited bulk calling/SMS</li>
          <li>Fraudulent or deceptive call traffic, including toll fraud</li>
          <li>Any activity that violates ICASA regulation or South African law</li>
          <li>Reselling capacity outside agreed reseller terms</li>
        </ul>
        <h2 className="text-lg font-bold text-navy-900">4. Enforcement</h2>
        <p>
          [LEGAL REVIEW NEEDED] — suspension/termination process for Acceptable Use violations must be
          reviewed by qualified legal counsel before publication.
        </p>
      </div>
    </div>
  );
}
