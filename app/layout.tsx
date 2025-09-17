import type React from "react"
import type { Metadata } from "next"
import { Inter, Gafata } from "next/font/google"
import "./globals.css"
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
  title: "Cat Matilda Beat | Premium Beats & Sample Packs",
  description: "High-quality beats and sample packs for producers and artists",
    generator: 'v0.app'
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
