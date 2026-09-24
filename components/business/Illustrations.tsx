import { ReactNode } from 'react';

// Original illustrations for the Business page feature tour — drawn in the
// same style as the Home Voice page (site colours only, no logos, no
// photography). Numbers shown are masked examples.

const NAVY = '#0B1B33';
const NAVY_MID = '#122A4D';
const NAVY_SOFT = '#D9DEE7';
const NAVY_PALE = '#EEF1F6';
const EMBER = '#FF8A3D';
const EMBER_SOFT = '#FFE3CE';
const TEAL = '#22C1A3';
const RED = '#E5484D';
const MUTED = '#5B6A82';
const FONT = 'Inter, system-ui, sans-serif';

function Svg({ viewBox, label, children }: { viewBox: string; label: string; children: ReactNode }) {
  return (
    <svg viewBox={viewBox} role="img" aria-label={label} className="block h-auto w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      {children}
    </svg>
  );
}

const Person = ({ x, y, label, tone = NAVY }: { x: number; y: number; label: string; tone?: string }) => (
  <g>
    <circle cx={x} cy={y - 8} r="10" fill={tone} />
    <path d={`M${x - 16} ${y + 18}c0-14 8-20 16-20s16 6 16 20`} fill={tone} />
    <text x={x} y={y + 36} textAnchor="middle" fontFamily={FONT} fontSize="11" fontWeight="600" fill={NAVY}>
      {label}
    </text>
  </g>
);

// ---------------------------------------------------------------------------
// Phone system portal: stand-in for the dashboard screenshot
// ---------------------------------------------------------------------------
export function PortalDashboardScreen({ label }: { label: string }) {
  const rows = [
    ['Reception', '101'],
    ['Sales', '102'],
    ['Support', '103'],
    ['Accounts', '104'],
    ['Warehouse', '105'],
  ];
  return (
    <svg viewBox="0 0 640 400" role="img" aria-label={label} className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <rect width="640" height="400" fill="#fff" />
      <rect width="150" height="400" fill={NAVY} />
      <rect x="20" y="22" width="8" height="14" rx="4" fill={EMBER} />
      <rect x="31" y="16" width="8" height="26" rx="4" fill="#fff" />
      <text x="50" y="35" fontFamily={FONT} fontSize="15" fontWeight="700" fill="#fff">
        kiatri
      </text>
      {['Extensions', 'Voicemail', 'Ring groups', 'Call routing', 'Call history', 'Client area'].map((t, i) => (
        <g key={t}>
          <rect x="14" y={70 + i * 40} width="122" height="30" rx="8" fill={i === 0 ? NAVY_MID : 'none'} />
          <circle cx="32" cy={85 + i * 40} r="5" fill={i === 0 ? EMBER : MUTED} />
          <text x="46" y={89 + i * 40} fontFamily={FONT} fontSize="12" fill={i === 0 ? '#fff' : '#9AA7BD'}>
            {t}
          </text>
        </g>
      ))}
      <text x="176" y="42" fontFamily={FONT} fontSize="16" fontWeight="700" fill={NAVY}>
        Extensions
      </text>
      <rect x="500" y="24" width="120" height="28" rx="14" fill={EMBER} />
      <text x="560" y="43" textAnchor="middle" fontFamily={FONT} fontSize="12" fontWeight="700" fill="#fff">
        Add user
      </text>
      {/* stat tiles (bars only, no figures) */}
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={176 + i * 148} y="70" width="136" height="56" rx="10" fill={i === 0 ? EMBER_SOFT : NAVY_PALE} />
          <rect x={188 + i * 148} y="84" width="50" height="6" rx="3" fill={NAVY_SOFT} />
          <rect x={188 + i * 148} y="100" width="76" height="12" rx="6" fill={i === 0 ? EMBER : NAVY_SOFT} />
        </g>
      ))}
      {/* extension list */}
      <rect x="176" y="146" width="444" height="30" rx="8" fill={NAVY_PALE} />
      {['Name', 'Ext', 'Status'].map((h, i) => (
        <text key={h} x={[192, 380, 470][i]} y="166" fontFamily={FONT} fontSize="11" fontWeight="700" fill={MUTED}>
          {h}
        </text>
      ))}
      {rows.map(([name, ext], i) => (
        <g key={name}>
          <line x1="176" x2="620" y1={186 + i * 38 + 30} y2={186 + i * 38 + 30} stroke={NAVY_PALE} />
          <circle cx="198" cy={202 + i * 38} r="11" fill={i % 2 ? NAVY_SOFT : EMBER_SOFT} />
          <text x="218" y={206 + i * 38} fontFamily={FONT} fontSize="12" fontWeight="600" fill={NAVY}>
            {name}
          </text>
          <text x="380" y={206 + i * 38} fontFamily={FONT} fontSize="12" fill={MUTED}>
            {ext}
          </text>
          <circle cx="478" cy={202 + i * 38} r="5" fill={i === 3 ? NAVY_SOFT : TEAL} />
          <text x="490" y={206 + i * 38} fontFamily={FONT} fontSize="11" fill={MUTED}>
            {i === 3 ? 'Away' : 'Available'}
          </text>
        </g>
      ))}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Caller ID: every call from the team shows one business number
