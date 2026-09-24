import { ReactNode } from 'react';

// Original illustrations drawn for this page — site colours only (navy and
// ember), no brand logos, no photography. Numbers shown are masked examples.

const NAVY = '#0B1B33';
const NAVY_MID = '#122A4D';
const NAVY_SOFT = '#D9DEE7';
const NAVY_PALE = '#EEF1F6';
const EMBER = '#FF8A3D';
const EMBER_SOFT = '#FFE3CE';
const TEAL = '#22C1A3';
const FONT = 'Inter, system-ui, sans-serif';

// A light card so line art reads on the page's dark section.
export function IllustrationCard({ children }: { children: ReactNode }) {
  return <div className="overflow-hidden rounded-2xl border border-white/10 bg-white p-4 shadow-2xl sm:p-6">{children}</div>;
}

function Svg({ viewBox, label, children }: { viewBox: string; label: string; children: ReactNode }) {
  return (
    <svg viewBox={viewBox} role="img" aria-label={label} className="block h-auto w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      {children}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Voicemail delivered to email
// ---------------------------------------------------------------------------
export function VoicemailIllustration({ label }: { label: string }) {
  const bars = [10, 18, 26, 14, 30, 22, 12, 28, 20, 34, 16, 24, 12, 26, 18, 10, 22, 14, 8, 16];
  return (
    <Svg viewBox="0 0 480 330" label={label}>
      <rect x="0.5" y="0.5" width="479" height="329" rx="14" fill={NAVY_PALE} stroke={NAVY_SOFT} />
      {/* window bar */}
      <circle cx="22" cy="20" r="5" fill={NAVY_SOFT} />
      <circle cx="40" cy="20" r="5" fill={NAVY_SOFT} />
      <circle cx="58" cy="20" r="5" fill={NAVY_SOFT} />
      <rect x="84" y="14" width="120" height="12" rx="6" fill={NAVY_SOFT} />
      {/* faded inbox rows */}
      {[52, 250, 286].map((y, i) => (
        <g key={y} opacity={0.6}>
          <rect x="24" y={y} width="432" height="26" rx="8" fill="#fff" />
          <circle cx="42" cy={y + 13} r="7" fill={NAVY_SOFT} />
          <rect x="62" y={y + 8} width={[120, 96, 140][i]} height="6" rx="3" fill={NAVY_SOFT} />
          <rect x="62" y={y + 17} width={[220, 180, 240][i]} height="4" rx="2" fill={NAVY_PALE} />
        </g>
      ))}
      {/* the voicemail message card */}
      <rect x="24" y="86" width="432" height="150" rx="14" fill="#fff" stroke={EMBER} strokeWidth="1.5" />
      <circle cx="56" cy="118" r="18" fill={NAVY} />
      <path d="M46 111h20a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H46a2 2 0 0 1-2-2v-12a2 2 0 0 1 2-2Zm0 2 10 8 10-8" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <text x="84" y="114" fontFamily={FONT} fontSize="14" fontWeight="700" fill={NAVY}>
        New voicemail from 082 *** 4521 (0:42)
      </text>
      <text x="84" y="132" fontFamily={FONT} fontSize="11" fill="#5B6A82">
        Kiatri voicemail · just now
      </text>
      {/* audio player bar */}
      <rect x="44" y="150" width="392" height="40" rx="20" fill={NAVY_PALE} />
      <circle cx="68" cy="170" r="14" fill={EMBER} />
      <path d="M64 163.5v13l11-6.5-11-6.5Z" fill="#fff" />
      {bars.map((h, i) => (
        <rect key={i} x={94 + i * 12} y={170 - h / 2} width="5" height={h} rx="2.5" fill={i < 8 ? EMBER : NAVY_SOFT} />
      ))}
      <text x="396" y="174" fontFamily={FONT} fontSize="11" fontWeight="600" fill={NAVY}>
        0:42
      </text>
      {/* attachment chip */}
      <rect x="44" y="200" width="188" height="26" rx="13" fill="#fff" stroke={NAVY_SOFT} />
      <path d="M62 207.5v11m4-9v7m-8-5v3m12-6v9m4-7v5" stroke={EMBER} strokeWidth="2" strokeLinecap="round" />
      <text x="96" y="217" fontFamily={FONT} fontSize="11" fontWeight="600" fill={NAVY}>
        voicemail.wav
      </text>
      <text x="176" y="217" fontFamily={FONT} fontSize="10" fill="#5B6A82">
        Audio
      </text>
    </Svg>
  );
}

// ---------------------------------------------------------------------------
// Porting: old provider -> Kiatri -> your phone, same number all the way
// ---------------------------------------------------------------------------
export function PortingIllustration({ label }: { label: string }) {
  const chip = (x: number, y: number, highlight = false) => (
    <g>
      <rect x={x - 54} y={y} width="108" height="26" rx="13" fill={highlight ? EMBER : '#fff'} stroke={highlight ? EMBER : NAVY_SOFT} />
      <text x={x} y={y + 17.5} textAnchor="middle" fontFamily={FONT} fontSize="12" fontWeight="700" fill={highlight ? '#fff' : NAVY}>
        012 *** 4567
      </text>
    </g>
  );
  return (
    <Svg viewBox="0 0 480 240" label={label}>
      {/* connectors */}
      <path d="M118 96h84" stroke={NAVY_SOFT} strokeWidth="3" strokeDasharray="2 8" strokeLinecap="round" />
      <path d="M282 96h84" stroke={EMBER} strokeWidth="3" strokeDasharray="2 8" strokeLinecap="round" />
      <path d="M194 90l10 6-10 6M358 90l10 6-10 6" stroke={NAVY} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* 1 old provider */}
      <circle cx="80" cy="96" r="38" fill={NAVY_PALE} stroke={NAVY_SOFT} strokeWidth="2" />
      <path d="M80 70v52m-14-40l14-12 14 12m-24 14l10-8 10 8m-20 14l10-8 10 8" stroke={NAVY_MID} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* 2 Kiatri */}
      <circle cx="240" cy="96" r="38" fill={NAVY} />
      <rect x="216" y="92" width="6" height="12" rx="3" fill={EMBER} />
      <rect x="227" y="82" width="6" height="28" rx="3" fill="#fff" />
      <rect x="238" y="74" width="6" height="38" rx="3" fill={EMBER} />
      <rect x="249" y="86" width="6" height="22" rx="3" fill="#fff" />
      {/* 3 your phone */}
      <rect x="342" y="60" width="52" height="72" rx="10" fill={NAVY_PALE} stroke={NAVY} strokeWidth="2.5" />
      <rect x="350" y="70" width="36" height="46" rx="4" fill="#fff" />
      <circle cx="368" cy="124" r="2.5" fill={NAVY} />
      <path d="M362 88c1 6 6 11 12 12l3-4-5-5-2 1c-2-1-4-3-5-5l1-2-4-5-4 8Z" fill={EMBER} />
      {/* step badges */}
      {[80, 240, 368].map((x, i) => (
        <g key={x}>
          <circle cx={x} cy="30" r="13" fill={i === 1 ? EMBER : NAVY} />
          <text x={x} y="35" textAnchor="middle" fontFamily={FONT} fontSize="13" fontWeight="700" fill="#fff">
            {i + 1}
          </text>
        </g>
      ))}
      {/* the number travels across */}
      {chip(80, 150)}
      {chip(240, 150, true)}
      {chip(368, 150)}
      {/* labels */}
      {[
        [80, 'Your old provider'],
        [240, 'Kiatri'],
        [368, 'Your phone'],
      ].map(([x, t]) => (
        <text key={String(t)} x={x as number} y="204" textAnchor="middle" fontFamily={FONT} fontSize="13" fontWeight="600" fill={NAVY}>
          {t}
        </text>
      ))}
      <text x="240" y="226" textAnchor="middle" fontFamily={FONT} fontSize="11" fill="#5B6A82">
        Same number, new home
      </text>
    </Svg>
  );
}

