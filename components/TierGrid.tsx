import { Plan } from '@/lib/products';
import PricingCard from './PricingCard';

interface TierGridProps {
  id?: string;
  eyebrow: string;
  title: string;
  description: string;
  plans: Plan[];
}

export default function TierGrid({ id, eyebrow, title, description, plans }: TierGridProps) {
  return (
    <section id={id} className="scroll-mt-24 py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-ember-600">{eyebrow}</p>
          <h2 className="mt-2 text-3xl font-bold text-navy-900">{title}</h2>
          <p className="mt-3 text-navy-700">{description}</p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            // id lets the homepage plan finder deep-link straight to a tier,
            // e.g. /products#pbx-10
            <div key={plan.id} id={plan.id} className="scroll-mt-24">
              <PricingCard plan={plan} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
