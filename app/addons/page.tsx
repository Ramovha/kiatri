import type { Metadata } from 'next';
import PromoBanner from '@/components/PromoBanner';
import CTAButton from '@/components/CTAButton';
import AddonsExplorer from '@/components/AddonsExplorer';
import { TagIcon, BoltIcon } from '@/components/icons';
import { SITE_URL } from '@/lib/site';

const PAGE_URL = `${SITE_URL}/addons`;
const TITLE = 'VoIP Addons South Africa | Call Blocking, IVR & Virtual Fax | Kiatri';
const DESCRIPTION =
  'Block spam calls, add a virtual receptionist, or send and receive faxes online. Add them to your Kiatri home or business line in minutes.';
const OG_ALT = 'Kiatri phone line addons: call blocking, virtual receptionist and virtual fax';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL, languages: { 'en-ZA': PAGE_URL } },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
    siteName: 'Kiatri',
    locale: 'en_ZA',
    type: 'website',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: OG_ALT }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: [{ url: '/opengraph-image', alt: OG_ALT }] },
};

export default function AddonsPage() {
  return (
    <>
      <PromoBanner
        eyebrow="Addons"
        headlineLead="Small additions,"
        headlineAccent="real problems solved."
        description="Call blocking, a virtual receptionist, virtual fax, and more on the way. Each one solves a real problem, and attaches to the plan you already have."
        ctaLabel="See addons"
        ctaHref="#addons"
        pills={[
          { icon: TagIcon, label: 'No plan switch required' },
          { icon: BoltIcon, label: 'Attach in seconds at checkout' },
        ]}
      />

      <div className="mx-auto max-w-6xl px-6 py-16">
        <AddonsExplorer />

        <div className="mt-14 rounded-2xl bg-navy-950 p-8 text-center text-white">
          <h2 className="text-xl font-bold">Not sure which addon fits?</h2>
          <p className="mt-2 text-navy-200">Tell us what you&apos;re trying to solve and we&apos;ll point you at the right one.</p>
          <CTAButton href="/contact" className="mt-5">Talk to us</CTAButton>
        </div>
      </div>
    </>
  );
}
