'use client'

import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin', 'vietnamese'], variable: '--font-inter', display: 'swap' })

export default function ClientBody({ children }: { children: React.ReactNode }) {
  return (
    <body 
      className={`${inter.variable} font-sans antialiased`}
      suppressHydrationWarning={true}
    >
      {children}
    </body>
  )
}
