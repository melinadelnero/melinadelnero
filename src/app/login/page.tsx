'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError('Credenciales incorrectas.')
      setLoading(false)
    } else {
      router.push('/admin')
    }
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <div className="admin-login">
        <div className="admin-login-card">
          <div className="seal">
            <span className="dot" />
            ACCESO RESTRINGIDO
          </div>
          <h1>
            MELINA <em>delnero</em>
          </h1>
          <div className="sub">Panel de administración</div>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
            <div className="field">
              <label>Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
            {error && <div className="admin-error">{error}</div>}
            <button
              type="submit"
              className="btn"
              disabled={loading}
              style={{ cursor: loading ? 'wait' : 'none', marginTop: 32 }}
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>

          <div style={{ marginTop: 24 }}>
            <a href="/" style={{ fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--ink-faint)' }}>
              ← Volver al sitio
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
