import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SITE_URL, SITE_NAME } from '@/lib/site';

// Self-hosted via next/font (downloaded at build time, served from our own
// origin — no runtime Google Fonts request, no CLS). Space Grotesk gives
// headings real character instead of the generic weight-only distinction
// the site had before; Inter stays for body copy but is now actually
// loaded rather than relying on the visitor happening to have it installed.
const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['500', '600', '700'],
  display: 'swap',
});

const title = 'Kiatri — Hosted VoIP & Call Center for South African Businesses';
const description =
  'Cloud PBX, SIP trunks, and call center tools with local South African support and transparent, itemized pricing. Provisioned automatically after order.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: title,
    template: '%s | Kiatri',
  },
  description,
  openGraph: {
    title,
    description,
    siteName: SITE_NAME,
    url: SITE_URL,
    locale: 'en_ZA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-ZA" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
