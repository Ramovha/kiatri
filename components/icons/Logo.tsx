// Kiatri's mark: four bars of varying height, reading as a voice/call
// waveform rather than a generic "letter in a rounded box" — literal to
// what the business does (calls), and distinctive enough to recognize at
// favicon size. Two-tone (navy + ember) so it still reads on light or dark
// backgrounds without a container behind it.
export function LogoMark({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden>
      <rect x="2" y="13" width="5" height="10" rx="2.5" className="fill-ember-500" />
      <rect x="10" y="7" width="5" height="22" rx="2.5" className="fill-navy-900" />
      <rect x="18" y="1" width="5" height="30" rx="2.5" className="fill-ember-500" />
      <rect x="26" y="9" width="5" height="18" rx="2.5" className="fill-navy-900" />
    </svg>
  );
}

// Inverted-navy variant for the dark footer, where the navy bars would
// otherwise disappear against the navy-950 background.
export function LogoMarkInverse({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden>
      <rect x="2" y="13" width="5" height="10" rx="2.5" className="fill-ember-500" />
      <rect x="10" y="7" width="5" height="22" rx="2.5" className="fill-white" />
      <rect x="18" y="1" width="5" height="30" rx="2.5" className="fill-ember-500" />
      <rect x="26" y="9" width="5" height="18" rx="2.5" className="fill-white" />
    </svg>
  );
}
