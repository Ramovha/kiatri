import Link from 'next/link';

const NAV = [
  { href: '/products', label: 'Products' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/business', label: 'Business' },
  { href: '/small-business', label: 'Small Business' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-navy-900/10 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight text-navy-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-900 text-white">
            k
          </span>
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
            href="/pricing"
            className="rounded-full bg-ember-500 px-5 py-2 text-sm font-semibold text-white shadow-card transition hover:bg-ember-600"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
