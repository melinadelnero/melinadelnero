'use client'

export default function PortraitImg() {
  return (
    <img
      src="/melina-portrait.jpg"
      alt="Melina Delnero"
      onError={e => {
        const el = e.target as HTMLImageElement
        el.style.display = 'none'
        el.parentElement!.style.background = 'var(--bg-elev)'
      }}
    />
  )
}
