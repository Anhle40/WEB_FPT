'use client'

import { Inter, Space_Grotesk } from 'next/font/google'

const inter = Inter({ subsets: ['latin', 'vietnamese'], variable: '--font-inter' })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin', 'vietnamese'], variable: '--font-space-grotesk' })

export default function ClientBody({ children }: { children: React.ReactNode }) {
  return (
    <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
      {children}
    </body>
  )
}
