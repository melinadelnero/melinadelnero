'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { MarqueeSet } from '@/lib/types'
import { SEED_MARQUEES } from '@/lib/seed'

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

  const BandEditor = ({ band, label }: { band: 'hero' | 'events', label: string }) => (
    <div className="admin-section">
      <div className="admin-section-head">
        <h3>{label}</h3>
        <button className="btn-add" onClick={() => addItem(band)}>+ Agregar ítem</button>
      </div>
      <p style={{ fontFamily: 'var(--f-mono)', fontSize: 10, color: 'var(--ink-dim)', letterSpacing: '0.12em', marginBottom: 16 }}>
        USAR /em/ PARA TEXTO EN CURSIVA ROJA — ej: CABINA /em/ritual
      </p>
      {form[band].map((item, i) => (
        <div key={i} className="field" style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <input
            type="text"
            value={item}
            onChange={e => updateItem(band, i, e.target.value)}
            style={{ flex: 1 }}
            placeholder="ej. BSAS — AR"
          />
          <button className="icon-btn" onClick={() => removeItem(band, i)}>✕</button>
        </div>
      ))}
    </div>
  )

  return (
    <>
      <div className="admin-head">
        <h2>Marquees <em>panel</em></h2>
        <button className="btn-add" onClick={save} disabled={loading}>
          {loading ? 'Guardando...' : saved ? '✓ Guardado' : 'Guardar marquees'}
        </button>
      </div>
      <BandEditor band="hero" label="Banda 1 — debajo del hero" />
      <BandEditor band="events" label="Banda 2 — debajo de eventos" />
    </>
  )
}
