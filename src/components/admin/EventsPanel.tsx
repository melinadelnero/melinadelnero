'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Event, EventStatus } from '@/lib/types'
import AdminDialog, { useAdminDialog } from './AdminDialog'

const EMPTY = { date: '', time: '', name: '', venue: '', city: '', status: 'tickets' as EventStatus, url: '' }

export default function EventsPanel() {
  const [events, setEvents] = useState<Event[]>([])
  const [form, setForm] = useState(EMPTY)
  const [editing, setEditing] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [modal, setModal] = useState(false)
  const { cfg, showConfirm, close: closeDialog } = useAdminDialog()

  const supabase = createClient()

  const load = async () => {
    const { data } = await supabase.from('events').select('*').order('date')
    if (data) setEvents(data)
  }

  useEffect(() => { load() }, [])

  const openNew = () => { setForm(EMPTY); setEditing(null); setModal(true) }
  const openEdit = (e: Event) => {
    setForm({ date: e.date, time: e.time ?? '', name: e.name, venue: e.venue ?? '', city: e.city ?? '', status: e.status, url: e.url ?? '' })
    setEditing(e.id)
    setModal(true)
  }
  const close = () => { setModal(false); setEditing(null); setForm(EMPTY) }

  const save = async () => {
    if (!form.date || !form.name) return
    setLoading(true)
    const payload = {
      date: form.date,
      time: form.time || null,
      name: form.name,
      venue: form.venue || null,
      city: form.city || null,
      status: form.status,
      url: form.url || null,
    }
    if (editing) {
      await supabase.from('events').update(payload).eq('id', editing)
    } else {
      await supabase.from('events').insert(payload)
    }
    setLoading(false)
    close()
    load()
  }

  const del = (id: string) => {
    showConfirm('¿Eliminar este evento? Esta acción no se puede deshacer.', async () => {
      await supabase.from('events').delete().eq('id', id)
      load()
    })
  }

  const statusLabel = (s: EventStatus) => ({ tickets: 'Tickets', free: 'Free', soldout: 'Sold Out' })[s]

  return (
    <>
      <div className="admin-head">
        <h2>Eventos <em>panel</em></h2>
        <button className="btn-add" onClick={openNew}>+ Nuevo evento</button>
      </div>

      <div className="admin-section">
        <div className="admin-section-head">
          <h3>Eventos ({events.length})</h3>
        </div>
        {events.length === 0 && (
          <p className="kicker">SIN EVENTOS — agregá el primero</p>
        )}
        <table className="table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Evento</th>
              <th>Venue · Ciudad</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {events.map(e => (
              <tr key={e.id}>
                <td className="name-cell">{e.date}{e.time ? ` ${e.time}` : ''}</td>
                <td>{e.name}</td>
                <td>{[e.venue, e.city].filter(Boolean).join(' · ') || '—'}</td>
                <td><span className={`tag-pill ${e.status}`}>{statusLabel(e.status)}</span></td>
                <td>
                  <div className="row-actions">
                    <button className="icon-btn" onClick={() => openEdit(e)}>Editar</button>
                    <button className="icon-btn" onClick={() => del(e.id)}>Eliminar</button>
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
            <h3>{editing ? 'Editar' : 'Nuevo'} <em>evento</em></h3>
            <p className="sub">{editing ? 'Modificá los datos y guardá' : 'Completá los datos del evento'}</p>
            <div className="form-grid">
              <div className="field">
                <label>Fecha *</label>
                <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
              </div>
              <div className="field">
                <label>Hora</label>
                <input type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
              </div>
              <div className="field" style={{ gridColumn: '1 / -1' }}>
                <label>Nombre *</label>
                <input type="text" placeholder="ej. Resonancia" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="field">
                <label>Venue</label>
                <input type="text" placeholder="ej. Crobar" value={form.venue} onChange={e => setForm(f => ({ ...f, venue: e.target.value }))} />
              </div>
              <div className="field">
                <label>Ciudad</label>
                <input type="text" placeholder="ej. Buenos Aires" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
              </div>
              <div className="field">
                <label>Estado</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as EventStatus }))}>
                  <option value="tickets">Tickets</option>
                  <option value="free">Free</option>
                  <option value="soldout">Sold Out</option>
                </select>
              </div>
              <div className="field">
                <label>URL de tickets</label>
                <input type="url" placeholder="https://..." value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} />
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn-danger" onClick={close}>Cancelar</button>
              <button className="btn-add" onClick={save} disabled={!form.date || !form.name || loading}>
                {loading ? 'Guardando...' : editing ? 'Guardar cambios' : 'Agregar evento'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
