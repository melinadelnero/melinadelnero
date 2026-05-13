'use client'

import { useState } from 'react'
import Reveal from '@/components/primitives/Reveal'
import SectionHead from '@/components/primitives/SectionHead'
import type { Set } from '@/lib/types'

function SetCard({ set }: { set: Set }) {
  const [playing, setPlaying] = useState(false)
  const thumb = `https://img.youtube.com/vi/${set.youtube_id}/hqdefault.jpg`

  return (
    <div className="set-card">
      <div className="set-thumb">
        {!playing ? (
          <>
            <img src={thumb} alt={set.title} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
            <span className="set-duration">{set.duration}</span>
            <button className="set-play" onClick={() => setPlaying(true)} aria-label="Play">▶</button>
          </>
        ) : (
          <iframe
            src={`https://www.youtube.com/embed/${set.youtube_id}?autoplay=1&rel=0`}
            allow="autoplay; encrypted-media"
            allowFullScreen
            title={set.title}
          />
        )}
      </div>
      <div className="set-info">
        <div className="set-title">{set.title}</div>
        <div className="set-meta">
          <span className="genre">{set.genre}</span>
          <span>{set.date}</span>
        </div>
      </div>
    </div>
  )
}

export default function Sets({ sets }: { sets: Set[] }) {
  return (
    <section className="section" id="sets" data-screen-label="03 Sets">
      <SectionHead idx="03" title="SETS · MIXES" code={`/ ${sets.length} TRACKS`} />
      <h2 className="section-title">Sets en <em>YouTube</em></h2>
      <div className="sets-grid">
        {sets.map((s, i) => (
          <Reveal key={s.id} delay={i * 0.04}>
            <SetCard set={s} />
          </Reveal>
        ))}
      </div>
    </section>
  )
}
