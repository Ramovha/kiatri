import Link from 'next/link';

const COLUMNS = [
  {
    title: 'Product',
    links: [
      { href: '/products', label: 'Cloud PBX' },
      { href: '/products#trunks', label: 'SIP Trunks' },
      { href: '/products#call-center', label: 'Call Center' },
      { href: '/pricing', label: 'Pricing' },
    ],
  },
  {
    title: 'Solutions',
    links: [
      { href: '/business', label: 'For Business' },
      { href: '/small-business', label: 'For Small Business' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/about', label: 'About & Trust' },
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
  return (
    <footer className="border-t border-navy-900/10 bg-navy-950 text-navy-100">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 text-lg font-bold text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ember-500 text-white">
                k
              </span>
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
          <p>© {new Date().getFullYear()} Kiatri. All rights reserved.</p>
          <p>Billing &amp; account management via calling.kiatri.com</p>
        </div>
      </div>
    </footer>
  );
}
