interface MarqueeProps {
  items: string[]
  separator?: string
}

export default function Marquee({ items, separator = '✦' }: MarqueeProps) {
  const set = items.map((it, i) => {
    if (it.includes('/em/')) {
      const [before, after] = it.split('/em/')
      return (
        <span key={i}>
          {before}<em>{after}</em>
          <span className="star" style={{ marginLeft: 48 }}>{separator}</span>
        </span>
      )
    }
    return (
      <span key={i}>
        {it}
        <span className="star" style={{ marginLeft: 48 }}>{separator}</span>
      </span>
    )
  })

  return (
    <div className="marquee">
      <div className="marquee-track">
        {set}{set}
      </div>
    </div>
  )
}
