// Small inline SVG icon set — deliberately hand-drawn/minimal rather than a
// stock icon-font or third-party illustration pack, per the "no stock imagery"
// design direction.

type IconProps = { className?: string };

export function HandsetIcon({ className = 'w-6 h-6' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.75}>
      <path
        d="M5 4c1 3 1 6 2.5 8.5C9 15 11 17 13.5 18.5c2.5 1.5 5.5 1.5 8.5 2.5.4-.5.8-2.4-.3-3.6-.9-1-2.6-1.3-3.7-.5-2.1-.9-3.8-2.6-4.7-4.7.8-1.1.5-2.8-.5-3.7-1.2-1.1-3.1-.7-3.6-.3C8 7.5 8 4.5 5 4z"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ServerRackIcon({ className = 'w-6 h-6' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.75}>
      <rect x="4" y="3" width="16" height="6" rx="1" />
      <rect x="4" y="10" width="16" height="6" rx="1" />
      <rect x="4" y="17" width="16" height="4" rx="1" />
      <circle cx="7.5" cy="6" r="0.75" fill="currentColor" stroke="none" />
      <circle cx="7.5" cy="13" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function HeadsetIcon({ className = 'w-6 h-6' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.75}>
      <path d="M4 13v-1a8 8 0 0116 0v1" strokeLinecap="round" />
      <rect x="3" y="13" width="4" height="6" rx="1.5" />
      <rect x="17" y="13" width="4" height="6" rx="1.5" />
      <path d="M19 19v1a2 2 0 01-2 2h-3" strokeLinecap="round" />
    </svg>
  );
}

export function ShieldIcon({ className = 'w-6 h-6' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.75}>
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CheckIcon({ className = 'w-5 h-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={2}>
      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ClockIcon({ className = 'w-5 h-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.75}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MapPinIcon({ className = 'w-5 h-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.75}>
      <path d="M12 21s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12z" strokeLinejoin="round" />
      <circle cx="12" cy="9" r="2.25" />
    </svg>
  );
}

export function BoltIcon({ className = 'w-5 h-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.75}>
      <path d="M13 3L5 14h6l-1 7 9-12h-6l1-6z" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export function TagIcon({ className = 'w-5 h-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.75}>
      <path d="M20 12l-8 8-9-9V4h7l10 10z" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx="7.5" cy="7.5" r="1.25" fill="currentColor" stroke="none" />
    </svg>
  );
}
