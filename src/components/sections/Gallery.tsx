'use client'

import SectionHead from '@/components/primitives/SectionHead'
import type { GalleryItem } from '@/lib/types'

function getPublicUrl(storagePath: string | null): string | null {
  if (!storagePath) return null
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/gallery/${storagePath}`
}

export default function Gallery({ items }: { items: GalleryItem[] }) {
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    const img = e.currentTarget.querySelector<HTMLElement>('img, .placeholder')
    if (img) img.style.transform = `scale(1.06) translate(${px * -10}px, ${py * -10}px)`
  }

  const onMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const img = e.currentTarget.querySelector<HTMLElement>('img, .placeholder')
    if (img) img.style.transform = ''
  }

  return (
    <section className="section" id="gallery" data-screen-label="04 Galería">
      <SectionHead idx="04" title="GALERÍA" code={`/ ${items.length} REGISTROS`} />
      <h2 className="section-title">Registros <em>de cabina</em></h2>
      <div className="gallery">
        {items.map((g) => {
          const src = getPublicUrl(g.storage_path)
          return (
            <div
              key={g.id}
              className="gallery-item"
              data-size={g.size}
              data-tag={g.tag}
              onMouseMove={onMouseMove}
              onMouseLeave={onMouseLeave}
            >
              {src ? (
                <img src={src} alt={g.tag || ''} />
              ) : (
                <div className="placeholder">{g.tag}</div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
