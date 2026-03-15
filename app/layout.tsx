import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import ClientBody from '@/components/client-body'
import './globals.css'

export const metadata: Metadata = {
  title: 'FPTU Survival Kit',
  description: 'He sinh thai ho tro sinh vien FPT University - Wiki, Deadline, Cong dong, Chatbot, Cam nang',
}

export const viewport: Viewport = {
  themeColor: '#e5631a',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi">
      <ClientBody>
        {children}
        <Analytics />
      </ClientBody>
    </html>
  )
}
