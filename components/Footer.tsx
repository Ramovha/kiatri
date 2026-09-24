'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogoMarkInverse } from './icons/Logo';

const COLUMNS = [
  {
    title: 'Product',
    links: [
      { href: '/pricing', label: 'Plans & Pricing' },
      { href: '/business#trunks', label: 'SIP Trunks' },
      { href: '/call-center', label: 'Call Center' },
      { href: '/voice', label: 'Home Voice' },
      { href: '/addons', label: 'Addons' },
      { href: '/numbers', label: 'Numbers & Porting' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/business', label: 'For Business' },
      { href: '/about', label: 'About & Trust' },
      { href: '/security', label: 'Security & Compliance' },
      { href: '/faq', label: 'FAQ' },
      { href: '/contact', label: 'Contact & Support' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: '/legal/terms', label: 'Terms of Service' },
      { href: '/legal/privacy', label: 'Privacy Policy' },
      { href: '/legal/sla', label: 'SLA & Acceptable Use' },
    ],
  },
];

export default function Footer() {
  // Same reasoning as Header — /get-started is a focused conversion page,
  // not a browsing page, so the full footer doesn't belong in the flow.
  const pathname = usePathname();
  if (pathname?.startsWith('/get-started')) return null;

  return (
    <footer className="border-t border-navy-900/10 bg-navy-950 text-navy-100">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 font-display text-lg font-bold text-white">
              <LogoMarkInverse className="h-7 w-7" />
              kiatri
            </div>
            <p className="mt-3 text-sm text-navy-300">
              Hosted VoIP &amp; call center services, built and supported in South Africa.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <div className="text-sm font-semibold text-white">{col.title}</div>
              <ul className="mt-3 space-y-2 text-sm text-navy-300">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="transition hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-navy-400 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Kiatri (Pty) Ltd. All rights reserved.</p>
          <p>Billing &amp; account management via calling.kiatri.com</p>
        </div>
      </div>
    </footer>
  );
}
