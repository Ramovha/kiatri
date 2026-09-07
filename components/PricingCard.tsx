import { Plan } from '@/lib/products';
import { orderProductUrl } from '@/lib/whmcs';
import { formatZAR } from '@/lib/format';
import { CheckIcon } from './icons';
import CTAButton from './CTAButton';

export default function PricingCard({ plan }: { plan: Plan }) {
  return (
    <div
      className={`flex flex-col rounded-2xl border bg-white p-6 shadow-card ${
        plan.popular ? 'border-ember-500 ring-1 ring-ember-500' : 'border-navy-900/10'
      }`}
    >
      {plan.popular && (
        <span className="mb-3 inline-block w-fit rounded-full bg-ember-500 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
          Most popular
        </span>
      )}
      <h3 className="text-lg font-bold text-navy-900">{plan.name}</h3>
      <p className="mt-1 text-sm text-navy-700">{plan.tagline}</p>

      <div className="mt-4 flex items-baseline gap-1">
        <span className="text-3xl font-extrabold text-navy-900">{formatZAR(plan.priceZAR)}</span>
        <span className="text-sm text-navy-700">/month</span>
      </div>
      <p className="mt-1 text-xs text-navy-400">Illustrative — see pricing page for details</p>

      <dl className="mt-5 grid grid-cols-2 gap-3 border-y border-navy-900/10 py-4 text-sm">
        <div>
          <dt className="text-navy-400">Minutes</dt>
          <dd className="font-medium text-navy-900">{plan.minutesIncluded}</dd>
        </div>
        <div>
          <dt className="text-navy-400">Capacity</dt>
          <dd className="font-medium text-navy-900">{plan.capacity}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-navy-400">Number</dt>
          <dd className="font-medium text-navy-900">{plan.didIncluded}</dd>
        </div>
      </dl>

      <ul className="mt-5 flex-1 space-y-2.5 text-sm text-navy-800">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <CheckIcon className="mt-0.5 h-4 w-4 flex-none text-ember-500" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <CTAButton
        href={orderProductUrl(plan.whmcsPid)}
        external
        variant={plan.popular ? 'primary' : 'ghost'}
        className="mt-6 w-full"
      >
        Order Now
      </CTAButton>
    </div>
  );
}
