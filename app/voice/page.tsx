import type { Metadata } from 'next';
import Link from 'next/link';
import PromoBanner from '@/components/PromoBanner';
import VoiceTabsSection from '@/components/VoiceTabsSection';
import CTAButton from '@/components/CTAButton';
import { MapPinIcon, HeadsetIcon, TagIcon } from '@/components/icons';
import { residentialPlans } from '@/lib/products';
import { getAppImages } from '@/lib/appImages';
import { formatZAR } from '@/lib/format';
import { SITE_URL, SITE_NAME, SUPPORT_EMAIL, CALL_RATE } from '@/lib/site';

// Two top-level tabs live in VoiceTabsSection: Residential (the app-based
// plans — calling, video and messaging from the Kiatri app, no hardware
// required) and Connect a Phone (for people who want a cordless handset
// instead — one option available today, two Coming Soon). Deliberately no
// business jargon (seats/channels/PBX/trunk) anywhere on this page.

const PAGE_URL = `${SITE_URL}/voice`;
const TITLE = 'Home Phone Line South Africa | VoIP Home Calling App | Kiatri';

// Home Unlimited has no billing product yet, so it is not offered or priced.
const homePlans = residentialPlans.filter((plan) => plan.id !== 'residential-unlimited');
const homePrices = homePlans.map((plan) => plan.priceZAR ?? 0);
const cheapest = Math.min(...homePrices);

const DESCRIPTION = `Get a home phone line with a real local number. Call from our app or your cordless phone, keep your number, and top up anytime. Plans from R${cheapest}/month.`;
const OG_ALT = 'Kiatri home phone line and calling app for South Africa';

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

const PILLARS = [
  {
    icon: TagIcon,
    title: 'No lock-in',
    description: 'Cancel anytime — month to month, always.',
  },
  {
    icon: HeadsetIcon,
    title: 'Real local support',
    description: 'A real person in your own time zone, not an offshore ticket queue.',
  },
  {
    icon: MapPinIcon,
    title: 'Keep your number',
    description: 'Bring your existing number across — porting is free on every plan.',
  },
];

const FAQS = [
  {
    question: 'What is a home VoIP phone line?',
    answer:
      'A home VoIP line is a phone line that works over the internet. You get a real South African number and can call from the Kiatri app on your phone or computer, or from a cordless phone connected to your router.',
  },
  {
    question: 'How much does a home phone line cost?',
    answer: `Home plans start from ${formatZAR(cheapest)} a month, with calls from ${CALL_RATE} a minute on pay-as-you-go. Home 200 and Home 400 include minutes every month.`,
  },
  {
    question: 'Can I keep my existing home number?',
    answer: 'Yes. You can port your current South African number to Kiatri, and porting is free on every plan.',
  },
  {
    question: 'What is the difference between Prepaid and Capped?',
    answer: `Prepaid gives you your minutes every month, and you can keep talking after them from ${CALL_RATE} a minute. Capped is one fixed price with nothing extra. Capped plans are coming soon.`,
  },
  {
    question: 'Can I use my own cordless phone?',
    answer:
      'Yes. Gigaset, Yealink, Panasonic, Snom and similar SIP-compatible cordless phones work with your Kiatri line. Renting or buying a handset from us is coming soon.',
  },
  {
    question: 'Is there a lock-in period?',
    answer: 'No. Home plans have no lock-in, so you can cancel anytime.',
  },
  {
    question: 'Do you offer international calling?',
    answer: 'International calling is coming soon. Local South African calling is available now.',
  },
];

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
      { '@type': 'ListItem', position: 2, name: 'Home Voice', item: PAGE_URL },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Kiatri Home Phone Line',
    description: 'A home phone line with a real South African number, for the Kiatri app or a cordless SIP phone.',
    brand: { '@type': 'Brand', name: SITE_NAME },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'ZAR',
      lowPrice: Math.min(...homePrices),
      highPrice: Math.max(...homePrices),
      offerCount: homePrices.length,
      availability: 'https://schema.org/InStock',
      url: `${PAGE_URL}#plans`,
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  },
];

export default function VoicePage() {
  const images = getAppImages();

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
        eyebrow="Home Voice"
        headlineLead="A home phone line,"
        headlineAccent="made easy."
        description="Call, video, and message from our app — or connect your own cordless phone. Real local numbers, no jargon, no lock-in."
        priceLabel="Home plans start from"
        priceValue={formatZAR(cheapest)}
        priceSuffix="/month line fee"
        ctaLabel="See plans"
        ctaHref="#plans"
      />

      <div className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="sr-only">Why choose Kiatri for your home phone line</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {PILLARS.map(({ icon: Icon, title, description }) => (
            <div key={title} className="rounded-2xl border border-navy-900/10 bg-white p-6 shadow-card">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-900 text-white">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-bold text-navy-900">{title}</h3>
              <p className="mt-2 text-sm text-navy-700">{description}</p>
            </div>
          ))}
        </div>

        <section id="plans" className="scroll-mt-24 mt-14">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-ember-600">Home Voice</p>
            <h2 className="mt-2 text-2xl font-bold text-navy-900">Pick how you want to call</h2>
          </div>
          <div className="mt-8">
            <VoiceTabsSection images={images} />
          </div>
          <p className="mt-6 text-center text-sm text-navy-700">
            Need more than one line, or work from home with a team? See our{' '}
            <a href="/business#line" className="font-semibold text-ember-600 hover:text-ember-500">
              business Line Plans
            </a>{' '}
            instead. Moving your number?{' '}
            <Link href="/numbers" className="font-semibold text-ember-600 hover:text-ember-500">
              Numbers &amp; porting
            </Link>
            .
          </p>
        </section>

        <section id="faq" className="scroll-mt-24 mt-14">
          <h2 className="text-2xl font-bold text-navy-900">Home phone line questions</h2>
          <div className="mt-6 divide-y divide-navy-900/10 rounded-2xl border border-navy-900/10 bg-white shadow-card">
            {FAQS.map(({ question, answer }) => (
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

        <div className="mt-14 rounded-2xl bg-navy-100/40 p-8 text-center">
          <h2 className="text-xl font-bold text-navy-900">Running a business instead?</h2>
          <p className="mt-2 text-navy-700">See our seat- and line-based plans built for teams.</p>
          <CTAButton href="/business" className="mt-5">See business plans</CTAButton>
        </div>
      </div>
    </>
  );
}
