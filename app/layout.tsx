import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SITE_URL, SITE_NAME } from '@/lib/site';

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
    <html lang="en-ZA">
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
