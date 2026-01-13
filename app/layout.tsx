import type { Metadata } from 'next'
import { Space_Grotesk, Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import ConditionalFooter from '@/components/ConditionalFooter'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['400', '500'],
})

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-journal',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
})

export const metadata: Metadata = {
  title: 'n/fäss',
  description: 'Personal journal by Pedrom Basidj',
  icons: {
    icon: '/nfass-logo.JPG',
    apple: '/nfass-logo.JPG',
  },
}

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} ${playfairDisplay.variable}`}>
      <body className="font-body bg-[#FAFAF7] text-text antialiased">
        {children}
        <ConditionalFooter />
      </body>
    </html>
  )
}

