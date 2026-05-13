import type { Event, Set, GalleryItem, Bio, ContactData, MarqueeSet, HeroTexts } from './types'

export const SEED_EVENTS: Event[] = [
  { id: 'e1', date: '2026-05-22', time: '23:00', name: 'RESONANCIA', venue: 'Crobar', city: 'Buenos Aires', status: 'tickets', url: '#', created_at: '' },
  { id: 'e2', date: '2026-05-30', time: '06:00', name: 'Sunrise Set — Costanera', venue: 'Open Air', city: 'Buenos Aires', status: 'free', url: '#', created_at: '' },
  { id: 'e3', date: '2026-06-07', time: '22:00', name: 'BPM Festival · B2B con Beau Didier', venue: 'Mandarine Park', city: 'Buenos Aires', status: 'tickets', url: '#', created_at: '' },
  { id: 'e4', date: '2026-06-21', time: '23:30', name: 'Caos Lunar', venue: 'Bresh Club', city: 'Córdoba', status: 'soldout', url: '#', created_at: '' },
  { id: 'e5', date: '2026-07-12', time: '02:00', name: 'TRÄNCE — closing', venue: 'Trece', city: 'Buenos Aires', status: 'tickets', url: '#', created_at: '' },
]

export const SEED_SETS: Set[] = [
  { id: 's1', title: 'Sunrise Set @ Costanera Norte', youtube_id: '5qap5aO4i9A', duration: '62:14', genre: 'Melodic Techno', date: '2026-03', created_at: '' },
  { id: 's2', title: 'Live at Crobar — RESONANCIA', youtube_id: 'jfKfPfyJRdk', duration: '78:42', genre: 'Progressive House', date: '2026-02', created_at: '' },
  { id: 's3', title: 'B2B Sol Ortega — Mandarine', youtube_id: 'DWcJFNfaw9c', duration: '94:08', genre: 'Organic House', date: '2026-01', created_at: '' },
  { id: 's4', title: 'Tulum sessions Vol. 03', youtube_id: '7NOSDKb0HlU', duration: '55:30', genre: 'Afro House', date: '2025-12', created_at: '' },
  { id: 's5', title: 'After hours · vinyl only', youtube_id: 'lTRiuFIWV54', duration: '68:21', genre: 'Deep Techno', date: '2025-11', created_at: '' },
  { id: 's6', title: 'MIRAGE — promo mix', youtube_id: 'M7lc1UVf-VE', duration: '44:17', genre: 'Indie Dance', date: '2025-10', created_at: '' },
]

export const SEED_GALLERY: GalleryItem[] = [
  { id: 'g1', size: 'lg',   tag: 'Crobar · 2026',         storage_path: null, created_at: '' },
  { id: 'g2', size: 'tall', tag: 'Backstage · Mandarine',  storage_path: null, created_at: '' },
  { id: 'g3', size: 'wide', tag: 'Costanera sunrise',      storage_path: null, created_at: '' },
  { id: 'g4', size: 'sq',   tag: 'Studio session',         storage_path: null, created_at: '' },
  { id: 'g5', size: 'row',  tag: 'Tour bus · Córdoba',     storage_path: null, created_at: '' },
  { id: 'g6', size: 'sq',   tag: 'Polaroid · 03:42 AM',    storage_path: null, created_at: '' },
  { id: 'g7', size: 'row',  tag: 'Soundcheck',             storage_path: null, created_at: '' },
  { id: 'g8', size: 'hero', tag: 'Closing set · TRÄNCE',   storage_path: null, created_at: '' },
]

export const SEED_BIO: Bio = {
  body1: 'Melina Delnero es DJ y selectora porteña. Construye sets como narrativas — graduales, hipnóticos, con un ojo (y un oído) para lo melódico y lo crudo a la vez.',
  body2: 'Desde la primera tornamesa heredada hasta los main stages de Buenos Aires, su búsqueda es la misma: mover cuerpos y dejar marcas. Residente recurrente en clubs de la escena local, ha compartido cabina con referentes del circuito sudamericano.',
  quote: 'La pista es un lenguaje. Yo solo lo traduzco.',
  stats: [
    { num: '08', label: 'Años en cabina' },
    { num: '120+', label: 'Sets · 2025' },
    { num: '14', label: 'Países visitados' },
  ],
}

export const SEED_HERO_TEXTS: HeroTexts = {
  est: 'EST. 2022',
  vol: 'VOL. 08',
  tagline: 'CABINA ✦ RITUAL',
  scroll_label: 'Desliza',
}

export const SEED_MARQUEES: MarqueeSet = {
  hero: [
    'MELINA /em/delnero',
    'BSAS — AR',
    'BOOKING /em/open',
    'EST. 2018',
    'MELODIC · TECHNO · HOUSE',
    'CABINA /em/ritual',
  ],
  events: [
    'PRÓXIMA /em/fecha',
    'RESONANCIA · CROBAR · 22.MAY',
    'TICKETS /em/abiertos',
    '↓ ↓ ↓',
  ],
}

export const SEED_CONTACT: ContactData = {
  booking: 'booking@melinadelnero.com',
  press: 'press@melinadelnero.com',
  instagram: '@melinadelnero',
  soundcloud: 'soundcloud.com/melinadelnero',
  based: 'Buenos Aires — AR',
  agency: 'Subsuelo Bookings',
}
