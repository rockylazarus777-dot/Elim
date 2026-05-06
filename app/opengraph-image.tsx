import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Elim Medical Consultancy';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 80,
          background: 'linear-gradient(135deg, #0B3C5D 0%, #1D70B8 100%)',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0B3C5D',
              fontWeight: 800,
              fontSize: 28,
            }}
          >
            E
          </div>
          <div
            style={{
              fontSize: 22,
              letterSpacing: 4,
              fontWeight: 600,
              opacity: 0.85,
            }}
          >
            ELIM MEDICAL CONSULTANCY
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 88, fontWeight: 800, lineHeight: 1.05 }}>
            Bridging Care,
          </div>
          <div
            style={{
              fontSize: 88,
              fontWeight: 800,
              lineHeight: 1.05,
              color: '#9DC4E5',
            }}
          >
            Accelerating Growth
          </div>
          <div
            style={{
              marginTop: 24,
              fontSize: 30,
              fontWeight: 500,
              opacity: 0.9,
            }}
          >
            Hospital growth partner — Patient flow · Operations · NABH
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              padding: '12px 22px',
              background: 'white',
              color: '#0B3C5D',
              borderRadius: 999,
              fontWeight: 700,
              fontSize: 22,
            }}
          >
            www.emcforyou.com
          </div>
          <div style={{ fontSize: 20, opacity: 0.8 }}>+91 9600 822 491</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
