import Hero from '@/components/Hero';
import CTAButton from '@/components/CTAButton';
import { HandsetIcon, ServerRackIcon, HeadsetIcon, HomeIcon } from '@/components/icons';

const BUSINESS_CATEGORIES = [
  {
    href: '/business#voip',
    icon: HandsetIcon,
    title: 'Cloud PBX',
    description: 'Seats, extensions, and a full PBX feature set with instant provisioning — from 5 to 50+ seats.',
  },
  {
    href: '/business#trunks',
    icon: ServerRackIcon,
    title: 'SIP Trunks',
    description: 'Bulk calling capacity sized by channels and minutes, sold separately from seats so you only pay for what you need.',
  },
  {
    href: '/call-center',
    icon: HeadsetIcon,
    title: 'Call Center',
    description: 'Queues, IVR, call recording, and more — bundled with your PBX as one flat-priced order.',
  },
];

export default function HomePage() {
  return (
    <>
      <Hero />
      {/* TrustBar is intentionally not rendered — every stat in it is still
          a [REPLACE WITH REAL DATA] placeholder, and showing that literal
          text on a live page reads as broken. Re-enable (import + render
          <TrustBar />) once real uptime/response-time/review/customer-count
          figures exist — see components/TrustBar.tsx. */}

      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-ember-600">What we run</p>
            <h2 className="mt-2 text-3xl font-bold text-navy-900">One phone system, sold in plain parts</h2>
            <p className="mt-3 text-navy-700">
              Seats and calling capacity are priced and sold separately — like a phone contract splits the
              device from the airtime. Mix and match what your business actually needs.
            </p>
          </div>
          <p className="mt-8 text-xs font-semibold uppercase tracking-wide text-navy-400">For Business</p>
          <div className="mt-3 grid gap-6 md:grid-cols-3">
            {BUSINESS_CATEGORIES.map(({ href, icon: Icon, title, description }) => (
              <a
                key={title}
                href={href}
                className="group flex flex-col rounded-2xl border border-navy-900/10 bg-white p-6 shadow-card transition hover:border-ember-500/50"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-900 text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-lg font-bold text-navy-900">{title}</h3>
                <p className="mt-2 flex-1 text-sm text-navy-700">{description}</p>
                <span className="mt-4 text-sm font-semibold text-ember-600 group-hover:text-ember-500">
                  Explore →
                </span>
              </a>
            ))}
          </div>

          {/* Home Voice is a genuinely different product line (residential
              tiers + app calling, not a business seat/trunk choice) — a
              wider horizontal card instead of a 4th identical tile keeps
              that distinction visible rather than implying it's just one
              more option in the same set. */}
          <p className="mt-10 text-xs font-semibold uppercase tracking-wide text-navy-400">For Home</p>
          <a
            href="/voice"
            className="group mt-3 flex flex-col items-start gap-4 rounded-2xl border border-navy-900/10 bg-white p-6 shadow-card transition hover:border-ember-500/50 sm:flex-row sm:items-center"
          >
            <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-navy-900 text-white">
              <HomeIcon className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-navy-900">Home Voice</h3>
              <p className="mt-1 text-sm text-navy-700">
                A home phone line or app-based calling — no business jargon, real local numbers, simple
                pricing.
              </p>
            </div>
            <span className="flex-none text-sm font-semibold text-ember-600 group-hover:text-ember-500">
              Explore →
            </span>
          </a>
        </div>
      </section>

      <section className="bg-navy-900 py-20 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-ember-400">Why businesses switch</p>
          <div className="mt-6 grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="text-lg font-bold">Real humans, local timezone</h3>
              <p className="mt-2 text-sm text-navy-200">
                No offshore ticket queue. When you call for support, you reach someone in your own time zone
                who understands the South African market.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold">Pricing you can actually read</h3>
              <p className="mt-2 text-sm text-navy-200">
                Seats and trunk capacity are priced separately and shown up front — not buried behind a vague
                &ldquo;starting from&rdquo; headline that changes once you add what you actually need.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold">Live in minutes, not days</h3>
              <p className="mt-2 text-sm text-navy-200">
                Order online and your line is provisioned automatically after payment — no waiting on a sales
                call or a manual setup queue.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof section intentionally not rendered — same reasoning as
          TrustBar above: no real testimonials/logos/review scores exist yet,
          and showing "[REPLACE WITH REAL DATA]" on a live page reads as
          broken. To re-enable, replace the real content below and delete
          the surrounding comment markers.

      <section className="py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-ember-600">Social proof</p>
          <h2 className="mt-2 text-2xl font-bold text-navy-900">[REPLACE WITH REAL DATA]</h2>
          <p className="mt-3 text-navy-700">
            Customer quotes, logos, or review scores go here once collected — structure only, no invented
            testimonials.
          </p>
        </div>
      </section>

      */}

      <section className="pb-24">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 rounded-3xl bg-navy-950 px-6 py-16 text-center text-white">
          <h2 className="text-3xl font-bold">Ready to get a number in minutes?</h2>
          <p className="max-w-xl text-navy-200">
            Compare plans, see the real breakdown, and order online — your line is provisioned automatically
            once payment clears.
          </p>
          <CTAButton href="/pricing">See pricing</CTAButton>
        </div>
      </section>
    </>
  );
}
