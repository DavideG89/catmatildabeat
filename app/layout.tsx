import type React from "react"
import type { Metadata } from "next"
import { Inter, Gafata } from "next/font/google"
import "./globals.css"
import Script from "next/script"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"
import AdvancedAudioPlayer from "@/components/advanced-audio-player"
import { AudioPlayerProvider } from "@/components/audio-player-context"
import { BeatsProvider } from "@/components/beats-context"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
})
const gafata = Gafata({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-gafata",
  display: "swap",
})

const enableAnalytics = (process.env.NEXT_PUBLIC_ENABLE_ANALYTICS || "").toLowerCase() === "true"

const supabaseOrigin = (() => {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://tdaoebkpidwdhwevospu.supabase.co"
    return new URL(url).origin
  } catch {
    return null
  }
})()

export const metadata: Metadata = {
  metadataBase: new URL("https://matildathecat.com"),
  title: "Matilda The Cat | No curse, just magic.",
  description: "Explore Matilda's world | A marketplace for every genre and project. Unique beats to buy or free. No curse, just magic.",
  keywords: [
    "Matilda the cat",
    "beats",
    "Illustration",
    "free beats",
    "beats marketplace",
    "beat store",
    "original beats",
    "music production",
    "mixing % mastering",
    "instrumental beats",
    "type beats",
    "beats genres",
    "exclusive beats",
    "royalty-free beats",
    "custom beats",
  ],
  authors: [{ name: "Matilda The Cat" }],
  creator: "Matilda The Cat",
  publisher: "Matilda The Cat",
  openGraph: {
    title: "Matilda The Cat | No curse, just magic.",
    description: "Discover inspiring beats, tailor-made productions, and professional mixing services by Cat Matilda.",
    url: "https://matildathecat.com",
    siteName: "Matilda The Cat",
    locale: "it_IT",
    alternateLocale: ["en_US"],
    type: "website",
    images: [
      {
        url: "/img/MatildaTheCat-Poster.png",
        width: 1200,
        height: 630,
        alt: "Matilda the cat",
      },
    ],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", rel: "icon", type: "image/x-icon" },
      { url: "/logo-32px.png", sizes: "32x32", type: "image/png" },
      { url: "/logo-16px.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/logo-32px.png",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "HqbCcBgFEC_CU3T8aeP0Kl1uik8PWDffH693WzQM9FA",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {supabaseOrigin && (
          <>
            <link rel="dns-prefetch" href={supabaseOrigin} />
            <link rel="preconnect" href={supabaseOrigin} crossOrigin="anonymous" />
          </>
        )}
        {enableAnalytics && (
          <>
            <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
            <link rel="preconnect" href="https://www.google-analytics.com" crossOrigin="anonymous" />
          </>
        )}
      </head>
      <body
        className={`${inter.variable} ${gafata.variable} font-sans text-foreground min-h-screen flex flex-col`}
      >
        {enableAnalytics && (
          <>
            <Script src="https://www.googletagmanager.com/gtag/js?id=G-HG5MGWJS48" strategy="afterInteractive" />
            <Script id="gtag-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || []
                function gtag(){dataLayer.push(arguments)}
                gtag('js', new Date())

                gtag('config', 'G-HG5MGWJS48')
              `}
            </Script>
          </>
        )}
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <BeatsProvider>
            <AudioPlayerProvider>
              <Header />
              <main className="flex-grow">{children}</main>
              <Footer />
              <AdvancedAudioPlayer />
            </AudioPlayerProvider>
          </BeatsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
