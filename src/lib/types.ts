export type EventStatus = 'tickets' | 'free' | 'soldout'

export interface Event {
  id: string
  date: string
  time: string | null
  name: string
  venue: string | null
  city: string | null
  status: EventStatus
  url: string | null
  created_at: string
}

export interface Set {
  id: string
  title: string
  youtube_id: string
  duration: string | null
  genre: string | null
  date: string | null
  created_at: string
}

export type GallerySize = 'lg' | 'tall' | 'wide' | 'sq' | 'row' | 'hero'

export interface GalleryItem {
  id: string
  size: GallerySize
  tag: string | null
  storage_path: string | null
  created_at: string
}

export interface BioStat {
  num: string
  label: string
}

export interface Bio {
  body1: string
  body2: string
  quote: string
  stats: BioStat[]
}

export interface ContactData {
  booking: string
  press: string
  instagram: string
  soundcloud: string
  based: string
  agency: string
}

export interface MarqueeSet {
  hero: string[]
  events: string[]
}

export interface SiteContent {
  id: number
  bio: Bio
  contact: ContactData
  marquees?: MarqueeSet
  updated_at: string
}
