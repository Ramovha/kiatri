import CTAButton from './CTAButton';
import PlanFinder from './PlanFinder';
import HeroIllustration from './HeroIllustration';
import { BoltIcon, MapPinIcon, TagIcon } from './icons';

const PILLS = [
  { icon: MapPinIcon, label: 'Local South African support' },
  { icon: TagIcon, label: 'Transparent, itemized pricing' },
  { icon: BoltIcon, label: 'Live in minutes, not days' },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy-950 text-white">
      <div
        className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-ember-500/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-navy-700/40 blur-3xl"
        aria-hidden
      />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-2 md:items-center md:py-28">
        <div>
          <p className="inline-block rounded-full border border-white/15 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-navy-200">
            Hosted VoIP &amp; Call Center, built for South Africa
          </p>
          <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
            A business phone system that answers to you — not a queue.
          </h1>
          <p className="mt-6 text-lg text-navy-200">
            Cloud PBX, SIP trunks, and call center tools with a real local team behind them and
            pricing you can actually read before you buy. Order online, and your line is
            provisioned automatically after payment — no sales call required.
          </p>

          <div className="mt-8">
            <PlanFinder />
          </div>

          <div className="mt-6 flex flex-wrap gap-4">
            <CTAButton href="/get-started">Get Started</CTAButton>
            <CTAButton href="/business" variant="ghost" className="border-white/25 text-white hover:border-white/60">
              See all plans
            </CTAButton>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
            {PILLS.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-sm text-navy-200">
                <Icon className="h-4 w-4 text-ember-400" />
                {label}
              </div>
            ))}
          </div>
        </div>

        <div className="relative hidden justify-self-center md:block">
          <HeroIllustration className="h-96 w-96" />

          <div className="absolute -left-6 top-6 flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-navy-900 shadow-card">
            <MapPinIcon className="h-4 w-4 text-ember-500" />
            <span className="text-xs font-semibold">Support answered locally</span>
          </div>
          <div className="absolute -right-4 bottom-10 flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-navy-900 shadow-card">
            <BoltIcon className="h-4 w-4 text-ember-500" />
            <span className="text-xs font-semibold">Auto-provisioned after payment</span>
          </div>
        </div>
      </div>
    </section>
  );
}
