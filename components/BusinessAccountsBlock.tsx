import CTAButton from './CTAButton';

// One monthly invoice for a whole team. Used as its own page section (h2) and
// again under the builder when the largest PBX size is picked (h3).
export default function BusinessAccountsBlock({ headingLevel = 'h2', id }: { headingLevel?: 'h2' | 'h3'; id?: string }) {
  const Heading = headingLevel;
  return (
    <div id={id} className="scroll-mt-24 flex flex-col items-start gap-6 rounded-3xl border border-navy-900/10 bg-navy-100/40 p-8 sm:flex-row sm:items-center sm:justify-between">
      <div className="max-w-xl">
        <Heading className="text-3xl font-bold text-navy-900">Business Accounts.</Heading>
        <p className="mt-3 text-navy-700">One monthly invoice for your whole team, with terms tailored to your business.</p>
      </div>
      <CTAButton href="/contact?topic=business-account" className="flex-none">
        Talk to our business team →
      </CTAButton>
    </div>
  );
}
