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

export const metadata: Metadata = {
  metadataBase: new URL("https://catmatildabeat.com"),
  title: "Cat Matilda Beat | Feel the Beat and get Inspired.",
  description: "Explore CatMatilda Beat | A marketplace for every genre and project. Unique beats to buy or free. No curse, just beats.",
  keywords: [
    "Cat Matilda Beat",
    "premium beats",
    "beat marketplace",
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
  authors: [{ name: "Cat Matilda Beat" }],
  creator: "Cat Matilda Beat",
  publisher: "Cat Matilda Beat",
  openGraph: {
    title: "Cat Matilda Beat | No curse, just beats.",
    description: "Discover inspiring beats, tailor-made productions, and professional mixing services by Cat Matilda Beat.",
    url: "https://catmatildabeat.com",
    siteName: "Cat Matilda Beat",
    locale: "it_IT",
    type: "website",
    images: [
      {
        url: "/img/CatMatildaStudio.jpg",
        width: 1200,
        height: 630,
        alt: "Cat Matilda Beat studio setup",
      },
    ],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", rel: "icon", type: "image/x-icon" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon-32x32.png",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "pEIdPGy0Cok9IirdErd3PZIiDDcg4YQCJzpqpWi5_sc",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${gafata.variable} font-sans text-foreground min-h-screen flex flex-col`}
      >
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-CNGZHHYF1Y" strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || []
            function gtag(){dataLayer.push(arguments)}
            gtag('js', new Date())

            gtag('config', 'G-CNGZHHYF1Y')
          `}
        </Script>
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
