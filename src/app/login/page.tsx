'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Mode = 'login' | 'forgot'

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
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

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setInfo('')

    const supabase = createClient()
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    setLoading(false)
    if (resetError) {
      setError('No se pudo enviar el email. Verificá la dirección.')
    } else {
      setInfo('✓ Email enviado. Revisá tu bandeja de entrada y seguí el link.')
    }
  }

  const switchMode = (m: Mode) => {
    setMode(m)
    setError('')
    setInfo('')
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
          <div className="sub">
            {mode === 'login' ? 'Panel de administración' : 'Recuperar contraseña'}
          </div>

          {mode === 'login' ? (
            <form onSubmit={handleLogin}>
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
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                    style={{ width: '100%', paddingRight: 44 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    style={{
                      position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer',
                      fontFamily: 'var(--f-mono)', fontSize: 9, letterSpacing: '0.1em',
                      color: 'var(--ink-faint)', textTransform: 'uppercase', padding: 0,
                    }}
                  >
                    {showPassword ? 'ocultar' : 'ver'}
                  </button>
                </div>
              </div>
              {error && <div className="admin-error">{error}</div>}
              <button
                type="submit"
                className="btn"
                disabled={loading}
                style={{ cursor: loading ? 'wait' : 'pointer', marginTop: 32 }}
              >
                {loading ? 'Ingresando...' : 'Ingresar →'}
              </button>
              <div style={{ marginTop: 20 }}>
                <button
                  type="button"
                  onClick={() => switchMode('forgot')}
                  style={{ background: 'none', border: 'none', fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-faint)', cursor: 'pointer', padding: 0 }}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleForgot}>
              <p style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--ink-dim)', letterSpacing: '0.08em', lineHeight: 1.7, marginBottom: 24 }}>
                Ingresá tu email y te mandamos un link para crear una nueva contraseña.
              </p>
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
              {error && <div className="admin-error">{error}</div>}
              {info && (
                <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: '#4caf50', letterSpacing: '0.08em', marginTop: 12 }}>
                  {info}
                </div>
              )}
              <button
                type="submit"
                className="btn"
                disabled={loading || !!info}
                style={{ cursor: loading ? 'wait' : 'pointer', marginTop: 32 }}
              >
                {loading ? 'Enviando...' : 'Enviar link'}
              </button>
              <div style={{ marginTop: 20 }}>
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  style={{ background: 'none', border: 'none', fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-faint)', cursor: 'pointer', padding: 0 }}
                >
                  ← Volver al login
                </button>
              </div>
            </form>
          )}

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
