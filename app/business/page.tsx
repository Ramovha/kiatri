import type { Metadata } from 'next';
import PromoBanner from '@/components/PromoBanner';
import PlanCategoryTabs, { PlanCategory } from '@/components/PlanCategoryTabs';
import FeatureTabs, { FeatureTab } from '@/components/FeatureTabs';
import BusinessAccountsBlock from '@/components/BusinessAccountsBlock';
import PlanComparison from '@/components/PlanComparison';
import { BrowserFrame, AppShot } from '@/components/voice/Frames';
import { IllustrationCard, VoicemailIllustration } from '@/components/voice/Illustrations';
import {
  PortalDashboardScreen,
  CallerIdIllustration,
  ForwardingIllustration,
  RingGroupsIllustration,
  FailoverIllustration,
} from '@/components/business/Illustrations';
import { HeadsetIcon, ServerRackIcon } from '@/components/icons';
import { pbxTiers, linePlans } from '@/lib/products';
import { meteredTrunks } from '@/lib/pricing';
import { getPortalImages } from '@/lib/appImages';
import { formatZAR } from '@/lib/format';
import { SITE_URL, SITE_NAME, SUPPORT_EMAIL, CALL_RATE } from '@/lib/site';

const cheapestPbx = [...pbxTiers].sort((a, b) => (a.priceZAR ?? 0) - (b.priceZAR ?? 0))[0];
const popularTrunk = meteredTrunks.find((plan) => plan.popular) ?? meteredTrunks[0];
const popularLine = linePlans.find((plan) => plan.popular) ?? linePlans[0];

// The tabbed tier browser. Deep links: #cloud-pbx, #line, #trunks (the old
// #voip link still works — PlanCategoryTabs redirects it to #cloud-pbx).
// Monthly prices only; a yearly option returns once yearly bundles exist in
// billing.
const PLAN_CATEGORIES: PlanCategory[] = [
  {
    id: 'cloud-pbx',
    label: 'Cloud PBX',
    description: `A complete cloud phone system for your whole team. Every tier includes its minutes every month, then keep talking from ${CALL_RATE}/min.`,
    plans: pbxTiers,
  },
  {
    id: 'line',
    label: 'Line Plans',
    description: 'A single business phone line — no PBX needed. Pick your bundled minutes.',
    plans: linePlans,
    visualizerPlan: popularLine,
  },
  {
    id: 'trunks',
    label: 'SIP Trunk Plans',
    description:
      'Bulk calling capacity for a PBX or PABX you already run, sized by channels and bulk minutes instead of seats.',
    plans: meteredTrunks,
    visualizerPlan: popularTrunk,
  },
];

const PAGE_URL = `${SITE_URL}/business`;
const TITLE = 'Business Phone System South Africa | Cloud PBX & SIP Trunks | Kiatri';
const DESCRIPTION = `Cloud PBX, business phone lines and SIP trunks for South African businesses. Plans from R${cheapestPbx.priceZAR}/month with priority local support.`;
const OG_ALT = 'Kiatri cloud PBX, business phone lines and SIP trunks for South African businesses';

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
    icon: HeadsetIcon,
    title: 'Priority local support',
    description: 'Business customers get priority access to our South African support team.',
  },
  {
    icon: ServerRackIcon,
    title: 'Custom trunk sizing',
    description: 'Tell us your peak concurrent call volume and we’ll size channels and minutes to match — no guessing from a generic tier.',
  },
];

const offer = (price: number, anchor: string) => ({
  '@type': 'Offer',
  price,
  priceCurrency: 'ZAR',
  availability: 'https://schema.org/InStock',
  url: `${PAGE_URL}#${anchor}`,
  priceSpecification: { '@type': 'UnitPriceSpecification', price, priceCurrency: 'ZAR', unitCode: 'MON' },
});

const PRODUCTS = [
  ...pbxTiers.map((plan) => ({ name: `Kiatri Cloud ${plan.name}`, plan, anchor: 'cloud-pbx' })),
  ...linePlans.map((plan) => ({ name: `Kiatri Business Line ${plan.name}`, plan, anchor: 'line' })),
  ...meteredTrunks.map((plan) => ({ name: `Kiatri SIP Trunk ${plan.name}`, plan, anchor: 'trunks' })),
].map(({ name, plan, anchor }) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name,
  description: plan.tagline,
  brand: { '@type': 'Brand', name: SITE_NAME },
  offers: offer(plan.priceZAR ?? 0, anchor),
}));

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
      { '@type': 'ListItem', position: 2, name: 'For Business', item: PAGE_URL },
    ],
  },
  ...PRODUCTS,
];

