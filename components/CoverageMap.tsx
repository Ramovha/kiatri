// An honest coverage visual, not a geographically precise map — a "tile
// cartogram" of South Africa's 9 provinces in their approximate relative
// positions. Deliberately not a literal country outline: hand-approximating
// real provincial borders risks getting them visibly wrong, and a labeled
// grid is actually clearer here than a shape most visitors can't read
// coverage off anyway. Confirmed provinces are highlighted; the other five
// are shown, muted, as "coverage being expanded" — never hidden, per the
// constraint that this must not imply reach we haven't verified.
interface ProvinceTile {
  name: string;
  city?: string;
  confirmed: boolean;
  row: number;
  col: number;
}

const PROVINCES: ProvinceTile[] = [
  { name: 'Limpopo', confirmed: false, row: 1, col: 2 },
  { name: 'North West', confirmed: false, row: 2, col: 1 },
  { name: 'Gauteng', city: 'Johannesburg', confirmed: true, row: 2, col: 2 },
  { name: 'Mpumalanga', confirmed: false, row: 2, col: 3 },
  { name: 'Northern Cape', confirmed: false, row: 3, col: 1 },
  { name: 'Free State', confirmed: false, row: 3, col: 2 },
  { name: 'KwaZulu-Natal', city: 'Durban', confirmed: true, row: 3, col: 3 },
  { name: 'Western Cape', city: 'Cape Town', confirmed: true, row: 4, col: 1 },
  { name: 'Eastern Cape', city: 'East London', confirmed: true, row: 4, col: 2 },
];

export default function CoverageMap() {
  return (
    <div className="rounded-2xl border border-navy-900/10 bg-white p-6 shadow-card sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-ember-600">Coverage</p>
      <h3 className="mt-2 font-display text-xl font-bold text-navy-900">Where we&apos;re confirmed live</h3>
      <p className="mt-2 max-w-2xl text-sm text-navy-700">
        This is a simplified layout, not a literal map — it shows each province&apos;s approximate position, not
        its exact shape. We&apos;re confirmed and tested in four provinces so far; the rest are being verified,
        not assumed.
      </p>

      <div
        className="mx-auto mt-6 grid max-w-md gap-2"
        style={{ gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(4, auto)' }}
      >
        {PROVINCES.map((province) => (
          <div
            key={province.name}
            style={{ gridRow: province.row, gridColumn: province.col }}
            className={`flex min-h-[76px] flex-col justify-center rounded-lg border p-3 text-center ${
              province.confirmed
                ? 'border-ember-500 bg-ember-500/10'
                : 'border-dashed border-navy-900/15 bg-navy-100/40'
            }`}
          >
            <span className={`text-xs font-semibold ${province.confirmed ? 'text-navy-900' : 'text-navy-500'}`}>
              {province.name}
            </span>
            {province.confirmed ? (
              <span className="mt-0.5 text-[11px] font-medium text-ember-600">{province.city}</span>
            ) : (
              <span className="mt-0.5 text-[10px] text-navy-400">Coverage being expanded</span>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-5 text-xs text-navy-700">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full border border-ember-500 bg-ember-500/40" />
          Confirmed &amp; tested
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full border border-dashed border-navy-400" />
          Coverage being expanded
        </span>
      </div>
    </div>
  );
}
