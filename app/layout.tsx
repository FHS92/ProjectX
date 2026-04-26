import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import { SessionProvider } from '@/components/SessionProvider'
import './globals.css'

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
})

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'MANSAPP — The Outdoor Sportsman\'s Companion',
  description: 'Log, learn, discover and connect across shooting, hunting, fishing, diving and more.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}
