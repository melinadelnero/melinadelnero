@AGENTS.md

# Proyecto: melinadelnero.vercel.app

Sitio web oficial de **Melina Delnero**, DJ y selectora porteña (Buenos Aires, AR).
Desarrollado por Ezequiel Delnero (delneroezequiel@gmail.com / ezequiel-web.vercel.app).

## Stack

- Next.js 16.2.6 — App Router, Turbopack
- TypeScript
- CSS global en `src/app/globals.css` (NO Tailwind utilities)
- Supabase — PostgreSQL + Auth + Storage
- Resend — emails del formulario de contacto
- Vercel — deploy desde rama `main` en GitHub

## Deploy

```bash
git add ...
git commit ...
git push origin main   # Vercel buildea desde GitHub, no desde local
bash deploy.sh         # dispara webhook de Vercel
```

Ambos pasos son necesarios. El `deploy.sh` solo sin push despliega el estado anterior del remoto.

## Estructura de archivos

```
src/
├── app/
│   ├── page.tsx                  — Home (Server Component, revalidate=60)
│   ├── layout.tsx                — Root layout
│   ├── globals.css               — TODO el CSS del sitio
│   ├── login/page.tsx            — Login Supabase Auth
│   ├── reset-password/page.tsx   — Nueva contraseña tras link del email
│   ├── admin/
│   │   ├── layout.tsx            — Layout admin (sin Cursor ni Loader)
│   │   └── page.tsx              — Panel admin (client component)
│   └── api/
│       └── contact/route.ts      — POST handler Resend (formulario booking)
├── components/
│   ├── primitives/
│   │   ├── Cursor.tsx            — Cursor custom (solo web pública)
│   │   ├── Loader.tsx            — Pantalla de carga inicial
│   │   ├── Marquee.tsx           — Banda de texto animado (sintaxis /em/ para rojo)
│   │   ├── Reveal.tsx            — Animación de entrada
│   │   ├── SectionHead.tsx       — Cabecera numerada de sección
│   │   └── PortraitImg.tsx       — 'use client' — img con onError
│   ├── sections/
│   │   ├── Nav.tsx, Hero.tsx, Bio.tsx, Events.tsx
│   │   ├── Sets.tsx, Gallery.tsx, Contact.tsx, Footer.tsx
│   └── admin/
│       ├── AdminDialog.tsx       — Sistema de dialogs (reemplaza alert/confirm)
│       ├── EventsPanel.tsx       — CRUD eventos
│       ├── SetsPanel.tsx         — CRUD sets YouTube
│       ├── GalleryPanel.tsx      — Upload/gestión galería (Supabase Storage)
│       ├── BioPanel.tsx          — Editor bio + stats
│       ├── ContactPanel.tsx      — Editor datos de contacto
│       └── MarqueesPanel.tsx     — Editor textos marquee + hero footer
└── lib/
    ├── types.ts                  — Interfaces TypeScript
    ├── seed.ts                   — Datos fallback si Supabase está vacío
    └── supabase/client.ts, server.ts
```

## Base de datos Supabase

```
events        — id, date, time, name, venue, city, status, url, created_at
sets          — id, title, youtube_id, duration, genre, date, created_at
gallery       — id, size, tag, storage_path, created_at
site_content  — id=1 (fila única), bio jsonb, contact jsonb, marquees jsonb, hero jsonb
```

Storage: bucket `gallery` (público). RLS habilitado — escritura solo para authenticated.

Auth: Supabase Auth email/password. Middleware protege `/admin/*` → redirige a `/login`.

## Variables de entorno

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
RESEND_API_KEY
```

## Quirks críticos

**Cursor:** `body { cursor: none }` global. Admin y login DEBEN tener `className="admin-wrap"`.

**Resend:** Usar `await import('resend')` dentro del handler POST. Import estático a nivel de módulo causa error de build en Vercel (API key no disponible en build time).

**Componentes anidados → foco perdido:** Definir subcomponentes FUERA del componente padre. Si se definen adentro, React los desmonta/remonta en cada render y el input pierde el foco. (Bug resuelto en MarqueesPanel/BandEditor.)

**Server vs Client:** Server components no pueden usar `onError` en img. Usar `PortraitImg.tsx` ('use client') como wrapper.

**YouTube IDs:** `extractYouTubeId()` en SetsPanel limpia URLs de share (`?si=` tracking). Nunca guardar URLs completas en `youtube_id`.

**Galería Storage URL:** `${NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/gallery/${storage_path}`

**Botones .btn:** La clase `.btn` puede agregar `→` via CSS `::after`. No poner `→` en el texto del botón.

**Deploy:** Siempre `git push origin main` ANTES o junto con `bash deploy.sh`.

**Reset password:** Requiere que `https://melinadelnero.vercel.app/reset-password` esté en Supabase → Authentication → URL Configuration → Redirect URLs.

## Flujo de datos (Home)

Server Component con `revalidate = 60`. Hace `Promise.allSettled` de 4 queries.
Si alguna falla o está vacía → usa `SEED_*` de `src/lib/seed.ts` como fallback.

## Formulario de contacto

`/api/contact` → Resend → `melinadelnero.techno@gmail.com`
`replyTo`: email del visitante. From: `Booking Web <onboarding@resend.dev>`
(cambiar el from cuando haya dominio propio verificado en Resend)

## Pendiente / próximas mejoras

- Cuando Melina tenga dominio propio: actualizar URL en Footer.tsx y deploy.sh
- Dashboard del admin muestra stats hardcodeadas (conectar a conteos reales de Supabase)
- Cambiar from: de Resend a dominio verificado propio
