import type { Metadata } from 'next';
import Link from 'next/link';
import PromoBanner from '@/components/PromoBanner';
import PlanBuilder from '@/components/PlanBuilder';
import PlanComparison from '@/components/PlanComparison';
import BusinessAccountsBlock from '@/components/BusinessAccountsBlock';
import CTAButton from '@/components/CTAButton';
import ExistingCustomerLine from '@/components/ExistingCustomerLine';
import { MapPinIcon, CheckCircleIcon, TagIcon, HandsetIcon } from '@/components/icons';
import { formatZAR } from '@/lib/format';
import { SITE_URL, SITE_NAME, SUPPORT_EMAIL, CALL_RATE } from '@/lib/site';
import { LINES_FROM_ZAR, FAMILY_PRICE_RANGES, PRICING_FAQS } from '@/lib/pricing';

const PAGE_URL = `${SITE_URL}/pricing`;
const TITLE = 'VoIP & Cloud PBX Pricing South Africa | Business & Home Phone Plans | Kiatri';
const DESCRIPTION =
  `Transparent VoIP pricing for South African homes and businesses. Cloud PBX, SIP trunks and phone lines from R${LINES_FROM_ZAR}/month. Build your setup and order online.`;
const OG_ALT = 'Kiatri VoIP and cloud PBX pricing for South Africa';
const OG_IMAGE = { url: '/opengraph-image', width: 1200, height: 630, alt: OG_ALT };

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
    images: [OG_IMAGE],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: [{ url: '/opengraph-image', alt: OG_ALT }] },
};

const TRUST_ROW = [
  { icon: MapPinIcon, label: 'Local South African support' },
  { icon: CheckCircleIcon, label: 'No surprise bills' },
  { icon: TagIcon, label: 'No VAT added' },
  { icon: HandsetIcon, label: 'Keep your number' },
];

const BENEFITS = [
  { title: 'Pay for what you use', text: 'Start small, add seats and minutes as your business grows.' },
  { title: 'No surprise bills', text: 'Prepaid plans put you in control of every rand. Top up anytime.' },
  { title: 'Live in minutes', text: 'Order online and your line is ready fast, with no sales call required.' },
  { title: 'Support that picks up', text: 'A real South African team in your time zone, not an offshore queue.' },
];

const product = (name: string, description: string, anchor: string, range: { low: number; high: number; count: number }) => ({
  '@type': 'Product',
  name,
  description,
  brand: { '@type': 'Brand', name: SITE_NAME },
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'ZAR',
    lowPrice: range.low,
    highPrice: range.high,
    offerCount: range.count,
    availability: 'https://schema.org/InStock',
    url: `${PAGE_URL}#${anchor}`,
  },
});

