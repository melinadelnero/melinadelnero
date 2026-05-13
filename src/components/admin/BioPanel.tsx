'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Bio, BioStat } from '@/lib/types'
import { SEED_BIO } from '@/lib/seed'

export default function BioPanel() {
  const [form, setForm] = useState<Bio>(SEED_BIO)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    supabase.from('site_content').select('bio').eq('id', 1).single().then(({ data }) => {
      if (data?.bio) setForm(data.bio as Bio)
    })
  }, [])

  const setStat = (i: number, field: keyof BioStat, value: string) => {
    setForm(f => {
      const stats = [...f.stats]
      stats[i] = { ...stats[i], [field]: value }
      return { ...f, stats }
    })
  }

  const addStat = () => setForm(f => ({ ...f, stats: [...f.stats, { num: '', label: '' }] }))
  const removeStat = (i: number) => setForm(f => ({ ...f, stats: f.stats.filter((_, j) => j !== i) }))

  const save = async () => {
    setLoading(true)
    const { data } = await supabase.from('site_content').select('id').eq('id', 1).single()
    if (data) {
      await supabase.from('site_content').update({ bio: form }).eq('id', 1)
    } else {
      await supabase.from('site_content').insert({ id: 1, bio: form, contact: {} })
    }
    setLoading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <>
      <div className="admin-head">
        <h2>Bio <em>panel</em></h2>
        <button className="btn-add" onClick={save} disabled={loading}>
          {loading ? 'Guardando...' : saved ? '✓ Guardado' : 'Guardar bio'}
        </button>
      </div>

      <div className="admin-section">
        <div className="admin-section-head"><h3>Textos</h3></div>
        <div className="field">
          <label>Párrafo 1</label>
          <textarea rows={3} value={form.body1} onChange={e => setForm(f => ({ ...f, body1: e.target.value }))} />
        </div>
        <div className="field">
          <label>Párrafo 2</label>
          <textarea rows={3} value={form.body2} onChange={e => setForm(f => ({ ...f, body2: e.target.value }))} />
        </div>
        <div className="field">
          <label>Cita destacada</label>
          <input type="text" value={form.quote} onChange={e => setForm(f => ({ ...f, quote: e.target.value }))} />
        </div>
      </div>

      <div className="admin-section">
        <div className="admin-section-head">
          <h3>Stats ({form.stats.length})</h3>
          <button className="btn-add" onClick={addStat}>+ Agregar stat</button>
        </div>
        {form.stats.map((stat, i) => (
          <div key={i} className="form-grid" style={{ alignItems: 'end', marginBottom: 8 }}>
            <div className="field">
              <label>Número</label>
              <input type="text" placeholder="ej. 120+" value={stat.num} onChange={e => setStat(i, 'num', e.target.value)} />
            </div>
            <div className="field" style={{ flex: 1 }}>
              <label>Label</label>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <input type="text" placeholder="ej. Sets · 2025" value={stat.label} onChange={e => setStat(i, 'label', e.target.value)} style={{ flex: 1 }} />
                <button className="icon-btn" onClick={() => removeStat(i)}>✕</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
