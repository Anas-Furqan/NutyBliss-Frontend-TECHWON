import type { Metadata } from 'next'
import { Mulish } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import AppChrome from '@/components/layout/AppChrome'

const mulish = Mulish({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-mulish',
})

export const metadata: Metadata = {
  title: 'Nuty Bliss - Premium Peanut Butter & Healthy Foods',
  description: 'Shop premium quality peanut butter, oats, and healthy food products at Nuty Bliss. 100% Natural, No preservatives!',
  keywords: 'peanut butter, healthy food, oats, protein, fitness, Pakistan, organic, natural',
  openGraph: {
    title: 'Nuty Bliss - Premium Peanut Butter & Healthy Foods',
    description: 'Shop premium quality peanut butter, oats, and healthy food products. 100% Natural!',
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
      <body className={`${mulish.variable} font-sans`}>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#633bb1',
              color: '#fff',
              borderRadius: '12px',
            },
            success: {
              style: {
                background: '#10b981',
              },
            },
            error: {
              style: {
                background: '#ef4444',
              },
            },
          }}
        />
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  )
}