// ---------------------------------------------------------------------------
export function CallerIdIllustration({ label }: { label: string }) {
  return (
    <Svg viewBox="0 0 480 260" label={label}>
      <Person x={50} y={70} label="Sales" />
      <Person x={50} y={140} label="Support" tone={NAVY_MID} />
      <Person x={50} y={210} label="Accounts" />
      <g stroke={NAVY_SOFT} strokeWidth="3" strokeLinecap="round" strokeDasharray="2 7">
        <path d="M84 62C130 62 130 130 168 130" />
        <path d="M84 132h84" />
        <path d="M84 202C130 202 130 130 168 130" />
      </g>
      {/* the one business number */}
      <rect x="168" y="92" width="150" height="76" rx="14" fill="#fff" stroke={EMBER} strokeWidth="2" />
      <text x="243" y="118" textAnchor="middle" fontFamily={FONT} fontSize="11" fontWeight="600" fill={MUTED}>
        Your business number
      </text>
      <text x="243" y="146" textAnchor="middle" fontFamily={FONT} fontSize="18" fontWeight="800" fill={NAVY}>
        012 *** 4567
      </text>
      <path d="M322 130h44" stroke={EMBER} strokeWidth="3" strokeLinecap="round" />
      <path d="M358 122l10 8-10 8" stroke={EMBER} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {/* the customer's phone */}
      <rect x="378" y="60" width="72" height="140" rx="14" fill={NAVY} />
      <rect x="386" y="74" width="56" height="106" rx="6" fill={NAVY_MID} />
      <text x="414" y="102" textAnchor="middle" fontFamily={FONT} fontSize="9" fill="#9AA7BD">
        Incoming call
      </text>
      <circle cx="414" cy="126" r="14" fill={EMBER} />
      <path d="M408 122c1 5 5 9 10 10l3-3-4-4-1 1c-2-1-3-2-4-4l1-2-3-3-2 5Z" fill="#fff" />
      <text x="414" y="158" textAnchor="middle" fontFamily={FONT} fontSize="8.5" fontWeight="700" fill="#fff">
        012 *** 4567
      </text>
      <text x="414" y="170" textAnchor="middle" fontFamily={FONT} fontSize="8" fill="#9AA7BD">
        Your business
      </text>
      <text x="240" y="244" textAnchor="middle" fontFamily={FONT} fontSize="12" fontWeight="600" fill={NAVY}>
        Everyone on your team calls out as one business
      </text>
    </Svg>
  );
}

