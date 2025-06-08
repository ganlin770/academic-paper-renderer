import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Academic Paper Renderer',
  description: '专业的学术论文写作和渲染平台，支持Markdown编辑、LaTeX公式、SVG图表',
  keywords: ['学术论文', 'Markdown', 'LaTeX', 'SVG', '论文编辑', '学术写作'],
  authors: [{ name: 'Academic Paper Renderer Team' }],
  creator: 'Academic Paper Renderer',
  publisher: 'Academic Paper Renderer',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://academic-paper-renderer.vercel.app',
    title: 'Academic Paper Renderer',
    description: '专业的学术论文写作和渲染平台',
    siteName: 'Academic Paper Renderer',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Academic Paper Renderer',
    description: '专业的学术论文写作和渲染平台',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <div id="__next">
          {children}
        </div>
      </body>
    </html>
  )
}