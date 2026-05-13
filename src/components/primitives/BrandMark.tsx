interface BrandMarkProps {
  size?: number
  amplitude?: number
  accent?: boolean
}

export default function BrandMark({ size = 32, amplitude = 0.5, accent = false }: BrandMarkProps) {
  const stroke = accent ? 'var(--accent)' : 'currentColor'
  const r1 = 30 + amplitude * 6
  const r2 = 18 + amplitude * 4
  return (
    <svg viewBox="-40 -40 80 80" width={size} height={size} style={{ overflow: 'visible' }}>
      <circle cx="0" cy="0" r={r1} fill="none" stroke={stroke} strokeWidth="1.2" />
      <circle cx="0" cy="0" r={r2} fill="none" stroke={stroke} strokeWidth="1.2" />
      <line x1="-38" y1="0" x2="38" y2="0" stroke={stroke} strokeWidth="1.2" />
    </svg>
  )
}
