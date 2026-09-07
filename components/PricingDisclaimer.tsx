export default function PricingDisclaimer({ className = '' }: { className?: string }) {
  return (
    <p
      className={`rounded-lg border border-ember-500/30 bg-ember-500/5 px-4 py-3 text-xs leading-relaxed text-navy-800 ${className}`}
    >
      <strong className="font-semibold text-ember-600">Illustrative pricing.</strong> Figures shown reflect our
      plan structure (minutes, seats, channels) but final South African rand pricing is still being costed
      against wholesale connectivity rates. Confirm current pricing at checkout on{' '}
      <span className="font-medium">calling.kiatri.com</span> before you order.
    </p>
  );
}
