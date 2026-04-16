import type { Metadata } from 'next'
import { Fredoka, Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import AppChrome from '@/components/layout/AppChrome'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const fredoka = Fredoka({
  subsets: ['latin'],
  variable: '--font-fredoka',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Nuty Bliss - Organic Peanut Butter',
  description: 'Premium organic peanut butter experience with smooth shopping and rich product storytelling.',
  keywords: 'nuty bliss, organic peanut butter, premium food, crunchy, classic, healthy',
  openGraph: {
    title: 'Nuty Bliss - Organic Peanut Butter',
    description: 'Premium organic peanut butter experience with smooth shopping and rich product storytelling.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Nuty Bliss',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${fredoka.variable} font-sans`}>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#4B0082',
              color: '#FDF5E6',
              borderRadius: '12px',
            },
            success: {
              style: {
                background: '#FF8C00',
              },
            },
            error: {
              style: {
                background: '#3E2723',
              },
            },
          }}
        />
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  )
}