// ---------------------------------------------------------------------------
// Incoming call screen (used inside a phone frame)
// ---------------------------------------------------------------------------
export function IncomingCallScreen({ label }: { label: string }) {
  return (
    <svg viewBox="0 0 270 570" role="img" aria-label={label} className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ic-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={NAVY_MID} />
          <stop offset="1" stopColor={NAVY} />
        </linearGradient>
      </defs>
      <rect width="270" height="570" fill="url(#ic-bg)" />
      <circle cx="135" cy="150" r="70" fill={EMBER} opacity="0.12" />
      <circle cx="135" cy="150" r="50" fill={EMBER} opacity="0.18" />
      <circle cx="135" cy="150" r="34" fill={EMBER} />
      <text x="135" y="160" textAnchor="middle" fontFamily={FONT} fontSize="26" fontWeight="700" fill="#fff">
        TM
      </text>
      <text x="135" y="250" textAnchor="middle" fontFamily={FONT} fontSize="12" fill="#9AA7BD">
        Incoming call
      </text>
      <text x="135" y="282" textAnchor="middle" fontFamily={FONT} fontSize="24" fontWeight="700" fill="#fff">
        Thabo M.
      </text>
      <text x="135" y="308" textAnchor="middle" fontFamily={FONT} fontSize="15" fill="#C9D2E1">
        082 *** 4521
      </text>
      <text x="135" y="332" textAnchor="middle" fontFamily={FONT} fontSize="11" fill="#9AA7BD">
        to your Kiatri home line
      </text>
      <circle cx="80" cy="470" r="30" fill="#E5484D" />
      <path d="M68 476c8-8 26-8 34 0l-5 6-7-3v-5c-4-2-6-2-10 0v5l-7 3-5-6Z" fill="#fff" />
      <circle cx="190" cy="470" r="30" fill={TEAL} />
      <path d="M180 458c1 8 7 16 16 19l5-5-6-6-3 1c-3-2-6-5-7-8l1-3-6-6-6 8Z" fill="#fff" />
      <text x="80" y="520" textAnchor="middle" fontFamily={FONT} fontSize="11" fill="#9AA7BD">
        Decline
      </text>
      <text x="190" y="520" textAnchor="middle" fontFamily={FONT} fontSize="11" fill="#9AA7BD">
        Answer
      </text>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Stand-ins for the app screenshots until the real ones are added
// ---------------------------------------------------------------------------
export function AppDesktopScreen({ label }: { label: string }) {
  return (
    <svg viewBox="0 0 640 400" role="img" aria-label={label} className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <rect width="640" height="400" fill="#fff" />
      <rect width="150" height="400" fill={NAVY} />
      <rect x="20" y="22" width="8" height="14" rx="4" fill={EMBER} />
      <rect x="31" y="16" width="8" height="26" rx="4" fill="#fff" />
      <text x="50" y="35" fontFamily={FONT} fontSize="15" fontWeight="700" fill="#fff">
        kiatri
      </text>
      {['Dialer', 'History', 'Voicemail', 'Balance'].map((t, i) => (
        <g key={t}>
          <rect x="14" y={74 + i * 40} width="122" height="30" rx="8" fill={i === 0 ? NAVY_MID : 'none'} />
          <circle cx="32" cy={89 + i * 40} r="5" fill={i === 0 ? EMBER : '#5B6A82'} />
          <text x="46" y={93 + i * 40} fontFamily={FONT} fontSize="12" fill={i === 0 ? '#fff' : '#9AA7BD'}>
            {t}
          </text>
        </g>
      ))}
      {/* keypad */}
      <text x="180" y="42" fontFamily={FONT} fontSize="15" fontWeight="700" fill={NAVY}>
        Dialer
      </text>
      <rect x="180" y="56" width="180" height="34" rx="10" fill={NAVY_PALE} />
      {[0, 1, 2, 3].map((r) =>
        [0, 1, 2].map((c) => (
          <circle key={`${r}${c}`} cx={210 + c * 60} cy={126 + r * 54} r="21" fill={NAVY_PALE} />
        )),
      )}
      <circle cx="270" cy="342" r="21" fill={TEAL} opacity="0" />
      {/* call history */}
      <text x="410" y="42" fontFamily={FONT} fontSize="15" fontWeight="700" fill={NAVY}>
        Recent calls
      </text>
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <circle cx="428" cy={82 + i * 56} r="14" fill={i % 2 ? NAVY_SOFT : EMBER_SOFT} />
          <rect x="452" y={72 + i * 56} width={[110, 90, 120, 80, 100][i]} height="8" rx="4" fill={NAVY_SOFT} />
          <rect x="452" y={88 + i * 56} width={[70, 60, 80, 50, 64][i]} height="6" rx="3" fill={NAVY_PALE} />
        </g>
      ))}
    </svg>
  );
}

