import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = "Elevate Learning — Kuwait's Premier Language Institute"
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const TAGS = ['IELTS', 'TOEFL', 'English', 'Arabic', 'French', 'GMAT']

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0c3f6e 0%, #0357a0 40%, #0d8be8 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background decoration */}
        <div
          style={{
            position: 'absolute',
            top: '-80px',
            right: '-80px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-100px',
            left: '-60px',
            width: '360px',
            height: '360px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.04)',
            display: 'flex',
          }}
        />

        {/* Logo box */}
        <div
          style={{
            background: 'rgba(255,255,255,0.18)',
            border: '2px solid rgba(255,255,255,0.25)',
            borderRadius: '24px',
            width: '96px',
            height: '96px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '28px',
          }}
        >
          <span
            style={{
              fontSize: '44px',
              fontWeight: '900',
              color: 'white',
              letterSpacing: '-2px',
            }}
          >
            EL
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: '62px',
            fontWeight: '900',
            color: 'white',
            marginBottom: '14px',
            letterSpacing: '-2px',
            display: 'flex',
          }}
        >
          Elevate Learning
        </div>

        {/* Subheadline */}
        <div
          style={{
            fontSize: '26px',
            color: 'rgba(255,255,255,0.75)',
            marginBottom: '48px',
            display: 'flex',
          }}
        >
          🇰🇼 Kuwait's Premier Language Institute
        </div>

        {/* Program tags */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {TAGS.map((tag) => (
            <div
              key={tag}
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '40px',
                padding: '8px 22px',
                color: 'white',
                fontSize: '20px',
                fontWeight: '600',
                display: 'flex',
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  )
}
