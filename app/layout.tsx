import type React from "react"
import type { Metadata } from "next"
import { Inter, Montserrat } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"
import AdvancedAudioPlayer from "@/components/advanced-audio-player"
import { AudioPlayerProvider } from "@/components/audio-player-context"
import { BeatsProvider } from "@/components/beats-context"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
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
        className={`${inter.variable} ${montserrat.variable} font-sans bg-background text-foreground min-h-screen flex flex-col`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
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
