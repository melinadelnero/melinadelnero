'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Bio, BioStat } from '@/lib/types'
import { SEED_BIO } from '@/lib/seed'

export default function BioPanel() {
  const [form, setForm] = useState<Bio>(SEED_BIO)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [portraitFile, setPortraitFile] = useState<File | null>(null)
  const [portraitPreview, setPortraitPreview] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const supabase = createClient()
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!

  useEffect(() => {
    supabase.from('site_content').select('bio').eq('id', 1).single().then(({ data }) => {
      if (data?.bio) setForm(data.bio as Bio)
    })
  }, [])

  const currentPortraitUrl = form.portrait_path
    ? `${SUPABASE_URL}/storage/v1/object/public/gallery/${form.portrait_path}`
    : null

  const handleFile = (f: File) => {
    setPortraitFile(f)
    setPortraitPreview(URL.createObjectURL(f))
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files[0]
    if (f && f.type.startsWith('image/')) handleFile(f)
  }

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
    let updatedForm = { ...form }

    if (portraitFile) {
      setUploading(true)
      const ext = portraitFile.name.split('.').pop()
      const newPath = `portrait_${Date.now()}.${ext}`

      if (form.portrait_path) {
        await supabase.storage.from('gallery').remove([form.portrait_path])
      }

      const { error } = await supabase.storage
        .from('gallery')
        .upload(newPath, portraitFile, { upsert: false })

      if (error) {
        alert(`Error al subir imagen: ${error.message}`)
        setLoading(false)
        setUploading(false)
        return
      }

      updatedForm = { ...updatedForm, portrait_path: newPath }
      setForm(updatedForm)
      setPortraitFile(null)
      setUploading(false)
    }

    const { data } = await supabase.from('site_content').select('id').eq('id', 1).single()
    if (data) {
      await supabase.from('site_content').update({ bio: updatedForm }).eq('id', 1)
    } else {
      await supabase.from('site_content').insert({ id: 1, bio: updatedForm, contact: {} })
    }

    setLoading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const dropZoneStyle: React.CSSProperties = {
    border: `1.5px dashed ${dragOver ? 'var(--accent)' : 'var(--border)'}`,
    borderRadius: 4,
    padding: 0,
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    background: dragOver ? 'rgba(var(--accent-rgb, 180,0,0), 0.04)' : 'var(--bg-elev)',
    transition: 'border-color 0.15s, background 0.15s',
    overflow: 'hidden',
    minHeight: 180,
    position: 'relative',
  }

  const displaySrc = portraitPreview || currentPortraitUrl

  return (
    <>
      <div className="admin-head">
        <h2>Bio <em>panel</em></h2>
        <button className="btn-add" onClick={save} disabled={loading || uploading}>
          {uploading ? 'Subiendo...' : loading ? 'Guardando...' : saved ? '✓ Guardado' : 'Guardar bio'}
        </button>
      </div>

      <div className="admin-section">
        <div className="admin-section-head"><h3>Foto de perfil</h3></div>
        <p style={{ fontFamily: 'var(--f-mono)', fontSize: 10, color: 'var(--ink-dim)', letterSpacing: '0.12em', marginBottom: 16 }}>
          ARRASTRÁ UNA IMAGEN O HACÉ CLIC — SE REEMPLAZA LA ANTERIOR AUTOMÁTICAMENTE
        </p>
        <div
          style={dropZoneStyle}
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
        >
          {displaySrc ? (
            <>
              <img
                src={displaySrc}
                alt="Retrato actual"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              <div style={{
                position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
                justifyContent: 'center', background: 'rgba(0,0,0,0.45)',
                opacity: 0, transition: 'opacity 0.15s',
              }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '0')}
              >
                <span style={{ fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.15em', color: '#fff' }}>
                  CAMBIAR FOTO
                </span>
              </div>
            </>
          ) : (
            <span style={{ fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.12em', color: 'var(--ink-faint)' }}>
              ARRASTRÁ O HACÉ CLIC
            </span>
          )}
        </div>
        {portraitFile && (
          <p style={{ fontFamily: 'var(--f-mono)', fontSize: 10, color: 'var(--ink-dim)', letterSpacing: '0.1em', marginTop: 8 }}>
            {portraitFile.name} — se subirá al guardar
          </p>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
        />
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
