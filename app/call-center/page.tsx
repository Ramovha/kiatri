import type { Metadata } from 'next';
import PromoBanner from '@/components/PromoBanner';
import CallCenterPlans from '@/components/CallCenterPlans';
import CTAButton from '@/components/CTAButton';
import { callCenterFeatures, callCenterRoadmap, callCenterTiers } from '@/lib/products';
import { formatZAR } from '@/lib/format';
import { SITE_URL, SITE_NAME, SUPPORT_EMAIL } from '@/lib/site';

const essentials = callCenterTiers.find((tier) => tier.id === 'call-center-essentials')!;

const PAGE_URL = `${SITE_URL}/call-center`;
const TITLE = 'Call Centre Software South Africa | Cloud Call Center | Kiatri';
// "R2 530" — South African thousands grouping.
const fromPrice = `R${essentials.priceZAR.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}`;
const DESCRIPTION = `Cloud call centre software for South African businesses. Call queues, IVR and call recording with a 10 or 25-seat phone system. Plans from ${fromPrice}/month.`;
const OG_ALT = 'Kiatri cloud call centre software for South African teams';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL, languages: { 'en-ZA': PAGE_URL } },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
    siteName: SITE_NAME,
    locale: 'en_ZA',
    type: 'website',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: OG_ALT }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: [{ url: '/opengraph-image', alt: OG_ALT }] },
};

const STRUCTURED_DATA = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.svg`,
    areaServed: 'South Africa',
    contactPoint: { '@type': 'ContactPoint', contactType: 'customer service', email: SUPPORT_EMAIL, areaServed: 'ZA', availableLanguage: 'en-ZA' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Call Center', item: PAGE_URL },
    ],
  },
  ...callCenterTiers.map((tier) => ({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `Kiatri ${tier.name}`,
    description: tier.tagline,
    brand: { '@type': 'Brand', name: SITE_NAME },
    offers: {
      '@type': 'Offer',
      price: tier.priceZAR,
      priceCurrency: 'ZAR',
      availability: 'https://schema.org/InStock',
      url: `${PAGE_URL}#plans`,
      priceSpecification: { '@type': 'UnitPriceSpecification', price: tier.priceZAR, priceCurrency: 'ZAR', unitCode: 'MON' },
    },
  })),
];

export default function CallCenterPage() {
  return (
    <>
      {STRUCTURED_DATA.map((data, i) => (
        <script
          key={i}
          type="application/ld+json"
          // "<" is escaped so no string in the data can close the script tag.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
        />
      ))}

      <PromoBanner
        eyebrow="Call Center"
        headlineLead="Call centre software for"
        headlineAccent="South African teams"
        description="Queues, IVR and call recording on a cloud phone system, ready to take calls from day one. Priced as one simple monthly plan."
        priceLabel="Plans from"
        priceValue={formatZAR(essentials.priceZAR)}
        priceSuffix="/month"
        ctaLabel="See plans"
        ctaHref="#plans"
        illustrationAlt="Kiatri cloud call centre software for South African teams"
      />

      <div className="mx-auto max-w-6xl px-6 py-16">
        <section className="relative overflow-hidden rounded-3xl bg-navy-950 px-6 py-16 text-white sm:px-10">
          {/* Distinct accent + background texture for this section — the
              "advanced layer" of the site, so it shouldn't look identical to
              every other dark section (see tailwind.config.ts `signal` color). */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-signal-500/20 blur-3xl" aria-hidden />
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,193,163,0.12),_transparent_55%)]"
            aria-hidden
          />
          <div className="relative">
            <div id="plans" className="scroll-mt-24">
              <p className="text-sm font-semibold uppercase tracking-wide text-signal-400">Plans</p>
              <h2 className="mt-2 text-2xl font-bold">Choose your call centre plan</h2>
              <p className="mt-3 max-w-2xl text-navy-200">
                A call queue system, IVR menus and call recording built into a cloud phone system, for South African
                businesses that run a contact centre.
              </p>
              <div className="mt-8">
                <CallCenterPlans />
              </div>
            </div>

            <div className="mt-16 border-t border-white/10 pt-14">
              <h2 className="text-3xl font-bold">Queues, IVR and recording, ready today</h2>
              <div className="mt-10 grid gap-4 md:grid-cols-3">
                {callCenterFeatures.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div key={feature.name} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-5">
                      <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-signal-500/15 text-signal-300">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="font-semibold">{feature.name}</h3>
                        <p className="mt-1 text-sm text-navy-200">{feature.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-10">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-signal-400">On our roadmap</h3>
                <ul className="mt-3 grid gap-x-8 gap-y-2 text-sm text-navy-200 sm:grid-cols-2 lg:grid-cols-3">
                  {callCenterRoadmap.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-signal-400" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-sm text-navy-200">Want something on the roadmap sooner? Talk to us.</p>
              </div>
            </div>

            <div className="mt-10">
              <CTAButton href="/contact">Talk to us about your call centre →</CTAButton>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
