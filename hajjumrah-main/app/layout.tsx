import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Inter, IBM_Plex_Mono } from 'next/font/google'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-playfair',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
})

const ibmMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-ibm-mono',
})

export const metadata: Metadata = {
  title: 'Hajj Umrah Tours - Sacred Journeys',
  description: 'Experience the pilgrimage of a lifetime with luxury, care, and spiritual guidance. Trusted by over 5,000 pilgrims.',
  keywords: ['Hajj', 'Umrah', 'pilgrimage', 'Islamic tour', 'sacred journey'],
  icons: {
    icon: '/icon.svg',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#C9A227',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} ${ibmMono.variable} bg-background`}
    >
      <body className="antialiased bg-background text-foreground">
        <Navigation />
        {children}
        <Footer />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
