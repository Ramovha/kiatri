'use client';

import PillTabs from './PillTabs';
import { BillingPeriod, YEARLY_DISCOUNT_RATE } from '@/lib/format';

// One shared label so the discount percentage can't drift between /business
// and /call-center — both render this exact toggle. Monthly pricing is
// never touched; Yearly shows a monthly-equivalent price billed annually.
const YEARLY_LABEL = `Yearly — save ${Math.round(YEARLY_DISCOUNT_RATE * 100)}%`;

export default function BillingPeriodToggle({
  billingPeriod,
  onChange,
}: {
  billingPeriod: BillingPeriod;
  onChange: (period: BillingPeriod) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <PillTabs
        options={[
          { id: 'monthly', label: 'Monthly' },
          { id: 'yearly', label: YEARLY_LABEL },
        ]}
        activeId={billingPeriod}
        onChange={(id) => onChange(id as BillingPeriod)}
      />
    </div>
  );
}
