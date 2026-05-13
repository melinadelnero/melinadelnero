'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { MarqueeSet } from '@/lib/types'
import { SEED_MARQUEES } from '@/lib/seed'

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
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    supabase.from('site_content').select('marquees').eq('id', 1).single().then(({ data }) => {
      if (data?.marquees) setForm(data.marquees as MarqueeSet)
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
      await supabase.from('site_content').update({ marquees: form }).eq('id', 1)
    } else {
      await supabase.from('site_content').insert({ id: 1, bio: {}, contact: {}, marquees: form })
    }
    setLoading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <>
      <div className="admin-head">
        <h2>Marquees <em>panel</em></h2>
        <button className="btn-add" onClick={save} disabled={loading}>
          {loading ? 'Guardando...' : saved ? '✓ Guardado' : 'Guardar marquees'}
        </button>
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
