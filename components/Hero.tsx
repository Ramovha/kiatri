import CTAButton from './CTAButton';
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
      <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="max-w-2xl">
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
          <div className="mt-8 flex flex-wrap gap-4">
            <CTAButton href="/pricing">See pricing</CTAButton>
            <CTAButton href="/products" variant="ghost" className="border-white/25 text-white hover:border-white/60">
              Explore products
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
      </div>
    </section>
  );
}
