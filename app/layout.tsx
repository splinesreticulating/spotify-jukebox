import '@/app/ui/global.css'
import { inter } from '@/app/ui/fonts'
import { Metadata } from 'next'
import { ToastProvider } from '@/app/ui/toast/toast'
import { ThemeProvider } from '@/app/lib/ThemeContext'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: {
    template: '%s | Squirrel Radio',
    default: 'Squirrel Radio',
  },
  description: 'Complementary mixed nuts',
  metadataBase: new URL('http://localhost:2309'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider>
          <ToastProvider>
            <Providers>{children}</Providers>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
