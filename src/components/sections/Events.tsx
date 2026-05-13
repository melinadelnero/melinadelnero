import Reveal from '@/components/primitives/Reveal'
import SectionHead from '@/components/primitives/SectionHead'
import type { Event } from '@/lib/types'

function fmtDate(iso: string) {
  const d = new Date(iso + 'T00:00:00')
  const months = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC']
  return {
    day: String(d.getDate()).padStart(2, '0'),
    mon: months[d.getMonth()],
    year: d.getFullYear(),
  }
}

export default function Events({ events }: { events: Event[] }) {
  const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date))

  return (
    <section className="section" id="events" data-screen-label="02 Eventos">
      <SectionHead idx="02" title="PRÓXIMOS EVENTOS" code={`/ ${sorted.length} FECHAS`} />
      <h2 className="section-title">Próximas <em>fechas</em></h2>
      <div className="events">
        {sorted.map((e, i) => {
          const d = fmtDate(e.date)
          return (
            <Reveal key={e.id} delay={i * 0.05}>
              <a href={e.url || '#'} className="event-row">
                <div className="event-date">
                  <span className="day">{d.day}</span>
                  {d.mon} · {d.year}
                </div>
                <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, letterSpacing: '0.12em', color: 'var(--ink-dim)' }}>
                  {e.time}
                </div>
                <div className="event-name">{e.name}</div>
                <div className="event-venue">
                  <strong>{e.venue}</strong>
                  {e.city}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                  <span className={`event-status ${e.status}`}>
                    {e.status === 'tickets' && '→ Tickets'}
                    {e.status === 'soldout' && 'Sold out'}
                    {e.status === 'free' && 'Free entry'}
                  </span>
                </div>
                <div className="event-arrow">→</div>
              </a>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
