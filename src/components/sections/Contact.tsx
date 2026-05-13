'use client'

import { useState } from 'react'
import Reveal from '@/components/primitives/Reveal'
import SectionHead from '@/components/primitives/SectionHead'
import type { ContactData } from '@/lib/types'

export default function Contact({ data }: { data: ContactData }) {
  const [form, setForm] = useState({ name: '', email: '', date: '', kind: 'club', message: '' })
  const [sent, setSent] = useState(false)

  return (
    <section className="section" id="contact" data-screen-label="05 Contacto">
      <SectionHead idx="05" title="BOOKING · CONTACTO" code="/ MAIL ME" />
      <h2 className="section-title">Para <em>contratarla</em></h2>
      <div className="contact">
        <Reveal>
          <form className="contact-form" onSubmit={(e) => { e.preventDefault(); setSent(true) }}>
            <div className="field">
              <label>Nombre / Productora</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="field">
              <label>Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="field">
              <label>Fecha tentativa</label>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div className="field">
              <label>Tipo de evento</label>
              <select value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value })}>
                <option value="club">Club / Boliche</option>
                <option value="festival">Festival</option>
                <option value="private">Evento privado</option>
                <option value="brand">Marca / corporativo</option>
                <option value="other">Otro</option>
              </select>
            </div>
            <div className="field">
              <label>Mensaje</label>
              <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Capacidad, horarios, soundsystem, presupuesto..." />
            </div>
            <button type="submit" className="btn">
              {sent ? 'Enviado ✓' : 'Solicitar fecha'}
            </button>
          </form>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="contact-info">
            <div className="contact-block lead">
              <div className="label">Pedidos urgentes</div>
              <div className="value">
                <a href={`mailto:${data.booking}`}>
                  {data.booking.split('@')[0]}<em>@{data.booking.split('@')[1]}</em>
                </a>
              </div>
            </div>
            <div className="contact-block">
              <div className="label">Prensa</div>
              <div className="value"><a href={`mailto:${data.press}`}>{data.press}</a></div>
            </div>
            <div className="contact-block">
              <div className="label">Representación</div>
              <div className="value">{data.agency}</div>
            </div>
            <div className="contact-block">
              <div className="label">Síguela</div>
              <div className="value">
                <a href="https://instagram.com/melinadelnero" target="_blank" rel="noreferrer">Instagram</a>
                {' · '}
                <a href={`https://${data.soundcloud}`} target="_blank" rel="noreferrer">SoundCloud</a>
              </div>
            </div>
            <div className="contact-block">
              <div className="label">Base</div>
              <div className="value">{data.based}</div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
