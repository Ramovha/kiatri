import type { Metadata } from 'next';
import Link from 'next/link';
import GetStartedFlow from '@/components/GetStartedFlow';
import { LogoMark } from '@/components/icons/Logo';

// A focused, minimal-chrome landing page for paid ad traffic — the full
// site nav/footer are hidden for this route (see Header.tsx/Footer.tsx's
// pathname check) so this page doesn't compete with itself for attention.
// This page owns its own tiny top bar (logo + a way back to the main site)
// instead.

export const metadata: Metadata = {
  title: 'Get Started',
  description: 'Answer a few quick questions and get a plan match in under a minute.',
};

export default function GetStartedPage() {
  return (
    <div className="flex min-h-screen flex-col bg-navy-100/40">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2.5 font-display text-lg font-bold tracking-tight text-navy-900">
          <LogoMark className="h-7 w-7" />
          kiatri
        </Link>
        <Link href="/" className="text-sm font-medium text-navy-700 hover:text-navy-900">
          Back to site
        </Link>
      </div>

      <div className="flex flex-1 items-start justify-center px-6 pb-16 pt-4 sm:pt-10">
        <GetStartedFlow />
      </div>
    </div>
  );
}
