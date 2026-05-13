import type { Metadata } from 'next'
import { Space_Grotesk, Instrument_Serif, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
})

const instrumentSerif = Instrument_Serif({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-serif',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'Melina Delnero — DJ · Selectora',
  description: 'DJ y selectora porteña. Melodic Techno · Progressive House · Organic House. Buenos Aires, Argentina.',
  openGraph: {
    title: 'Melina Delnero — DJ · Selectora',
    description: 'DJ y selectora porteña. Buenos Aires, Argentina.',
    locale: 'es_AR',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${spaceGrotesk.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}>
        {children}
      </body>
    </html>
  )
}
