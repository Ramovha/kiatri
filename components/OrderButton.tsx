import { ReactNode } from 'react';
import CTAButton from './CTAButton';
import { BillingCycle, planOrderUrl } from '@/lib/whmcs';

type Variant = 'primary' | 'secondary' | 'ghost';

interface OrderButtonProps {
  plan: { whmcsPid?: number; whmcsBid?: number; comingSoon?: boolean };
  cycle?: BillingCycle;
  variant?: Variant;
  className?: string;
  children?: ReactNode;
}

// An order button that can never render a broken or empty link: with no
// configured product it shows a disabled "Coming soon" button instead.
export default function OrderButton({ plan, cycle = 'monthly', variant = 'primary', className = '', children }: OrderButtonProps) {
  const href = planOrderUrl(plan, cycle);
  if (!href) {
    return (
      <button
        type="button"
        disabled
        className={`inline-flex cursor-not-allowed items-center justify-center rounded-full border border-navy-900/15 bg-navy-100 px-6 py-3 text-sm font-semibold text-navy-400 ${className}`}
      >
        Coming soon
      </button>
    );
  }
  return (
    <CTAButton href={href} external variant={variant} className={className}>
      {children ?? 'Order Now'}
    </CTAButton>
  );
}
