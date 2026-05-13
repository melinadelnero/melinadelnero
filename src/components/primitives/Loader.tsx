'use client'

import { useState, useEffect } from 'react'

export default function Loader({ onDone }: { onDone?: () => void }) {
  const [gone, setGone] = useState(false)
  const [pct, setPct] = useState(0)

  useEffect(() => {
    let cancelled = false
    const start = performance.now()
    const dur = 1600

    const tick = () => {
      if (cancelled) return
      const e = Math.min(1, (performance.now() - start) / dur)
      setPct(Math.floor(e * 100))
      if (e < 1) {
        requestAnimationFrame(tick)
      } else {
        setTimeout(() => {
          setGone(true)
          onDone?.()
        }, 350)
      }
    }
    requestAnimationFrame(tick)
    return () => { cancelled = true }
  }, [onDone])

  return (
    <div className={`loader${gone ? ' gone' : ''}`}>
      <div className="loader-mark">
        <span className="ring" />
        <span className="ring" />
        <span className="ring" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <div style={{ fontFamily: 'var(--f-display)', fontSize: 24, letterSpacing: '-0.02em', fontWeight: 500 }}>
          MELINA <em style={{ fontFamily: 'var(--f-serif)', fontStyle: 'italic', color: 'var(--accent)', fontWeight: 400 }}>delnero</em>
        </div>
        <div className="loader-count">CARGANDO · {String(pct).padStart(3, '0')}%</div>
      </div>
    </div>
  )
}
