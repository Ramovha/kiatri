import { Plan } from '@/lib/products';
import { orderProductUrl } from '@/lib/whmcs';
import { formatZAR } from '@/lib/format';
import CTAButton from './CTAButton';

// Renders one plan as a line item in the itemized pricing table — the
// "device vs airtime" style breakdown called out in the brief, as opposed to
// a single opaque "from $X" headline.
export default function ItemizedPriceRow({ plan }: { plan: Plan }) {
  return (
    <div className="flex flex-col gap-4 border-b border-navy-900/10 py-5 last:border-0 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-navy-900">{plan.name}</span>
          {plan.popular && (
            <span className="rounded-full bg-ember-500/10 px-2 py-0.5 text-xs font-semibold text-ember-600">
              Popular
            </span>
          )}
        </div>
        <p className="mt-0.5 text-sm text-navy-700">
          {plan.capacity} · {plan.minutesIncluded} · {plan.didIncluded}
        </p>
      </div>
      <div className="flex items-center gap-5">
        <div className="text-right">
          <div className="text-lg font-bold text-navy-900">{formatZAR(plan.priceZAR)}<span className="text-sm font-normal text-navy-700">/mo</span></div>
        </div>
        <CTAButton href={orderProductUrl(plan.whmcsPid)} external variant="ghost">
          Order
        </CTAButton>
      </div>
    </div>
  );
}
