'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import EventsPanel from '@/components/admin/EventsPanel'
import SetsPanel from '@/components/admin/SetsPanel'
import BioPanel from '@/components/admin/BioPanel'
import ContactPanel from '@/components/admin/ContactPanel'
import GalleryPanel from '@/components/admin/GalleryPanel'
import MarqueesPanel from '@/components/admin/MarqueesPanel'

type Section = 'dashboard' | 'events' | 'sets' | 'gallery' | 'bio' | 'contact' | 'marquees'

export default function AdminPage() {
  const router = useRouter()
  const [section, setSection] = useState<Section>('dashboard')

  const logout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="admin-wrap" style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <div className="admin">
        <aside className="admin-side">
          <div className="brand">MELINA <em>delnero</em></div>
          <div className="tag">Panel de admin</div>

          <nav className="admin-nav">
            {(['dashboard', 'events', 'sets', 'gallery', 'bio', 'contact', 'marquees'] as Section[]).map((s) => (
              <button
                key={s}
                className={section === s ? 'active' : ''}
                onClick={() => setSection(s)}
              >
                {s === 'dashboard' && '→ Dashboard'}
                {s === 'events' && '→ Eventos'}
                {s === 'sets' && '→ Sets'}
                {s === 'gallery' && '→ Galería'}
                {s === 'bio' && '→ Bio'}
                {s === 'contact' && '→ Contacto'}
                {s === 'marquees' && '→ Marquees'}
              </button>
            ))}
          </nav>

          <button className="admin-logout" onClick={logout}>
            Cerrar sesión
          </button>
        </aside>

        <main className="admin-main">
          {section === 'dashboard' && <Dashboard />}
          {section === 'events' && <EventsPanel />}
          {section === 'sets' && <SetsPanel />}
          {section === 'gallery' && <GalleryPanel />}
          {section === 'bio' && <BioPanel />}
          {section === 'contact' && <ContactPanel />}
          {section === 'marquees' && <MarqueesPanel />}
        </main>
      </div>
    </div>
  )
}

function Dashboard() {
  return (
    <>
      <div className="admin-head">
        <h2>Dashboard <em>admin</em></h2>
        <div className="meta">MELINA DELNERO · PANEL V1</div>
      </div>
      <div className="stat-grid">
        <div className="stat-card">
          <div className="num">5</div>
          <div className="label">Próximos eventos</div>
        </div>
        <div className="stat-card">
          <div className="num">6</div>
          <div className="label">Sets publicados</div>
        </div>
        <div className="stat-card">
          <div className="num">8</div>
          <div className="label">Fotos en galería</div>
        </div>
        <div className="stat-card">
          <div className="num"><em>✓</em></div>
          <div className="label">Sitio activo</div>
        </div>
      </div>
      <div className="admin-section">
        <div className="admin-section-head">
          <h3>Estado del sistema</h3>
        </div>
        <p style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--ink-dim)', letterSpacing: '0.1em', lineHeight: 1.8 }}>
          BASE DE DATOS · Supabase · conectada<br />
          STORAGE · Supabase Storage · bucket gallery<br />
          DEPLOY · Vercel · rama main<br />
          AUTH · Supabase Auth · email/password
        </p>
      </div>
    </>
  )
}