// ---------------------------------------------------------------------------
// Call forwarding: desk phone -> mobile or another extension
// ---------------------------------------------------------------------------
export function ForwardingIllustration({ label }: { label: string }) {
  return (
    <Svg viewBox="0 0 530 260" label={label}>
      {/* incoming call */}
      <circle cx="46" cy="118" r="20" fill={EMBER} />
      <path d="M38 112c1 6 6 11 12 13l4-4-5-5-2 1c-2-1-4-3-5-5l1-2-5-5-4 7Z" fill="#fff" />
      <text x="46" y="158" textAnchor="middle" fontFamily={FONT} fontSize="11" fontWeight="600" fill={NAVY}>
        Incoming
      </text>
      <path d="M72 118h38" stroke={NAVY_SOFT} strokeWidth="3" strokeLinecap="round" strokeDasharray="2 7" />
      {/* desk phone */}
      <rect x="112" y="84" width="96" height="70" rx="12" fill={NAVY_PALE} stroke={NAVY} strokeWidth="2.5" />
      <rect x="124" y="96" width="44" height="22" rx="4" fill="#fff" stroke={NAVY_SOFT} />
      {[0, 1, 2].map((r) => [0, 1, 2].map((c) => <circle key={`${r}${c}`} cx={178 + c * 9} cy={100 + r * 9} r="2.5" fill={NAVY} />))}
      <rect x="124" y="126" width="72" height="10" rx="5" fill={NAVY} />
      <text x="160" y="178" textAnchor="middle" fontFamily={FONT} fontSize="11" fontWeight="600" fill={NAVY}>
        Office desk phone
      </text>
      <text x="160" y="193" textAnchor="middle" fontFamily={FONT} fontSize="10" fill={MUTED}>
        You're away
      </text>
      {/* forks */}
      <path d="M212 112C250 112 250 66 296 66" stroke={EMBER} strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M212 126C250 126 250 190 296 190" stroke={EMBER} strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M288 58l10 8-10 8M288 182l10 8-10 8" stroke={EMBER} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* mobile */}
      <rect x="312" y="30" width="40" height="72" rx="9" fill={NAVY} />
      <rect x="318" y="40" width="28" height="50" rx="3" fill={NAVY_MID} />
      <circle cx="332" cy="60" r="8" fill={TEAL} />
      <path d="M328 60l3 3 5-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <text x="378" y="62" fontFamily={FONT} fontSize="12" fontWeight="700" fill={NAVY}>
        Your mobile
      </text>
      <text x="378" y="78" fontFamily={FONT} fontSize="10" fill={MUTED}>
        Forward on no answer
      </text>
      {/* another extension */}
      <rect x="306" y="156" width="52" height="68" rx="10" fill={NAVY_PALE} stroke={NAVY} strokeWidth="2.5" />
      <rect x="314" y="166" width="36" height="20" rx="3" fill="#fff" />
      <rect x="314" y="194" width="36" height="8" rx="4" fill={NAVY} />
      <circle cx="352" cy="164" r="9" fill={TEAL} />
      <path d="M348 164l3 3 5-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <text x="378" y="188" fontFamily={FONT} fontSize="12" fontWeight="700" fill={NAVY}>
        Another extension
      </text>
      <text x="378" y="204" fontFamily={FONT} fontSize="10" fill={MUTED}>
        A colleague picks up
      </text>
    </Svg>
  );
}

// ---------------------------------------------------------------------------
// Ring groups: all at once, or in turn
// ---------------------------------------------------------------------------
export function RingGroupsIllustration({ label }: { label: string }) {
  const desk = (x: number, y: number, tone: string, n?: number) => (
    <g>
      <rect x={x} y={y} width="34" height="26" rx="7" fill={tone} stroke={NAVY} strokeWidth="2" />
      <rect x={x + 6} y={y + 6} width="22" height="8" rx="2" fill="#fff" />
      {n && (
        <g>
          <circle cx={x + 17} cy={y - 10} r="10" fill={NAVY} />
          <text x={x + 17} y={y - 6} textAnchor="middle" fontFamily={FONT} fontSize="11" fontWeight="700" fill="#fff">
            {n}
          </text>
        </g>
      )}
    </g>
  );
  return (
    <Svg viewBox="0 0 480 280" label={label}>
      <rect x="20" y="20" width="440" height="116" rx="14" fill={NAVY_PALE} />
      <rect x="20" y="148" width="440" height="116" rx="14" fill={NAVY_PALE} />
      <text x="36" y="44" fontFamily={FONT} fontSize="12" fontWeight="700" fill={NAVY}>
        All at once
      </text>
      <text x="36" y="172" fontFamily={FONT} fontSize="12" fontWeight="700" fill={NAVY}>
        In turn
      </text>
      {/* one number */}
      {[78, 206].map((y) => (
        <g key={y}>
          <rect x="34" y={y - 20} width="98" height="32" rx="16" fill={EMBER} />
          <text x="83" y={y + 1} textAnchor="middle" fontFamily={FONT} fontSize="12" fontWeight="800" fill="#fff">
            012 *** 4567
          </text>
        </g>
      ))}
      {/* all at once: every phone rings */}
      <g stroke={EMBER} strokeWidth="2.5" strokeLinecap="round" opacity="0.85">
        <path d="M136 78C170 78 180 60 214 60M136 78h78M136 78C170 78 180 96 214 96" />
      </g>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={252 + i * 74} y="52" width="34" height="26" rx="7" fill="#fff" stroke={NAVY} strokeWidth="2" />
          <rect x={258 + i * 74} y="58" width="22" height="8" rx="2" fill={EMBER_SOFT} />
          <path d={`M${292 + i * 74} 58c5 3 5 9 0 12M${298 + i * 74} 53c9 6 9 18 0 24`} stroke={EMBER} strokeWidth="2" strokeLinecap="round" fill="none" />
        </g>
      ))}
      <text x="322" y="108" textAnchor="middle" fontFamily={FONT} fontSize="11" fill={MUTED}>
        Reception · Sales · Support
      </text>
      {/* in turn: 1 -> 2 -> 3 */}
      <path d="M136 206h70" stroke={EMBER} strokeWidth="2.5" strokeLinecap="round" strokeDasharray="2 7" />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          {desk(216 + i * 76, 194, i === 0 ? EMBER_SOFT : '#fff', i + 1)}
          {i < 2 && <path d={`M${254 + i * 76} 207h34M${282 + i * 76} 201l6 6-6 6`} stroke={NAVY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />}
        </g>
      ))}
      <text x="322" y="252" textAnchor="middle" fontFamily={FONT} fontSize="11" fill={MUTED}>
        If no answer, the next person rings
      </text>
    </Svg>
  );
}

