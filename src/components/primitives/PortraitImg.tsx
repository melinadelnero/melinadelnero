'use client'

export default function PortraitImg({ src }: { src?: string | null }) {
  return (
    <img
      src={src || '/melina-portrait.jpg'}
      alt="Melina Delnero"
      onError={e => {
        const el = e.target as HTMLImageElement
        el.style.display = 'none'
        el.parentElement!.style.background = 'var(--bg-elev)'
      }}
    />
  )
}
