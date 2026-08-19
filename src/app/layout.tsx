import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Karim Residencia',
  description: 'Luxury Residential Community Management',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
