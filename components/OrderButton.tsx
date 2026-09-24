import { ReactNode } from 'react';
import CTAButton from './CTAButton';
import { BillingCycle, planOrderUrl } from '@/lib/whmcs';

type Variant = 'primary' | 'secondary' | 'ghost';

interface OrderButtonProps {
  plan: { whmcsPid?: number; whmcsBid?: number; comingSoon?: boolean };
  cycle?: BillingCycle;
  // Overrides the link (e.g. a multi-item cart link). null = not orderable.
  url?: string | null;
  variant?: Variant;
  className?: string;
  size?: 'md' | 'sm';
  // The addon lock: a plan that doesn't work with the selected addons. Shown
  // as a disabled button (not a link), so it can't be clicked or activated by
  // keyboard.
  locked?: boolean;
  children?: ReactNode;
}

// An order button that can never render a broken or empty link: with no
// configured product it shows a disabled "Coming soon" button instead.
export default function OrderButton({ plan, cycle = 'monthly', url, variant = 'primary', className = '', size = 'md', locked = false, children }: OrderButtonProps) {
  const sizing = size === 'sm' ? 'px-4 py-2 text-xs' : 'px-6 py-3 text-sm';
  if (locked) {
    return (
      <button
        type="button"
        disabled
        aria-disabled="true"
        className={`inline-flex cursor-not-allowed items-center justify-center rounded-full border border-navy-900/15 bg-navy-100 ${sizing} font-semibold text-navy-400 ${className}`}
      >
        {children ?? 'Order Now'}
      </button>
    );
  }
  const href = url !== undefined ? url : planOrderUrl(plan, cycle);
  if (!href) {
    return (
      <button
        type="button"
        disabled
        className={`inline-flex cursor-not-allowed items-center justify-center rounded-full border border-navy-900/15 bg-navy-100 ${size === 'sm' ? 'px-4 py-2 text-xs' : 'px-6 py-3 text-sm'} font-semibold text-navy-400 ${className}`}
      >
        Coming soon
      </button>
    );
  }
  return (
    <CTAButton href={href} external variant={variant} size={size} className={className}>
      {children ?? 'Order Now'}
    </CTAButton>
  );
}
