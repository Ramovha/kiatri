import { ReactNode } from 'react';
import { linePlans, pbxTiers, homeProducts, Plan } from '@/lib/products';
import { homePayg, meteredTrunks, includedMinutes, formatMinutes, BEST_FOR } from '@/lib/pricing';
import { CALL_RATE } from '@/lib/site';
import { formatZAR } from '@/lib/format';
import OrderButton from './OrderButton';
import { orderCartUrl } from '@/lib/whmcs';

// Static, crawlable comparison tables — plan names, prices and included
// minutes are real HTML on first load, no JavaScript needed. Every value is
// read from lib/products.ts.

interface Row {
  key: string;
  name: string;
  price: number;
  minutes: string;
  bestFor: string;
  order: ReactNode;
}

const minutesText = (plan: Plan) => {
  const n = includedMinutes(plan);
  return n ? formatMinutes(n) : `Pay as you go, calls from ${CALL_RATE}/min`;
};

function FamilyTable({ id, title, rows }: { id: string; title: string; rows: Row[] }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h3 className="text-xl font-bold text-navy-900">{title}</h3>
      <div className="mt-3 overflow-x-auto rounded-2xl border border-navy-900/10 bg-white shadow-card">
        <table className="w-full min-w-[640px] text-left text-sm">
          <caption className="sr-only">{title} plans and prices</caption>
          <thead className="bg-navy-100/60 text-xs uppercase tracking-wide text-navy-700">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">Plan</th>
              <th scope="col" className="px-4 py-3 font-semibold">Monthly price</th>
              <th scope="col" className="px-4 py-3 font-semibold">Included minutes</th>
              <th scope="col" className="px-4 py-3 font-semibold">Best for</th>
              <th scope="col" className="px-4 py-3 font-semibold">Order</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-900/10">
            {rows.map((row) => (
              <tr key={row.key}>
                <th scope="row" className="px-4 py-3 font-semibold text-navy-900">{row.name}</th>
                <td className="px-4 py-3 text-navy-900">{formatZAR(row.price)}</td>
                <td className="px-4 py-3 text-navy-700">{row.minutes}</td>
                <td className="px-4 py-3 text-navy-700">{row.bestFor}</td>
                <td className="px-4 py-3">{row.order}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

const order = (plan: { whmcsPid?: number; whmcsBid?: number; comingSoon?: boolean }, label: string) => (
  <OrderButton plan={plan} url={orderCartUrl([plan])} size="sm" variant="ghost">{label}</OrderButton>
);

type TableFamily = 'home' | 'business' | 'pbx' | 'trunk';

// `families` picks which tables to show and `idPrefix` keeps their anchor ids
// from clashing with other in-page ids (on /business the tab links already use
// #cloud-pbx, #line and #trunks).
export default function PlanComparison({
  families = ['home', 'business', 'pbx', 'trunk'],
  idPrefix = '',
  titles = {},
}: {
  families?: TableFamily[];
  idPrefix?: string;
  titles?: Partial<Record<TableFamily, string>>;
} = {}) {
  const homeRows: Row[] = [
    {
      key: 'home-payg',
      name: 'Pay-As-You-Go',
      price: homePayg.priceZAR!,
      minutes: minutesText(homePayg),
      bestFor: BEST_FOR['residential-payg'],
      order: order(homePayg, 'Order'),
    },
    ...(['Home 200', 'Home 400'] as const).map((plan) => {
      const products = homeProducts.filter((p) => p.plan === plan);
      return {
        key: plan,
        name: plan,
        price: products[0].priceZAR,
        minutes: formatMinutes(products[0].minutes),
        bestFor: BEST_FOR[plan === 'Home 200' ? 'home-200' : 'home-400'],
        order: (
          <div className="flex flex-wrap gap-2">
            {products.map((product) => (
              <div key={product.id}>{order(product, `Order ${product.style === 'prepaid' ? 'Prepaid' : 'Capped'}`)}</div>
            ))}
          </div>
        ),
      };
    }),
  ];

  const lineRows: Row[] = linePlans.map((plan) => ({
    key: plan.id,
    name: plan.id === 'line-payg' ? 'Pay-As-You-Go' : plan.name,
    price: plan.priceZAR!,
    minutes: minutesText(plan),
    bestFor: BEST_FOR[plan.id],
    order: order(plan, 'Order'),
  }));

  const pbxRows: Row[] = pbxTiers.map((plan) => ({
    key: plan.id,
    name: plan.name,
    price: plan.priceZAR!,
    minutes: minutesText(plan),
    bestFor: BEST_FOR[plan.id],
    order: order(plan, 'Order'),
  }));

  const trunkRows: Row[] = meteredTrunks.map((plan) => ({
    key: plan.id,
    name: plan.name,
    price: plan.priceZAR!,
    minutes: minutesText(plan),
    bestFor: BEST_FOR[plan.id],
    order: order(plan, 'Order'),
  }));

  const tables: Record<TableFamily, { id: string; title: string; rows: Row[] }> = {
    home: { id: 'home-line', title: 'Home Line', rows: homeRows },
    business: { id: 'business-line', title: 'Business Line', rows: lineRows },
    pbx: { id: 'cloud-pbx', title: 'Cloud PBX', rows: pbxRows },
    trunk: { id: 'sip-trunk', title: 'SIP Trunk', rows: trunkRows },
  };

  return (
    <div className="mt-8 space-y-10">
      {families.map((family) => (
        <FamilyTable key={family} id={idPrefix + tables[family].id} title={titles[family] ?? tables[family].title} rows={tables[family].rows} />
      ))}
    </div>
  );
}
