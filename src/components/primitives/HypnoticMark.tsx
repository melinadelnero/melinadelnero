'use client'

import { useState, useEffect } from 'react'

export default function HypnoticMark() {
  const [t, setT] = useState(0)

  useEffect(() => {
    let raf: number
    const start = performance.now()
    const tick = () => {
      setT((performance.now() - start) / 1000)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const rings = []
  for (let i = 0; i < 14; i++) {
    const phase = t * 0.6 + i * 0.18
    const r = 30 + i * 12 + Math.sin(phase) * 4 + Math.sin(phase * 1.7) * 2
    const opacity = 0.6 - i * 0.035
    rings.push(
      <circle key={i} cx="0" cy="0" r={r} className={i === 3 ? 'ring accent' : 'ring'} style={{ opacity }} />
    )
  }

  const points: string[] = []
  const N = 220
  const baseR = 120
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2
    const wave =
      Math.sin(a * 6 + t * 1.4) * 8 +
      Math.sin(a * 11 - t * 0.9) * 6 +
      Math.sin(a * 3 + t * 0.6) * 4
    const r = baseR + wave
    const x = Math.cos(a) * r
    const y = Math.sin(a) * r
    points.push(`${x.toFixed(1)},${y.toFixed(1)}`)
  }

  return (
    <div className="hero-mark">
      <svg viewBox="-260 -260 520 520">
        {rings}
        <polygon points={points.join(' ')} fill="none" stroke="var(--accent)" strokeWidth="0.6" opacity="0.7" />
        <line x1="-240" y1="0" x2="240" y2="0" className="horizon" />
        <circle cx="0" cy="0" r="3" fill="var(--accent)" />
      </svg>
    </div>
  )
}
