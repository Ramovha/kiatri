import { ImageResponse } from 'next/og';

export const alt = 'Kiatri — Hosted VoIP & Call Center for South African Businesses';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          backgroundColor: '#070E1C',
          backgroundImage: 'radial-gradient(circle at 85% 15%, rgba(255,138,61,0.35), transparent 60%)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              display: 'flex',
              width: 64,
              height: 64,
              borderRadius: 16,
              backgroundColor: '#FF8A3D',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 36,
              fontWeight: 700,
            }}
          >
            k
          </div>
          <div style={{ fontSize: 40, fontWeight: 700 }}>kiatri</div>
        </div>
        <div style={{ marginTop: 48, fontSize: 56, fontWeight: 800, lineHeight: 1.15, maxWidth: 900 }}>
          A business phone system that answers to you.
        </div>
        <div style={{ marginTop: 28, fontSize: 28, color: '#9FB0C8', maxWidth: 820 }}>
          Cloud PBX, SIP trunks &amp; call center tools — local support, transparent pricing.
        </div>
      </div>
    ),
    { ...size }
  );
}
