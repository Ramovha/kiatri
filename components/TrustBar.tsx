import { ClockIcon, ShieldIcon, TagIcon, HeadsetIcon } from './icons';

// Trust stats are structural placeholders — do not ship real-looking numbers
// until they're backed by actual measured data. Swap the `value` fields once
// real figures are available (see SETUP.md).
const STATS = [
  { icon: ShieldIcon, value: '[REPLACE WITH REAL DATA]', label: 'Network uptime, trailing 12 months' },
  { icon: ClockIcon, value: '[REPLACE WITH REAL DATA]', label: 'Average support response time' },
  { icon: TagIcon, value: '[REPLACE WITH REAL DATA]', label: 'Independent review score' },
  { icon: HeadsetIcon, value: '[REPLACE WITH REAL DATA]', label: 'Businesses served' },
];

export default function TrustBar() {
  return (
    <section className="border-y border-navy-900/10 bg-white py-10">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-6 md:grid-cols-4">
        {STATS.map(({ icon: Icon, value, label }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-2 rounded-xl border border-navy-900/10 px-4 py-5 text-center"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ember-500/10 text-ember-600">
              <Icon className="h-4 w-4" />
            </span>
            <div className="text-sm font-bold text-navy-900">{value}</div>
            <div className="text-xs text-navy-700">{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
