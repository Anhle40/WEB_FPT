'use client'

import { Inter, Space_Grotesk } from 'next/font/google'
import { useEffect } from 'react'

const inter = Inter({ subsets: ['latin', 'vietnamese'], variable: '--font-inter', display: 'swap' })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin', 'vietnamese'], variable: '--font-space-grotesk', display: 'swap' })

export default function ClientBody({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Ensure fonts are loaded on client side
    document.body.classList.add(inter.variable, spaceGrotesk.variable)
  }, [])

  return (
    <body 
      className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}
      suppressHydrationWarning={true}
    >
      {children}
    </body>
  )
}
