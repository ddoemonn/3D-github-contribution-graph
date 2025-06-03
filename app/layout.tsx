import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/hooks/use-theme'

export const metadata: Metadata = {
  title: '3D GitHub Contributions Visualizer',
  description: 'Transform your GitHub contribution history into an immersive 3D experience. Visualize your coding journey with interactive charts and beautiful animations.',
  keywords: ['GitHub', 'contributions', '3D visualization', 'developer tools', 'coding stats'],
  authors: [{ name: '3D GitHub Contributions' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider defaultTheme="system">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
