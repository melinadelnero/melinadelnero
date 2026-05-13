'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { MarqueeSet, HeroTexts } from '@/lib/types'
import { SEED_MARQUEES, SEED_HERO_TEXTS } from '@/lib/seed'

type BandEditorProps = {
  band: 'hero' | 'events'
  label: string
  items: string[]
  onUpdate: (i: number, value: string) => void
  onAdd: () => void
  onRemove: (i: number) => void
}

function BandEditor({ band, label, items, onUpdate, onAdd, onRemove }: BandEditorProps) {
  return (
    <div className="admin-section">
      <div className="admin-section-head">
        <h3>{label}</h3>
        <button className="btn-add" onClick={onAdd}>+ Agregar ítem</button>
      </div>
      <p style={{ fontFamily: 'var(--f-mono)', fontSize: 10, color: 'var(--ink-dim)', letterSpacing: '0.12em', marginBottom: 16 }}>
        USAR /em/ PARA TEXTO EN CURSIVA ROJA — ej: CABINA /em/ritual
      </p>
      {items.map((item, i) => (
        <div key={i} className="field" style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <input
            type="text"
            value={item}
            onChange={e => onUpdate(i, e.target.value)}
            style={{ flex: 1 }}
            placeholder="ej. BSAS — AR"
          />
          <button className="icon-btn" onClick={() => onRemove(i)}>✕</button>
        </div>
      ))}
    </div>
  )
}

export default function MarqueesPanel() {
  const [form, setForm] = useState<MarqueeSet>(SEED_MARQUEES)
  const [hero, setHero] = useState<HeroTexts>(SEED_HERO_TEXTS)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    supabase.from('site_content').select('marquees, hero').eq('id', 1).single().then(({ data }) => {
      if (data?.marquees) setForm(data.marquees as MarqueeSet)
      if (data?.hero) setHero(data.hero as HeroTexts)
    })
  }, [])

  const updateItem = (band: 'hero' | 'events', i: number, value: string) =>
    setForm(f => ({ ...f, [band]: f[band].map((v, j) => j === i ? value : v) }))

  const addItem = (band: 'hero' | 'events') =>
    setForm(f => ({ ...f, [band]: [...f[band], ''] }))

  const removeItem = (band: 'hero' | 'events', i: number) =>
    setForm(f => ({ ...f, [band]: f[band].filter((_, j) => j !== i) }))

  const save = async () => {
    setLoading(true)
    const { data } = await supabase.from('site_content').select('id').eq('id', 1).single()
    if (data) {
      await supabase.from('site_content').update({ marquees: form, hero }).eq('id', 1)
    } else {
      await supabase.from('site_content').insert({ id: 1, bio: {}, contact: {}, marquees: form, hero })
    }
    setLoading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <>
      <div className="admin-head">
        <h2>Textos <em>panel</em></h2>
        <button className="btn-add" onClick={save} disabled={loading}>
          {loading ? 'Guardando...' : saved ? '✓ Guardado' : 'Guardar todo'}
        </button>
      </div>

      <div className="admin-section">
        <div className="admin-section-head"><h3>Hero — pie de pantalla</h3></div>
        <div className="form-grid">
          <div className="field">
            <label>Año (ej. EST. 2022)</label>
            <input type="text" value={hero.est} onChange={e => setHero(h => ({ ...h, est: e.target.value }))} />
          </div>
          <div className="field">
            <label>Volumen (ej. VOL. 08)</label>
            <input type="text" value={hero.vol} onChange={e => setHero(h => ({ ...h, vol: e.target.value }))} />
          </div>
          <div className="field">
            <label>Tagline derecha (ej. CABINA ✦ RITUAL)</label>
            <input type="text" value={hero.tagline} onChange={e => setHero(h => ({ ...h, tagline: e.target.value }))} />
          </div>
          <div className="field">
            <label>Label de scroll (ej. Desliza)</label>
            <input type="text" value={hero.scroll_label} onChange={e => setHero(h => ({ ...h, scroll_label: e.target.value }))} />
          </div>
        </div>
      </div>

      <BandEditor
        band="hero"
        label="Banda 1 — debajo del hero"
        items={form.hero}
        onUpdate={(i, v) => updateItem('hero', i, v)}
        onAdd={() => addItem('hero')}
        onRemove={i => removeItem('hero', i)}
      />
      <BandEditor
        band="events"
        label="Banda 2 — debajo de eventos"
        items={form.events}
        onUpdate={(i, v) => updateItem('events', i, v)}
        onAdd={() => addItem('events')}
        onRemove={i => removeItem('events', i)}
      />
    </>
  )
}
