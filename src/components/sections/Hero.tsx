'use client'

import HypnoticMark from '@/components/primitives/HypnoticMark'

export default function Hero() {
  const now = new Date()
  const stamp =
    now.toISOString().slice(0, 10) +
    ' · ' +
    String(now.getHours()).padStart(2, '0') +
    ':' +
    String(now.getMinutes()).padStart(2, '0')

  return (
    <section className="hero" id="top" data-screen-label="00 Hero">
      <HypnoticMark />
      <div className="hero-meta">
        <div className="col">
          <strong>DJ · Selector</strong>
          <span>Melodic / Progressive · House</span>
        </div>
        <div className="col">
          <strong>Based in</strong>
          <span>Buenos Aires — AR · 34.6°S</span>
        </div>
        <div className="col">
          <strong>System time</strong>
          <span>{stamp}</span>
        </div>
      </div>
      <div className="hero-title" style={{ position: 'relative', zIndex: 2 }}>
        MELINA<br />
        DEL<em>nero</em>
      </div>
      <div className="hero-foot">
        <div className="scroll-cue">
          <span className="line" />
          <span>Desliza</span>
        </div>
        <div>EST. 2018 — VOL. 08</div>
        <div>CABINA <span style={{ color: 'var(--accent)' }}>✦</span> RITUAL</div>
      </div>
    </section>
  )
}
