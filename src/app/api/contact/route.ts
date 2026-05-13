import { NextResponse } from 'next/server'

const KIND_LABEL: Record<string, string> = {
  club: 'Club / Boliche',
  festival: 'Festival',
  private: 'Evento privado',
  brand: 'Marca / corporativo',
  other: 'Otro',
}

export async function POST(req: Request) {
  const { Resend } = await import('resend')
  const resend = new Resend(process.env.RESEND_API_KEY)
  const { name, email, date, kind, message } = await req.json()

  if (!name || !email) {
    return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
  }

  const { error } = await resend.emails.send({
    from: 'Booking Web <onboarding@resend.dev>',
    to: 'melinadelnero.techno@gmail.com',
    replyTo: email,
    subject: `Solicitud de booking — ${name}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; color: #111;">
        <h2 style="margin-bottom: 4px;">Nueva solicitud de booking</h2>
        <p style="color: #666; margin-top: 0;">desde melinadelnero.vercel.app</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #666; width: 140px;">Nombre / Productora</td><td style="padding: 8px 0;"><strong>${name}</strong></td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Email de contacto</td><td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Fecha tentativa</td><td style="padding: 8px 0;">${date || '—'}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Tipo de evento</td><td style="padding: 8px 0;">${KIND_LABEL[kind] ?? kind}</td></tr>
        </table>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #666; margin-bottom: 4px;">Mensaje</p>
        <p style="white-space: pre-wrap;">${message || '—'}</p>
      </div>
    `,
  })

  if (error) {
    console.error('Resend error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
