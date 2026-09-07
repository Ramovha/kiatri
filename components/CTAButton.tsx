import Link from 'next/link';
import { ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: 'bg-ember-500 text-white hover:bg-ember-600 shadow-card',
  secondary: 'bg-navy-900 text-white hover:bg-navy-800',
  ghost: 'border border-navy-900/15 text-navy-900 hover:border-navy-900/40',
};

interface CTAButtonProps {
  href: string;
  children: ReactNode;
  variant?: Variant;
  external?: boolean;
  className?: string;
}

export default function CTAButton({
  href,
  children,
  variant = 'primary',
  external = false,
  className = '',
}: CTAButtonProps) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition ${VARIANT_CLASSES[variant]} ${className}`;

  if (external) {
    // WHMCS checkout links stay in the same tab — it's a continuation of the
    // purchase flow, not a reference link that should preserve this page.
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
