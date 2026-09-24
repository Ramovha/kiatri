// The dark rounded pill switcher used for top-level product toggles — first
// built for Residential/Connect-a-Phone on /voice, reused as-is (same
// component, same visual style) for the licence-type tabs on /call-center.
// Deliberately just the switcher control itself; each caller renders its
// own content below based on which id is active.
export interface PillTabOption {
  id: string;
  label: string;
}

export default function PillTabs({
  options,
  activeId,
  onChange,
}: {
  options: PillTabOption[];
  activeId: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex justify-center">
      <div className="inline-flex flex-wrap justify-center gap-1 rounded-full border border-navy-900/10 bg-navy-950 p-1 shadow-card">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
              option.id === activeId ? 'bg-white text-navy-900' : 'text-navy-200 hover:text-white'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
