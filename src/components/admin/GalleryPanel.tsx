'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { GalleryItem, GallerySize } from '@/lib/types'
import AdminDialog, { useAdminDialog } from './AdminDialog'

const SIZES: GallerySize[] = ['lg', 'tall', 'wide', 'sq', 'row', 'hero']
const EMPTY = { size: 'sq' as GallerySize, tag: '' }

export default function GalleryPanel() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [form, setForm] = useState(EMPTY)
  const [editing, setEditing] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [modal, setModal] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const { cfg, showAlert, showConfirm, close: closeDialog } = useAdminDialog()

  const supabase = createClient()
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!

  const load = async () => {
    const { data } = await supabase.from('gallery').select('*').order('created_at')
    if (data) setItems(data)
  }

  useEffect(() => { load() }, [])

  const imgUrl = (path: string | null) =>
    path ? `${SUPABASE_URL}/storage/v1/object/public/gallery/${path}` : null

  const openNew = () => { setForm(EMPTY); setFile(null); setEditing(null); setModal(true) }
  const openEdit = (item: GalleryItem) => {
    setForm({ size: item.size, tag: item.tag ?? '' })
    setFile(null)
    setEditing(item.id)
    setModal(true)
  }
  const close = () => { setModal(false); setEditing(null); setForm(EMPTY); setFile(null) }

  const save = async () => {
    setUploading(true)
    let storage_path: string | null = null

    if (file) {
      const ext = file.name.split('.').pop()
      const path = `${Date.now()}.${ext}`
      const { error } = await supabase.storage.from('gallery').upload(path, file, { upsert: false })
      if (error) { showAlert(`Error al subir imagen: ${error.message}`); setUploading(false); return }
      storage_path = path
    }

    if (editing) {
      const payload: Partial<GalleryItem> = { size: form.size, tag: form.tag || null }
      if (storage_path) payload.storage_path = storage_path
      await supabase.from('gallery').update(payload).eq('id', editing)
    } else {
      await supabase.from('gallery').insert({ size: form.size, tag: form.tag || null, storage_path })
    }

    setUploading(false)
    close()
    load()
  }

  const del = (item: GalleryItem) => {
    showConfirm('¿Eliminar esta foto? Se borrará también el archivo de Storage.', async () => {
      if (item.storage_path) {
        await supabase.storage.from('gallery').remove([item.storage_path])
      }
      await supabase.from('gallery').delete().eq('id', item.id)
      load()
    })
  }

  return (
    <>
      <div className="admin-head">
        <h2>Galería <em>panel</em></h2>
        <button className="btn-add" onClick={openNew}>+ Nueva foto</button>
      </div>

      <div className="admin-section">
        <div className="admin-section-head">
          <h3>Fotos ({items.length})</h3>
        </div>
        {items.length === 0 && <p className="kicker">SIN FOTOS — agregá la primera</p>}
        <table className="table">
          <thead>
            <tr>
              <th></th>
              <th>Tag</th>
              <th>Tamaño</th>
              <th>Archivo</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => {
              const url = imgUrl(item.storage_path)
              return (
                <tr key={item.id}>
                  <td>
                    {url
                      ? <img src={url} alt={item.tag ?? ''} className="thumb-mini" />
                      : <div className="thumb-mini" style={{ background: 'var(--bg-elev-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontFamily: 'var(--f-mono)', color: 'var(--ink-faint)' }}>SIN IMG</div>
                    }
                  </td>
                  <td className="name-cell">{item.tag ?? '—'}</td>
                  <td><span className="tag-pill">{item.size}</span></td>
                  <td style={{ fontFamily: 'var(--f-mono)', fontSize: 10, color: 'var(--ink-dim)' }}>{item.storage_path ?? '—'}</td>
                  <td>
                    <div className="row-actions">
                      <button className="icon-btn" onClick={() => openEdit(item)}>Editar</button>
                      <button className="icon-btn" onClick={() => del(item)}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <AdminDialog {...cfg} onClose={closeDialog} />

      {modal && (
        <div className="modal-back" onClick={e => { if (e.target === e.currentTarget) close() }}>
          <div className="modal">
            <h3>{editing ? 'Editar' : 'Nueva'} <em>foto</em></h3>
            <p className="sub">
              {editing ? 'Cambiá el tag, tamaño o reemplazá la imagen' : 'Subí una imagen y configurá su posición en la grilla'}
            </p>
            <div className="form-grid">
              <div className="field">
                <label>Tamaño en grilla</label>
                <select value={form.size} onChange={e => setForm(f => ({ ...f, size: e.target.value as GallerySize }))}>
                  {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Tag / descripción</label>
                <input type="text" placeholder="ej. Crobar · 2026" value={form.tag} onChange={e => setForm(f => ({ ...f, tag: e.target.value }))} />
              </div>
              <div className="field" style={{ gridColumn: '1 / -1' }}>
                <label>{editing ? 'Reemplazar imagen (opcional)' : 'Imagen *'}</label>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  style={{ fontFamily: 'var(--f-mono)', fontSize: 12 }}
                  onChange={e => setFile(e.target.files?.[0] ?? null)}
                />
              </div>
            </div>
            {file && (
              <img src={URL.createObjectURL(file)} alt="preview" style={{ width: '100%', marginTop: 16, opacity: 0.8 }} />
            )}
            <div className="modal-actions">
              <button className="btn-danger" onClick={close}>Cancelar</button>
              <button
                className="btn-add"
                onClick={save}
                disabled={uploading || (!editing && !file)}
              >
                {uploading ? 'Subiendo...' : editing ? 'Guardar cambios' : 'Agregar foto'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
