'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogoMark } from './icons/Logo';

const NAV = [
  { href: '/pricing', label: 'Pricing' },
  { href: '/voice', label: 'Home Voice' },
  { href: '/addons', label: 'Addons' },
  { href: '/business', label: 'Business' },
  { href: '/call-center', label: 'Call Center' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  // /get-started is a focused, minimal-chrome landing page for paid ad
  // traffic — it renders its own tiny logo + "back to site" bar instead
  // (see app/get-started/page.tsx), so the full nav doesn't compete with it.
  const pathname = usePathname();
  if (pathname?.startsWith('/get-started')) return null;

  return (
    <header className="sticky top-0 z-40 border-b border-navy-900/10 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5 font-display text-lg font-bold tracking-tight text-navy-900">
          <LogoMark className="h-7 w-7" />
          kiatri
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-navy-800 md:flex">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-ember-600">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          {/* TODO: confirm the real WHMCS client-area login path before launch — see SETUP.md */}
          <a
            href="https://calling.kiatri.com/clientarea.php"
            className="hidden text-sm font-medium text-navy-800 transition hover:text-ember-600 sm:inline"
          >
            Client Login
          </a>
          <Link
            href="/get-started"
            className="rounded-full bg-ember-500 px-5 py-2 text-sm font-semibold text-white shadow-card transition hover:bg-ember-600"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
