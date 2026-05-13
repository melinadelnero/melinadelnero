'use client'

import { useState, useCallback } from 'react'

type DialogType = 'confirm' | 'error' | 'success'

type DialogConfig = {
  open: boolean
  type: DialogType
  message: string
  onConfirm?: () => void | Promise<void>
}

const CLOSED: DialogConfig = { open: false, type: 'success', message: '' }

export function useAdminDialog() {
  const [cfg, setCfg] = useState<DialogConfig>(CLOSED)

  const showAlert = useCallback((message: string, type: 'error' | 'success' = 'error') => {
    setCfg({ open: true, type, message })
  }, [])

  const showConfirm = useCallback((message: string, onConfirm: () => void | Promise<void>) => {
    setCfg({ open: true, type: 'confirm', message, onConfirm })
  }, [])

  const close = useCallback(() => setCfg(CLOSED), [])

  return { cfg, showAlert, showConfirm, close }
}

type Props = DialogConfig & { onClose: () => void }

export default function AdminDialog({ open, type, message, onConfirm, onClose }: Props) {
  if (!open) return null

  const isConfirm = type === 'confirm'
  const isError = type === 'error'

  return (
    <div
      className="modal-back"
      style={{ zIndex: 500 }}
      onClick={e => { if (e.target === e.currentTarget && !isConfirm) onClose() }}
    >
      <div className="modal" style={{ maxWidth: 420 }}>
        <h3 style={isError ? { color: 'var(--accent)' } : {}}>
          {isConfirm && <>Confirmá <em>acción</em></>}
          {type === 'success' && <>Todo <em>listo</em></>}
          {isError && 'Error'}
        </h3>
        <p style={{
          fontFamily: 'var(--f-display)',
          fontSize: 17,
          lineHeight: 1.5,
          color: 'var(--ink)',
          margin: '16px 0 32px',
        }}>
          {message}
        </p>
        <div className="modal-actions">
          {isConfirm ? (
            <>
              <button className="btn-danger" onClick={onClose}>Cancelar</button>
              <button className="btn-add" onClick={async () => { await onConfirm?.(); onClose() }}>
                Confirmar
              </button>
            </>
          ) : (
            <button className="btn-add" onClick={onClose}>Aceptar</button>
          )}
        </div>
      </div>
    </div>
  )
}
