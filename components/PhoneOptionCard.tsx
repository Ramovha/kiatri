import { PhoneHardwareOption } from '@/lib/products';
import { formatZAR } from '@/lib/format';
import { CheckIcon, ClockIcon } from './icons';

// Rent and Buy now carry real illustrative prices (see lib/products.ts) but
// stay "Coming Soon" and un-orderable regardless — pricing and fulfillment
// logistics (sourcing, stock, shipping) are separate blockers, and only
// pricing is solved so far.
export default function PhoneOptionCard({
  option,
  onSeeResidential,
}: {
  option: PhoneHardwareOption;
  onSeeResidential?: () => void;
}) {
  const isComingSoon = option.status === 'coming-soon';

  return (
    <div
      className={`flex h-full flex-col rounded-2xl border bg-white p-6 shadow-card ${
        isComingSoon ? 'border-navy-900/10 opacity-60' : 'border-navy-900/10'
      }`}
    >
      {isComingSoon && (
        <span className="mb-3 inline-flex w-fit items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-navy-400">
          <ClockIcon className="h-3.5 w-3.5" />
          Coming soon
        </span>
      )}
      <h3 className="text-lg font-bold text-navy-900">{option.name}</h3>
      <p className="mt-1 text-sm text-navy-700">{option.tagline}</p>
      <p className="mt-2 text-sm text-navy-700">{option.description}</p>

      {typeof option.priceZAR === 'number' ? (
        <>
          <div className="mt-4 flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-navy-900">{formatZAR(option.priceZAR)}</span>
            <span className="text-sm text-navy-700">{option.priceSuffix}</span>
          </div>
          <p className="mt-1 text-xs text-navy-400">Illustrative — see pricing page for details</p>
          <p className="mt-2 text-sm font-semibold text-navy-900">{option.priceNote}</p>
        </>
      ) : (
        <p className="mt-4 text-sm font-semibold text-navy-900">{option.priceNote}</p>
      )}

      <ul className="mt-5 flex-1 space-y-2.5 text-sm text-navy-800">
        {option.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <CheckIcon className="mt-0.5 h-4 w-4 flex-none text-ember-500" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {!isComingSoon && onSeeResidential ? (
        <button
          type="button"
          onClick={onSeeResidential}
          className="mt-6 w-full rounded-full border border-navy-900/15 px-6 py-3 text-sm font-semibold text-navy-900 transition hover:border-navy-900/40"
        >
          See Residential plans
        </button>
      ) : (
        <span className="mt-6 flex w-full items-center justify-center rounded-full border border-navy-900/15 px-6 py-3 text-sm font-semibold text-navy-400">
          Notify me
        </span>
      )}
    </div>
  );
}
