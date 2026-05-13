import Reveal from '@/components/primitives/Reveal'
import SectionHead from '@/components/primitives/SectionHead'
import type { Bio as BioData } from '@/lib/types'

export default function Bio({ data }: { data: BioData }) {
  return (
    <section className="section" id="bio" data-screen-label="01 Bio">
      <SectionHead idx="01" title="QUIÉN ES" code="/ ABOUT" />
      <div className="bio">
        <Reveal>
          <div className="bio-photo">
            <img src="/melina-portrait.jpg" alt="Melina Delnero" />
            <span className="bio-photo-tag">RES_01 · LIVE FROM CABINA</span>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="bio-text">
            <p>
              {data.body1.split(/(narrativas)/).map((part, i) =>
                part === 'narrativas' ? <em key={i}>narrativas</em> : part
              )}
            </p>
            <p>{data.body2}</p>
            <p style={{
              fontFamily: 'var(--f-serif)', fontStyle: 'italic', fontSize: 28,
              color: 'var(--accent)', lineHeight: 1.3,
              paddingLeft: 24, borderLeft: '1px solid var(--accent)'
            }}>
              &ldquo;{data.quote}&rdquo;
            </p>
            <div className="bio-stats">
              {data.stats.map((s, i) => (
                <div className="bio-stat" key={i}>
                  <div className="num">{s.num}</div>
                  <div className="label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
