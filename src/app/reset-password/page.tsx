'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
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
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                  minLength={8}
                />
              </div>
              <div className="field">
                <label>Repetir contraseña</label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  autoComplete="new-password"
                  required
                />
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