const STRUCTURED_DATA = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.svg`,
    areaServed: 'South Africa',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: SUPPORT_EMAIL,
      areaServed: 'ZA',
      availableLanguage: 'en-ZA',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Pricing', item: PAGE_URL },
    ],
  },
  { '@context': 'https://schema.org', ...product('Kiatri Home Line', 'A reliable home phone line with a real local number.', 'home-line', FAMILY_PRICE_RANGES.home) },
  { '@context': 'https://schema.org', ...product('Kiatri Business Line', 'Professional business phone lines for growing teams.', 'business-line', FAMILY_PRICE_RANGES.business) },
  { '@context': 'https://schema.org', ...product('Kiatri Cloud PBX', 'A complete cloud phone system for your whole team.', 'cloud-pbx', FAMILY_PRICE_RANGES.pbx) },
  { '@context': 'https://schema.org', ...product('Kiatri SIP Trunk', 'Connect your existing PBX to South African calling capacity.', 'sip-trunk', FAMILY_PRICE_RANGES.trunk) },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: PRICING_FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  },
];

export default function PricingPage() {
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
        eyebrow="Pricing"
        headlineLead="VoIP pricing that"
        headlineAccent="makes sense"
        headlineTail="for South African business"
        description="Cloud PBX, SIP trunks and phone lines, priced piece by piece so you only pay for what your team actually uses. Build your setup, see your monthly total, and order online in minutes."
        priceLabel="Lines from"
        priceValue={formatZAR(LINES_FROM_ZAR)}
        priceSuffix="/month"
        priceSecondary={`Calls from ${CALL_RATE}/min`}
        ctaLabel="Build your setup"
        ctaHref="#builder"
        trustRow={TRUST_ROW}
        illustrationAlt="Kiatri cloud phone system connecting South African homes and businesses"
      />

      <div className="mx-auto max-w-6xl px-6 py-16">
        <section id="builder" className="scroll-mt-24">
          <h2 className="text-3xl font-bold text-navy-900">Build your business phone system</h2>
          <p className="mt-2 text-navy-700">Choose what you need and watch your monthly total update live.</p>
          <div className="mt-6">
            <PlanBuilder />
          </div>
          <p className="mt-4 text-xs text-navy-700">
            All prices in South African rand. No VAT added. Your final price is always confirmed at checkout.
          </p>
          <ExistingCustomerLine className="mt-4 !text-left" />
          <p className="mt-3 text-sm text-navy-700">
            Prefer to browse? See our{' '}
            <Link href="/business" className="font-semibold text-ember-600 hover:text-ember-500">business plans</Link>,{' '}
            <Link href="/voice" className="font-semibold text-ember-600 hover:text-ember-500">home voice lines</Link>,{' '}
            <Link href="/call-center" className="font-semibold text-ember-600 hover:text-ember-500">call centre solutions</Link>.
          </p>
        </section>

        <section className="mt-20">
          <h2 className="text-3xl font-bold text-navy-900">Why South African businesses choose Kiatri</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map((benefit) => (
              <div key={benefit.title} className="rounded-2xl border border-navy-900/10 bg-white p-6 shadow-card">
                <h3 className="font-bold text-navy-900">{benefit.title}</h3>
                <p className="mt-2 text-sm text-navy-700">{benefit.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <BusinessAccountsBlock id="business-accounts" />
        </section>

        <section className="mt-20">
          <h2 className="text-3xl font-bold text-navy-900">Compare VoIP plans and prices</h2>
          <PlanComparison />
        </section>

        <section className="mt-20">
          <div className="rounded-3xl border border-navy-900/10 bg-white p-8 shadow-card">
            <h2 className="text-3xl font-bold text-navy-900">Switch to Kiatri and keep your number</h2>
            <p className="mt-3 max-w-2xl text-navy-700">
              Bring your existing South African number with you, or choose a new local number in Johannesburg,
              Pretoria, Cape Town, Durban and more.
            </p>
            <Link href="/numbers" className="mt-4 inline-block text-sm font-semibold text-ember-600 hover:text-ember-500">
              Numbers &amp; porting →
            </Link>
          </div>
        </section>

        <section id="faq" className="mt-20 scroll-mt-24">
          <h2 className="text-3xl font-bold text-navy-900">VoIP pricing questions</h2>
          <div className="mt-8 divide-y divide-navy-900/10 rounded-2xl border border-navy-900/10 bg-white shadow-card">
            {PRICING_FAQS.map(({ question, answer }) => (
              <details key={question} className="group px-6 py-5">
                <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between font-semibold text-navy-900 marker:content-none">
                  <h3 className="text-base font-semibold">{question}</h3>
                  <span className="ml-4 flex-none text-ember-500 transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-navy-700">{answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <div className="flex flex-col items-center gap-6 rounded-3xl bg-navy-950 px-6 py-16 text-center text-white">
            <h2 className="text-3xl font-bold">Ready to upgrade your business phone system?</h2>
            <p className="max-w-xl text-navy-200">Build your setup in minutes and get a local number today.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <CTAButton href="#builder">Build your setup</CTAButton>
              <CTAButton href="/contact" variant="ghost" className="border-white/25 text-white hover:border-white/60">
                Talk to us
              </CTAButton>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
