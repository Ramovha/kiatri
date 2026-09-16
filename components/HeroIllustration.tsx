// Original abstract illustration standing in for the hero's visual anchor —
// deliberately not a stock/stand-in photo of a person, since we have no real
// photography to use and won't fabricate any. Reads as "calls flowing
// through a resilient network" via simple nodes + connecting arcs.
export default function HeroIllustration({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 480 480" fill="none" className={className} role="img" aria-label="Illustration of calls routing through a network">
      <circle cx="240" cy="240" r="200" fill="url(#hero-grad)" opacity="0.5" />
      <g stroke="#FF8A3D" strokeWidth="2" opacity="0.7">
        <path d="M120 300 C170 220 230 260 240 180" fill="none" />
        <path d="M240 180 C255 120 320 130 350 160" fill="none" />
        <path d="M240 180 C210 130 160 140 140 110" fill="none" />
      </g>
      <g>
        <circle cx="240" cy="180" r="16" fill="#0B1B33" />
        <circle cx="240" cy="180" r="16" stroke="#FF8A3D" strokeWidth="2" />
        <path d="M234 176c1 4 5 8 9 9l2-3-4-4-1 1c-2-1-3-3-4-4l1-2-3-3z" fill="#FFA25C" />
      </g>
      <circle cx="120" cy="300" r="10" fill="#122A4D" />
      <circle cx="350" cy="160" r="10" fill="#122A4D" />
      <circle cx="140" cy="110" r="8" fill="#1B3A66" />
      <circle cx="350" cy="300" r="8" fill="#1B3A66" />
      <path d="M240 196c-30 0-70 40-70 100" stroke="#1B3A66" strokeWidth="2" fill="none" opacity="0.5" />
      <path d="M240 196c30 0 70 40 70 100" stroke="#1B3A66" strokeWidth="2" fill="none" opacity="0.5" />
      <defs>
        <radialGradient id="hero-grad" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(240 240) rotate(90) scale(200)">
          <stop stopColor="#FF8A3D" stopOpacity="0.25" />
          <stop offset="1" stopColor="#0B1B33" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}
