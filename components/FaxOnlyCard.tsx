import { addons } from '@/lib/products';
import { formatZAR } from '@/lib/format';
import { orderCartUrl } from '@/lib/whmcs';
import OrderButton from './OrderButton';

// Virtual Fax is the one extra that is also sold on its own, without a phone
// line. Price and product come from the data file.
export default function FaxOnlyCard() {
  const fax = addons.find((addon) => addon.slug === 'fax');
  if (!fax || typeof fax.priceZAR !== 'number' || !fax.whmcsPid) return null;
  return (
    <div data-testid="fax-only" className="mx-auto flex max-w-xl flex-col items-start justify-between gap-3 rounded-2xl border border-navy-900/10 bg-navy-100/40 p-4 sm:flex-row sm:items-center">
      <p className="text-sm text-navy-800">
        <span className="font-bold text-navy-900">Only need fax?</span> Virtual Fax on its own, {formatZAR(fax.priceZAR)}/month
      </p>
      <OrderButton plan={fax} url={orderCartUrl([{ whmcsPid: fax.whmcsPid }])} size="sm" variant="ghost" className="flex-none">
        Order →
      </OrderButton>
    </div>
  );
}