// ---------------------------------------------------------------------------
// Failover routing: office offline -> mobiles or voicemail
// ---------------------------------------------------------------------------
export function FailoverIllustration({ label }: { label: string }) {
  return (
    <Svg viewBox="0 0 480 270" label={label}>
      {/* the office, offline */}
      <rect x="30" y="80" width="110" height="110" rx="10" fill={NAVY_PALE} stroke={NAVY} strokeWidth="2.5" />
      {[0, 1, 2].map((r) => [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={46 + c * 32} y={98 + r * 28} width="20" height="16" rx="3" fill="#fff" stroke={NAVY_SOFT} />))}
      <circle cx="140" cy="86" r="17" fill={RED} />
      <path d="M133 79l14 14M147 79l-14 14" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      <text x="85" y="214" textAnchor="middle" fontFamily={FONT} fontSize="12" fontWeight="700" fill={NAVY}>
        Your office
      </text>
      <text x="85" y="230" textAnchor="middle" fontFamily={FONT} fontSize="10.5" fill={RED}>
        Internet or power is down
      </text>
      {/* incoming call reroutes */}
      <circle cx="205" cy="135" r="18" fill={EMBER} />
      <path d="M197 129c1 6 6 11 12 13l4-4-5-5-2 1c-2-1-4-3-5-5l1-2-5-5-4 7Z" fill="#fff" />
      <path d="M150 135h34" stroke={NAVY_SOFT} strokeWidth="3" strokeLinecap="round" strokeDasharray="2 7" />
      <path d="M226 128C262 110 270 84 300 84" stroke={EMBER} strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M226 142C262 160 270 186 300 186" stroke={EMBER} strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M292 76l10 8-10 8M292 178l10 8-10 8" stroke={EMBER} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* mobiles */}
      <rect x="318" y="48" width="40" height="72" rx="9" fill={NAVY} />
      <rect x="324" y="58" width="28" height="50" rx="3" fill={NAVY_MID} />
      <circle cx="338" cy="78" r="8" fill={TEAL} />
      <path d="M334 78l3 3 5-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <text x="372" y="80" fontFamily={FONT} fontSize="12" fontWeight="700" fill={NAVY}>
        Team mobiles
      </text>
      <text x="372" y="96" fontFamily={FONT} fontSize="10" fill={MUTED}>
        Rings your mobiles
      </text>
      {/* voicemail */}
      <rect x="312" y="160" width="52" height="40" rx="8" fill="#fff" stroke={NAVY} strokeWidth="2.5" />
      <path d="M318 168l20 14 20-14" stroke={NAVY} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="362" cy="162" r="9" fill={TEAL} />
      <path d="M358 162l3 3 5-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <text x="378" y="182" fontFamily={FONT} fontSize="12" fontWeight="700" fill={NAVY}>
        Voicemail
      </text>
      <text x="378" y="198" fontFamily={FONT} fontSize="10" fill={MUTED}>
        Sent to your email
      </text>
      <text x="300" y="252" textAnchor="middle" fontFamily={FONT} fontSize="11" fill={MUTED}>
        No switching over by hand
      </text>
    </Svg>
  );
}
