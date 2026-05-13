import { createClient } from '@/lib/supabase/server'
import { SEED_EVENTS, SEED_SETS, SEED_GALLERY, SEED_BIO, SEED_CONTACT, SEED_MARQUEES } from '@/lib/seed'
import Loader from '@/components/primitives/Loader'
import Cursor from '@/components/primitives/Cursor'
import Marquee from '@/components/primitives/Marquee'
import Nav from '@/components/sections/Nav'
import Hero from '@/components/sections/Hero'
import Bio from '@/components/sections/Bio'
import Events from '@/components/sections/Events'
import Sets from '@/components/sections/Sets'
import Gallery from '@/components/sections/Gallery'
import Contact from '@/components/sections/Contact'
import Footer from '@/components/sections/Footer'

export const revalidate = 60

export default async function Home() {
  const supabase = await createClient()

  const [eventsRes, setsRes, galleryRes, contentRes] = await Promise.allSettled([
    supabase.from('events').select('*').order('date'),
    supabase.from('sets').select('*').order('created_at', { ascending: false }),
    supabase.from('gallery').select('*').order('created_at'),
    supabase.from('site_content').select('*').eq('id', 1).single(),
  ])

  const events =
    eventsRes.status === 'fulfilled' && eventsRes.value.data?.length
      ? eventsRes.value.data
      : SEED_EVENTS

  const sets =
    setsRes.status === 'fulfilled' && setsRes.value.data?.length
      ? setsRes.value.data
      : SEED_SETS

  const gallery =
    galleryRes.status === 'fulfilled' && galleryRes.value.data?.length
      ? galleryRes.value.data
      : SEED_GALLERY

  const content =
    contentRes.status === 'fulfilled' && contentRes.value.data
      ? contentRes.value.data
      : null

  const bio = content?.bio ?? SEED_BIO
  const contact = content?.contact ?? SEED_CONTACT
  const marquees = content?.marquees ?? SEED_MARQUEES

  return (
    <>
      <Loader />
      <div className="grain" />
      <Cursor />
      <Nav />
      <Hero />
      <Marquee items={marquees.hero} />
      <Bio data={bio} />
      <Events events={events} />
      <Marquee items={marquees.events} />
      <Sets sets={sets} />
      <Gallery items={gallery} />
      <Contact data={contact} />
      <Footer />
    </>
  )
}
