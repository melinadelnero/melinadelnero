'use client'

import HypnoticMark from '@/components/primitives/HypnoticMark'
import type { HeroTexts } from '@/lib/types'

export default function Hero({ texts }: { texts: HeroTexts }) {
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
        <em>delnero</em>
      </div>
      <div className="hero-foot">
        <div className="scroll-cue">
          <span className="line" />
          <span>{texts.scroll_label}</span>
        </div>
        <div>{texts.est} — {texts.vol}</div>
        <div>{texts.tagline}</div>
      </div>
    </section>
  )
}
