import React from "react"
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Your AI',
  description: 'Your AI helps elderly people and persons with disabilities in India discover government schemes, find suitable jobs, access para-sports opportunities, and communicate using sign language translation.',
  keywords: ['accessibility', 'disability', 'government schemes', 'India', 'AI assistant', 'sign language', 'para sports', 'elderly care'],
  icons: {
    icon: "/myicon.png",
  },
}

export const viewport: Viewport = {
  themeColor: '#1a7a5c',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
