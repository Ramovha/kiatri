import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: {
    default: 'Kiatri — Hosted VoIP & Call Center for South African Businesses',
    template: '%s | Kiatri',
  },
  description:
    'Cloud PBX, SIP trunks, and call center tools with local South African support and transparent, itemized pricing. Provisioned automatically after order.',
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
