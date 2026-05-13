'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  )
}

const eyeBtnStyle: React.CSSProperties = {
  position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
  background: 'none', border: 'none', cursor: 'pointer',
  color: 'var(--ink-faint)', padding: 4, display: 'flex', alignItems: 'center',
}

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Supabase intercepts the #access_token hash from the reset email
    // and establishes a session automatically. We just wait for it.
    const supabase = createClient()
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setReady(true)
      }
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.')
      return
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({ password })

    setLoading(false)
    if (updateError) {
      setError('No se pudo actualizar la contraseña. El link puede haber expirado.')
    } else {
      router.push('/admin')
    }
  }

  return (
    <div className="admin-wrap" style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <div className="admin-login">
        <div className="admin-login-card">
          <div className="seal">
            <span className="dot" />
            ACCESO RESTRINGIDO
          </div>
          <h1>
            MELINA <em>delnero</em>
          </h1>
          <div className="sub">Nueva contraseña</div>

          {!ready ? (
            <p style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--ink-dim)', letterSpacing: '0.08em', lineHeight: 1.7, marginTop: 32 }}>
              Verificando el link... si esta página no carga, el link puede haber expirado. <br /><br />
              <a href="/login" style={{ color: 'var(--accent)' }}>Volver al login</a>
            </p>
          ) : (
            <form onSubmit={handleSubmit}>
              <p style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--ink-dim)', letterSpacing: '0.08em', lineHeight: 1.7, marginBottom: 24 }}>
                Elegí una nueva contraseña para tu cuenta.
              </p>
              <div className="field">
                <label>Nueva contraseña</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                    minLength={8}
                    style={{ width: '100%', paddingRight: 44 }}
                  />
                  <button type="button" onClick={() => setShowPassword(v => !v)} style={eyeBtnStyle} aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}>
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
              </div>
              <div className="field">
                <label>Repetir contraseña</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    autoComplete="new-password"
                    required
                    style={{ width: '100%', paddingRight: 44 }}
                  />
                </div>
              </div>
              {error && <div className="admin-error">{error}</div>}
              <button
                type="submit"
                className="btn"
                disabled={loading}
                style={{ cursor: loading ? 'wait' : 'pointer', marginTop: 32 }}
              >
                {loading ? 'Guardando...' : 'Guardar contraseña →'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
