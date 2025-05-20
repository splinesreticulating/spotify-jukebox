import "@/app/global.css"
import { inter } from "@/app/fonts"
import { ThemeProvider } from "@/app/lib/ThemeContext"
import type { Metadata } from "next"
import Script from "next/script"
import { Providers } from "./providers"

export const metadata: Metadata = {
    title: {
        template: "%s | Spotify Jukebox",
        default: "Spotify Jukebox",
    },
    description: "Pick the perfect next song",
    metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:2309"),
    icons: {
        icon: [
            {
                url: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🎛️</text></svg>',
                type: "image/svg+xml",
            },
            { url: "/favicon.ico" },
        ],
    },
}

export default function RootLayout({
    children,
}: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={`${inter.className} antialiased`}>
                <ThemeProvider>
                    <Providers>{children}</Providers>
                </ThemeProvider>

                {process.env.NODE_ENV === "production" && (
                    <Script
                        src="https://gc.zgo.at/count.js"
                        data-goatcounter={process.env.NEXT_PUBLIC_GOATCOUNTER_URL}
                        strategy="afterInteractive"
                    />
                )}
            </body>
        </html>
    )
}
