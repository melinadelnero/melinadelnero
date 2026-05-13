'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { ContactData } from '@/lib/types'
import { SEED_CONTACT } from '@/lib/seed'

export default function ContactPanel() {
  const [form, setForm] = useState<ContactData>(SEED_CONTACT)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    supabase.from('site_content').select('contact').eq('id', 1).single().then(({ data }) => {
      if (data?.contact) setForm(data.contact as ContactData)
    })
  }, [])

  const set = (field: keyof ContactData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }))

  const save = async () => {
    setLoading(true)
    const { data } = await supabase.from('site_content').select('id').eq('id', 1).single()
    if (data) {
      await supabase.from('site_content').update({ contact: form }).eq('id', 1)
    } else {
      await supabase.from('site_content').insert({ id: 1, bio: {}, contact: form })
    }
    setLoading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <>
      <div className="admin-head">
        <h2>Contacto <em>panel</em></h2>
        <button className="btn-add" onClick={save} disabled={loading}>
          {loading ? 'Guardando...' : saved ? '✓ Guardado' : 'Guardar contacto'}
        </button>
      </div>

      <div className="admin-section">
        <div className="admin-section-head"><h3>Links y datos</h3></div>
        <div className="form-grid">
          <div className="field">
            <label>Email booking</label>
            <input type="email" placeholder="booking@..." value={form.booking} onChange={set('booking')} />
          </div>
          <div className="field">
            <label>Email prensa</label>
            <input type="email" placeholder="press@..." value={form.press} onChange={set('press')} />
          </div>
          <div className="field">
            <label>Instagram</label>
            <input type="text" placeholder="@usuario" value={form.instagram} onChange={set('instagram')} />
          </div>
          <div className="field">
            <label>SoundCloud</label>
            <input type="text" placeholder="soundcloud.com/..." value={form.soundcloud} onChange={set('soundcloud')} />
          </div>
          <div className="field">
            <label>Basada en</label>
            <input type="text" placeholder="ej. Buenos Aires — AR" value={form.based} onChange={set('based')} />
          </div>
          <div className="field">
            <label>Agencia</label>
            <input type="text" placeholder="ej. Subsuelo Bookings" value={form.agency} onChange={set('agency')} />
          </div>
        </div>
      </div>
    </>
  )
}