export function AppDialerScreen({ label }: { label: string }) {
  return (
    <svg viewBox="0 0 270 570" role="img" aria-label={label} className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <rect width="270" height="570" fill="#fff" />
      <rect x="0" y="0" width="270" height="86" fill={NAVY} />
      <text x="20" y="58" fontFamily={FONT} fontSize="17" fontWeight="700" fill="#fff">
        Dialer
      </text>
      <rect x="20" y="104" width="230" height="44" rx="12" fill={NAVY_PALE} />
      {[0, 1, 2, 3].map((r) =>
        [0, 1, 2].map((c) => (
          <circle key={`${r}${c}`} cx={64 + c * 71} cy={210 + r * 74} r="28" fill={NAVY_PALE} />
        )),
      )}
      <circle cx="135" cy="516" r="30" fill={TEAL} />
      <path d="M125 504c1 8 7 16 16 19l5-5-6-6-3 1c-3-2-6-5-7-8l1-3-6-6-6 8Z" fill="#fff" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Connect a Phone
// ---------------------------------------------------------------------------
export function DectPhoneIllustration({ label }: { label: string }) {
  const line = { stroke: NAVY, strokeWidth: 3, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <Svg viewBox="0 0 480 300" label={label}>
      {/* base station */}
      <path d="M270 210h150l-14 46a10 10 0 0 1-9.6 7H293.600a10 10 0 0 1-9.600-7L270 210Z" {...line} fill={NAVY_PALE} />
      <path d="M270 210c0-10 33-18 75-18s75 8 75 18-33 18-75 18-75-8-75-18Z" {...line} fill="#fff" />
      <circle cx="345" cy="236" r="4" fill={EMBER} />
      <path d="M345 192v-34" {...line} />
      <path d="M322 148c12-12 34-12 46 0M310 134c19-19 41-19 60 0" stroke={EMBER} strokeWidth="3" strokeLinecap="round" />
      {/* cordless handset */}
      <g transform="rotate(-12 150 150)">
        <rect x="100" y="40" width="100" height="220" rx="28" {...line} fill="#fff" />
        <rect x="114" y="62" width="72" height="62" rx="8" {...line} fill={NAVY_PALE} />
        <path d="M128 84h44M128 100h30" stroke={NAVY_SOFT} strokeWidth="4" strokeLinecap="round" />
        <circle cx="150" cy="148" r="9" {...line} fill="#fff" />
        {[0, 1, 2].map((r) =>
          [0, 1, 2].map((c) => <circle key={`${r}${c}`} cx={124 + c * 26} cy={178 + r * 24} r="6" stroke={NAVY} strokeWidth="2.5" fill="#fff" />),
        )}
        <path d="M132 50h36" stroke={NAVY} strokeWidth="3" strokeLinecap="round" />
      </g>
      <text x="345" y="290" textAnchor="middle" fontFamily={FONT} fontSize="12" fontWeight="600" fill={NAVY}>
        Base station
      </text>
      <text x="150" y="292" textAnchor="middle" fontFamily={FONT} fontSize="12" fontWeight="600" fill={NAVY}>
        Cordless handset
      </text>
    </Svg>
  );
}

export function SetupStepsIllustration({ label }: { label: string }) {
  const steps: [string, string][] = [
    ['Plug in the base station', ''],
    ['Enter your Kiatri line details', ''],
    ['Make a test call', ''],
  ];
  return (
    <Svg viewBox="0 0 480 250" label={label}>
      <path d="M160 120h20M320 120h20" stroke={NAVY_SOFT} strokeWidth="3" strokeLinecap="round" strokeDasharray="2 7" />
      {steps.map(([title], i) => {
        const cx = 80 + i * 160;
        return (
          <g key={title}>
            <circle cx={cx} cy="120" r="52" fill={NAVY_PALE} stroke={NAVY_SOFT} strokeWidth="2" />
            <circle cx={cx} cy="52" r="14" fill={i === 2 ? EMBER : NAVY} />
            <text x={cx} y="57.500" textAnchor="middle" fontFamily={FONT} fontSize="14" fontWeight="700" fill="#fff">
              {i + 1}
            </text>
            {i === 0 && (
              <g stroke={NAVY} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <rect x={cx - 24} y="112" width="48" height="22" rx="6" fill="#fff" />
                <path d={`M${cx - 8} 112v-14m16 14v-14M${cx} 134v14`} />
                <circle cx={cx + 14} cy="123" r="2.5" fill={EMBER} stroke="none" />
              </g>
            )}
            {i === 1 && (
              <g strokeLinecap="round">
                <rect x={cx - 26} y="96" width="52" height="48" rx="8" fill="#fff" stroke={NAVY} strokeWidth="3" />
                <path d={`M${cx - 16} 112h32M${cx - 16} 124h20`} stroke={NAVY_SOFT} strokeWidth="5" />
                <path d={`M${cx - 16} 136h12`} stroke={EMBER} strokeWidth="5" />
              </g>
            )}
            {i === 2 && (
              <g>
                <path d={`M${cx - 18} 100c2 14 12 26 26 30l6-9-9-9-4 2c-4-3-8-7-10-12l2-4-9-9-2 11Z`} fill={NAVY} />
                <circle cx={cx + 20} cy="106" r="13" fill={TEAL} />
                <path d={`M${cx + 14} 106l4.500 4.500 8-9`} stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </g>
            )}
            <text x={cx} y="208" textAnchor="middle" fontFamily={FONT} fontSize="12.500" fontWeight="600" fill={NAVY}>
              {title.length > 24 ? title.slice(0, title.lastIndexOf(' ', 22)) : title}
            </text>
            {title.length > 24 && (
              <text x={cx} y="225" textAnchor="middle" fontFamily={FONT} fontSize="12.500" fontWeight="600" fill={NAVY}>
                {title.slice(title.lastIndexOf(' ', 22) + 1)}
              </text>
            )}
          </g>
        );
      })}
    </Svg>
  );
}

export function RangeIllustration({ label }: { label: string }) {
  return (
    <Svg viewBox="0 0 480 300" label={label}>
      {/* floor plan */}
      <rect x="40" y="30" width="400" height="220" rx="6" fill="#fff" stroke={NAVY} strokeWidth="4" />
      <path d="M200 30v90M200 170v80M40 130h110M230 130h210M320 130v120" stroke={NAVY} strokeWidth="3" />
      {/* door gaps */}
      <path d="M200 120v50M150 130h30M260 130h30M320 180v30" stroke="#fff" strokeWidth="6" />
      {/* range rings around the base station */}
      <g fill="none" stroke={EMBER} strokeWidth="2.500" strokeDasharray="6 7" strokeLinecap="round">
        <circle cx="200" cy="145" r="46" opacity="0.95" />
        <circle cx="200" cy="145" r="92" opacity="0.6" />
        <circle cx="200" cy="145" r="138" opacity="0.32" />
      </g>
      <circle cx="200" cy="145" r="46" fill={EMBER} opacity="0.1" />
      <rect x="186" y="134" width="28" height="22" rx="6" fill={NAVY} />
      <circle cx="200" cy="145" r="3.500" fill={EMBER} />
      <rect x="150" y="164" width="100" height="18" rx="9" fill="#fff" stroke={NAVY_SOFT} />
      <text x="200" y="177" textAnchor="middle" fontFamily={FONT} fontSize="11" fontWeight="700" fill={NAVY}>
        Base station
      </text>
      {/* room labels */}
      <text x="95" y="82" textAnchor="middle" fontFamily={FONT} fontSize="11" fill="#5B6A82">
        Bedroom
      </text>
      <text x="270" y="82" textAnchor="middle" fontFamily={FONT} fontSize="11" fill="#5B6A82">
        Lounge
      </text>
      <text x="380" y="82" textAnchor="middle" fontFamily={FONT} fontSize="11" fill="#5B6A82">
        Study
      </text>
      <text x="380" y="200" textAnchor="middle" fontFamily={FONT} fontSize="11" fill="#5B6A82">
        Garage side
      </text>
      {/* optional repeater for a larger home */}
      <circle cx="380" cy="160" r="9" fill="#fff" stroke={TEAL} strokeWidth="3" />
      <path d="M375 160h10M380 155v10" stroke={TEAL} strokeWidth="2" strokeLinecap="round" />
      <text x="380" y="228" textAnchor="middle" fontFamily={FONT} fontSize="10.500" fontWeight="600" fill={TEAL}>
        + repeater
      </text>
    </Svg>
  );
}
