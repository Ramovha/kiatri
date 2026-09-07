// Trust stats are structural placeholders — do not ship real-looking numbers
// until they're backed by actual measured data. Swap the `value` fields once
// real figures are available (see SETUP.md).
const STATS = [
  { value: '[REPLACE WITH REAL DATA]', label: 'Network uptime, trailing 12 months' },
  { value: '[REPLACE WITH REAL DATA]', label: 'Average support response time' },
  { value: '[REPLACE WITH REAL DATA]', label: 'Independent review score' },
  { value: '[REPLACE WITH REAL DATA]', label: 'Businesses served' },
];

export default function TrustBar() {
  return (
    <section className="border-y border-navy-900/10 bg-white py-10">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 md:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-sm font-bold text-ember-600">{stat.value}</div>
            <div className="mt-1 text-xs text-navy-700">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
