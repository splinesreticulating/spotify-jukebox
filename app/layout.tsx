import '@/app/global.css'
import { inter } from '@/app/fonts'
import { Metadata } from 'next'
import { ThemeProvider } from '@/app/lib/ThemeContext'
import { Providers } from './providers'
import Script from 'next/script'

export const metadata: Metadata = {
  title: {
    template: '%s | Squirrel Radio',
    default: 'Squirrel Radio',
  },
  description: 'Complimentary mixed nuts',
  metadataBase: new URL('https://treehouse.squirrelradio.com'),
  icons: {
    icon: [
      {
        url: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🎛️</text></svg>',
        type: 'image/svg+xml',
      },
      { url: '/favicon.ico' },
    ],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider>
          <Providers>{children}</Providers>
        </ThemeProvider>

        {process.env.NODE_ENV === 'production' && (
          <Script
            src="https://gc.zgo.at/count.js"
            data-goatcounter="https://squirrelradio.goatcounter.com/count"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  )
}