export default function BusinessPage() {
  const portal = getPortalImages();
  const portalShot = portal['portal-dashboard'] ?? portal['portal-login'];
  const portalAlt = 'Kiatri phone system portal';

  // Feature tour. The portal shows the supplied screenshot when it exists
  // (public/images/portal/, then run scripts/optimize-app-images.py) and an
  // original illustration until then; every other tab is an original
  // illustration.
  const FEATURE_TABS: FeatureTab[] = [
    {
      id: 'portal',
      label: 'Phone System Portal',
      title: 'Manage your phone system from one portal',
      description:
        'Add users and extensions, set up voicemail, ring groups and call routing, and see your call history. Your invoices, top-ups and support are one click away in your client area.',
      bullets: ['Manage users and extensions', 'Voicemail, ring groups and IVR', 'Call history and reports', 'Invoices and support in your client area'],
      visual: <BrowserFrame>{portalShot ? <AppShot image={portalShot} alt={portalAlt} /> : <PortalDashboardScreen label={portalAlt} />}</BrowserFrame>,
    },
    {
      id: 'voicemail',
      label: 'Voicemail to Email',
      title: 'Never miss a message',
      description: 'Voicemails arrive in your inbox as audio files.',
      bullets: ['Delivered as an audio file', 'Works for every extension', 'No extra app to check'],
      visual: (
        <IllustrationCard>
          <VoicemailIllustration label="Voicemail delivered to email as an audio file" />
        </IllustrationCard>
      ),
    },
    {
      id: 'callerid',
      label: 'Caller ID',
      title: 'Present one professional number',
      description: 'Every call from your team shows your business number.',
      bullets: ['Inbound caller ID on every extension', 'Set your outbound number per line or user'],
      visual: (
        <IllustrationCard>
          <CallerIdIllustration label="Every call from your team shows one business number" />
        </IllustrationCard>
      ),
    },
    {
      id: 'forwarding',
      label: 'Call Forwarding',
      title: 'Take calls anywhere',
      description: 'Forward to a mobile or another extension when you’re away.',
      bullets: ['Forward on no-answer or busy', 'Different rules for after-hours'],
      visual: (
        <IllustrationCard>
          <ForwardingIllustration label="Calls forwarded from a desk phone to a mobile or another extension" />
        </IllustrationCard>
      ),
    },
    {
      id: 'ringgroups',
      label: 'Ring Groups',
      title: 'Ring the right people',
      description: 'One number rings a whole team, all at once or in turn.',
      bullets: ['Ring simultaneously or in sequence', 'Route by department'],
      visual: (
        <IllustrationCard>
          <RingGroupsIllustration label="One business number ringing a whole team at once or in turn" />
        </IllustrationCard>
      ),
    },
    {
      id: 'failover',
      label: 'Failover Routing',
      title: 'Stay reachable, always',
      description: 'If your office goes offline, calls go to mobiles or voicemail automatically.',
      bullets: ['Automatic failover to a backup destination', 'No manual switch-over needed'],
      visual: (
        <IllustrationCard>
          <FailoverIllustration label="Calls rerouted to mobiles or voicemail when the office goes offline" />
        </IllustrationCard>
      ),
    },
  ];

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
        eyebrow="For Business"
        headlineLead="Built for teams"
        headlineAccent="that can't afford a dropped call."
        description="Cloud PBX, business phone lines and SIP trunks for South African teams, with priority local support and plans that grow with you."
        priceLabel="Business plans from"
        priceValue={formatZAR(cheapestPbx.priceZAR ?? 0)}
        priceSuffix="/month"
        ctaLabel="See plans"
        ctaHref="#plans"
        illustrationAlt="Kiatri cloud phone system for South African businesses"
      />

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-6 md:grid-cols-2">
            {PILLARS.map(({ icon: Icon, title, description }) => (
              <div key={title} className="rounded-2xl border border-navy-900/10 bg-white p-6 shadow-card">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-900 text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <h2 className="mt-4 font-bold text-navy-900">{title}</h2>
                <p className="mt-2 text-sm text-navy-700">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="plans" className="scroll-mt-24 border-t border-navy-900/10 bg-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-ember-600">Plans</p>
            <h2 className="mt-2 text-2xl font-bold text-navy-900">Pick a plan type</h2>
          </div>
          <div className="mt-8">
            <PlanCategoryTabs categories={PLAN_CATEGORIES} />
          </div>
          <p className="mt-6 text-center text-sm text-navy-700">
            Want to see the exact monthly total as you configure it? Try our{' '}
            <a href="/pricing#builder" className="font-semibold text-ember-600 hover:text-ember-500">
              cost calculator
            </a>
            . Need queues, IVR, or recording on top? See{' '}
            <a href="/call-center" className="font-semibold text-ember-600 hover:text-ember-500">
              Call Center
            </a>
            .
          </p>
        </div>
      </section>

      {/* Static tables: every plan, price and included-minutes figure is real
          HTML on first load, so search engines read all tabs, not just the
          one that is open. */}
      <section id="compare" className="scroll-mt-24 border-t border-navy-900/10 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-bold text-navy-900">Compare business plans and prices</h2>
          <PlanComparison
            families={['business', 'trunk']}
            idPrefix="compare-"
            titles={{ business: 'Line Plans', trunk: 'SIP Trunk Plans' }}
          />
        </div>
      </section>

      <section className="border-t border-navy-900/10 bg-white py-14">
        <div className="mx-auto max-w-6xl px-6">
          <BusinessAccountsBlock
            id="business-accounts"
            description="One monthly invoice for your whole team, with terms tailored to your business. Multi-site and custom setups welcome."
          />
        </div>
      </section>

      <section className="bg-navy-950 py-20 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-ember-400">Every Kiatri account includes</p>
          <h2 className="mt-2 text-3xl font-bold">Business phone system features</h2>
          <p className="mt-3 max-w-2xl text-navy-200">
            The features underneath every plan — click through to see what your account can do out of the box.
          </p>
          <div className="mt-10">
            <FeatureTabs tabs={FEATURE_TABS} />
          </div>
        </div>
      </section>
    </>
  );
}
