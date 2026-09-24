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

export function HomeIcon({ className = 'w-6 h-6' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.75}>
      <path d="M4 11l8-7 8 7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 10v9a1 1 0 001 1h10a1 1 0 001-1v-9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 20v-5a1 1 0 011-1h2a1 1 0 011 1v5" strokeLinecap="round" strokeLinejoin="round" />
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

export function ArrowRightIcon({ className = 'w-5 h-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={2}>
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CheckCircleIcon({ className = 'w-5 h-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.75}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.5l2.2 2.2L15.5 9.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SignalBarsIcon({ className = 'w-6 h-6' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.75}>
      <path d="M4 17v2M9 13v6M14 9v10M19 4v16" strokeLinecap="round" />
    </svg>
  );
}

// --- Call Center feature icons — one distinct mark per capability instead
// of repeating a single checkmark for everything in that section. ---

export function QueueIcon({ className = 'w-6 h-6' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.75}>
      <circle cx="5" cy="7" r="1.5" fill="currentColor" stroke="none" />
      <path d="M9 7h11M9 12h11M9 17h11" strokeLinecap="round" />
      <circle cx="5" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="5" cy="17" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function MenuTreeIcon({ className = 'w-6 h-6' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.75}>
      <circle cx="4.5" cy="12" r="2" />
      <path d="M6.5 12h3M9.5 12v-6h5M9.5 12v6h5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="17" cy="6" r="2" />
      <circle cx="17" cy="18" r="2" />
    </svg>
  );
}

export function RecordDotIcon({ className = 'w-6 h-6' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.75}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function DashboardIcon({ className = 'w-6 h-6' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.75}>
      <rect x="3" y="4" width="18" height="13" rx="1.5" />
      <path d="M8 21h8M12 17v4" strokeLinecap="round" />
      <path d="M6.5 13.5l3-3 2.5 2 4-4.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ContactPopIcon({ className = 'w-6 h-6' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.75}>
      <rect x="3" y="6" width="14" height="12" rx="1.5" />
      <circle cx="8" cy="11" r="1.75" />
      <path d="M5.5 15.5c0-1.5 1.2-2.5 2.5-2.5s2.5 1 2.5 2.5" strokeLinecap="round" />
      <path d="M13 9h2M20 5v6l-3-2h-2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function TranscriptIcon({ className = 'w-6 h-6' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.75}>
      <path d="M6 3h9l4 4v14a1 1 0 01-1 1H6a1 1 0 01-1-1V4a1 1 0 011-1z" strokeLinejoin="round" />
      <path d="M9 13l1 3 1.5-5 1.5 5 1-3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ReportIcon({ className = 'w-6 h-6' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.75}>
      <path d="M6 3h9l4 4v14a1 1 0 01-1 1H6a1 1 0 01-1-1V4a1 1 0 011-1z" strokeLinejoin="round" />
      <path d="M12 10v7M9 14l3 3 3-3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function RouteIcon({ className = 'w-6 h-6' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.75}>
      <circle cx="5" cy="12" r="2" />
      <path d="M7 12h3.5M10.5 12c0-3 2-5 4.5-5M10.5 12c0 3 2 5 4.5 5" strokeLinecap="round" />
      <circle cx="18" cy="7" r="2" />
      <circle cx="18" cy="17" r="2" />
    </svg>
  );
}

export function HandshakeIcon({ className = 'w-6 h-6' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.75}>
      <path d="M2 11l4-3 4 2 3-2 2 1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 10l4 5 2-1.5M14 8.5L20 12l-4 4-3-2-2 1" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 9l4 3-3 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CalendarClockIcon({ className = 'w-6 h-6' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.75}>
      <rect x="3" y="4.5" width="14" height="15" rx="1.5" />
      <path d="M6.5 3v3M13.5 3v3M3 9h14" strokeLinecap="round" />
      <circle cx="18" cy="17" r="4.5" />
      <path d="M18 15v2l1.5 1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// --- Additional Call Center feature icons ---

export function HotDeskIcon({ className = 'w-6 h-6' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.75}>
      <rect x="3" y="13" width="8" height="7" rx="1" />
      <path d="M5 13V9a2 2 0 012-2h2a2 2 0 012 2v4" />
      <path d="M15 6l3 3-3 3M21 9h-9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ConferenceIcon({ className = 'w-6 h-6' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.75}>
      <circle cx="12" cy="7" r="2.5" />
      <circle cx="5" cy="16" r="2.5" />
      <circle cx="19" cy="16" r="2.5" />
      <path d="M9.5 8.5L6.8 14M14.5 8.5l2.7 5.5M7.5 16h9" strokeLinecap="round" />
    </svg>
  );
}

export function HolidayCalendarIcon({ className = 'w-6 h-6' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.75}>
      <rect x="3" y="4.5" width="18" height="16" rx="1.5" />
      <path d="M7 3v3M17 3v3M3 9.5h18" strokeLinecap="round" />
      <path d="M12 12l1.2 2.5 2.7.3-2 1.9.5 2.7-2.4-1.3-2.4 1.3.5-2.7-2-1.9 2.7-.3z" strokeLinejoin="round" />
    </svg>
  );
}

export function CallBackIcon({ className = 'w-6 h-6' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.75}>
      <path
        d="M5 4c1 3 1 6 2.5 8.5C9 15 11 17 13.5 18.5c2.5 1.5 5.5 1.5 8.5 2.5.4-.5.8-2.4-.3-3.6-.9-1-2.6-1.3-3.7-.5-2.1-.9-3.8-2.6-4.7-4.7.8-1.1.5-2.8-.5-3.7-1.2-1.1-3.1-.7-3.6-.3C8 7.5 8 4.5 5 4z"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path d="M16 3l3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19 6h-5a3 3 0 00-3 3v1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function AiSparkleIcon({ className = 'w-6 h-6' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.75}>
      <path
        d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path d="M19 15l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}
