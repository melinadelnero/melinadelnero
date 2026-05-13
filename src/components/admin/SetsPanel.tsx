'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Set } from '@/lib/types'
import AdminDialog, { useAdminDialog } from './AdminDialog'

const EMPTY = { title: '', youtube_id: '', duration: '', genre: '', date: '' }

function extractYouTubeId(input: string): string {
  // youtu.be/ID?si=... → ID
  const shortMatch = input.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/)
  if (shortMatch) return shortMatch[1]
  // youtube.com/watch?v=ID&... → ID
  const longMatch = input.match(/[?&]v=([a-zA-Z0-9_-]{11})/)
  if (longMatch) return longMatch[1]
  // already just the ID (strip any trailing ?... params)
  return input.split('?')[0].trim()
}

export default function SetsPanel() {
  const [sets, setSets] = useState<Set[]>([])
  const [form, setForm] = useState(EMPTY)
  const [editing, setEditing] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [modal, setModal] = useState(false)
  const { cfg, showConfirm, close: closeDialog } = useAdminDialog()

  const supabase = createClient()

  const load = async () => {
    const { data } = await supabase.from('sets').select('*').order('created_at', { ascending: false })
    if (data) setSets(data)
  }

  useEffect(() => { load() }, [])

  const openNew = () => { setForm(EMPTY); setEditing(null); setModal(true) }
  const openEdit = (s: Set) => {
    setForm({ title: s.title, youtube_id: s.youtube_id, duration: s.duration ?? '', genre: s.genre ?? '', date: s.date ?? '' })
    setEditing(s.id)
    setModal(true)
  }
  const close = () => { setModal(false); setEditing(null); setForm(EMPTY) }

  const save = async () => {
    if (!form.title || !form.youtube_id) return
    setLoading(true)
    const payload = {
      title: form.title,
      youtube_id: form.youtube_id,
      duration: form.duration || null,
      genre: form.genre || null,
      date: form.date || null,
    }
    if (editing) {
      await supabase.from('sets').update(payload).eq('id', editing)
    } else {
      await supabase.from('sets').insert(payload)
    }
    setLoading(false)
    close()
    load()
  }

  const del = (id: string) => {
    showConfirm('¿Eliminar este set? Esta acción no se puede deshacer.', async () => {
      await supabase.from('sets').delete().eq('id', id)
      load()
    })
  }

  const ytThumb = (id: string) => `https://img.youtube.com/vi/${id}/mqdefault.jpg`

  return (
    <>
      <div className="admin-head">
        <h2>Sets <em>panel</em></h2>
        <button className="btn-add" onClick={openNew}>+ Nuevo set</button>
      </div>

      <div className="admin-section">
        <div className="admin-section-head">
          <h3>Sets ({sets.length})</h3>
        </div>
        {sets.length === 0 && <p className="kicker">SIN SETS — agregá el primero</p>}
        <table className="table">
          <thead>
            <tr>
              <th></th>
              <th>Título</th>
              <th>Género</th>
              <th>Duración</th>
              <th>Fecha</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sets.map(s => (
              <tr key={s.id}>
                <td>
                  <img src={ytThumb(s.youtube_id)} alt={s.title} className="thumb-mini" />
                </td>
                <td className="name-cell">{s.title}</td>
                <td>{s.genre ?? '—'}</td>
                <td>{s.duration ?? '—'}</td>
                <td>{s.date ?? '—'}</td>
                <td>
                  <div className="row-actions">
                    <button className="icon-btn" onClick={() => openEdit(s)}>Editar</button>
                    <button className="icon-btn" onClick={() => del(s.id)}>Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AdminDialog {...cfg} onClose={closeDialog} />

      {modal && (
        <div className="modal-back" onClick={e => { if (e.target === e.currentTarget) close() }}>
          <div className="modal">
            <h3>{editing ? 'Editar' : 'Nuevo'} <em>set</em></h3>
            <p className="sub">El YouTube ID es lo que va después de ?v= en la URL</p>
            <div className="form-grid">
              <div className="field" style={{ gridColumn: '1 / -1' }}>
                <label>Título *</label>
                <input type="text" placeholder="ej. B2B Crobar — Live Set" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
              </div>
              <div className="field" style={{ gridColumn: '1 / -1' }}>
                <label>YouTube ID *</label>
                <input type="text" placeholder="ej. dQw4w9WgXcQ" value={form.youtube_id} onChange={e => setForm(f => ({ ...f, youtube_id: extractYouTubeId(e.target.value) }))} />
              </div>
              <div className="field">
                <label>Género</label>
                <input type="text" placeholder="ej. Melodic Techno" value={form.genre} onChange={e => setForm(f => ({ ...f, genre: e.target.value }))} />
              </div>
              <div className="field">
                <label>Duración</label>
                <input type="text" placeholder="ej. 1:23:45" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} />
              </div>
              <div className="field">
                <label>Fecha</label>
                <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
              </div>
            </div>
            {form.youtube_id && (
              <img src={ytThumb(form.youtube_id)} alt="preview" style={{ width: '100%', marginTop: 16, opacity: 0.8 }} />
            )}
            <div className="modal-actions">
              <button className="btn-danger" onClick={close}>Cancelar</button>
              <button className="btn-add" onClick={save} disabled={!form.title || !form.youtube_id || loading}>
                {loading ? 'Guardando...' : editing ? 'Guardar cambios' : 'Agregar set'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
