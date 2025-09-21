"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Play, Pause, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useAudioPlayer } from "@/components/audio-player-context"
import { useBeats } from "@/components/beats-context"

export default function TracklistSection() {
  const { currentTrack, isPlaying, playTrack, togglePlayPause } = useAudioPlayer()
  const { getBeatsByCategory } = useBeats()
  const [latestBeats, setLatestBeats] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const beats = getBeatsByCategory("latest")
    setLatestBeats(beats)
    setCurrentPage(1)
  }, [getBeatsByCategory])

  useEffect(() => {
    if (typeof window === "undefined") return

    const mediaQuery = window.matchMedia("(max-width: 639px)")
    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(event.matches)
    }

    handleChange(mediaQuery)

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange)
      return () => mediaQuery.removeEventListener("change", handleChange)
    }

    mediaQuery.addListener(handleChange)
    return () => mediaQuery.removeListener(handleChange)
  }, [])

  const itemsPerPage = isMobile ? 3 : 6
  const totalPages = Math.ceil(latestBeats.length / (itemsPerPage || 1))

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [totalPages, currentPage])

  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedBeats = latestBeats.slice(startIndex, startIndex + itemsPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handlePlayTrack = (beat: any) => {
    if (currentTrack?.id === beat.id) {
      togglePlayPause()
    } else {
      console.log('Latest tracks - beat data:', beat)
      console.log('Latest tracks - duration from database:', beat.duration)
      playTrack({
        id: beat.id,
        title: beat.title,
        artist: beat.producer,
        audioSrc: beat.audio_file || "/demo-beat.mp3", // Use uploaded audio file or fallback
        coverImage: beat.cover_image,
        beatstarsLink: beat.beatstars_link,
        type: "beat",
        durationString: beat.duration, // Pass duration as string from database
      })
    }
  }

  const handleBuyBeat = (beatstarsLink: string) => {
    window.open(beatstarsLink || "https://beatstars.com/catmatildabeat", "_blank")
  }

  if (latestBeats.length === 0) {
    return (
      <div
        className="pt-10 pb-6 md:pt-16 md:pb-10 bg-gradient-to-b from-card/50 to-background"
        style={{
          "--card": "0 0% 100%",
          "--card-foreground": "0 0% 10%",
          "--muted-foreground": "0 0% 40%",
        } as React.CSSProperties}
      >
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 font-heading">Latest Tracks</h2>
            <p className="text-muted-foreground">No tracks available at the moment.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <section
      className="pt-10 pb-6 md:pt-16 md:pb-10 bg-gradient-to-b from-card/50 to-background"
      style={{
        "--card": "0 0% 100%",
        "--card-foreground": "0 0% 10%",
        "--muted-foreground": "0 0% 40%",
      } as React.CSSProperties}
    >
      <div className="container mx-auto px-4">
        <motion.div
          className="text-left md:text-center mb-8 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4 font-heading">Latest Tracks</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto md:text-center">
            Fresh beats ready to elevate your next project
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {paginatedBeats.map((beat, index) => (
            <motion.div
              key={beat.id}
              className="group bg-card rounded-xl p-4 border border-black"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                {/* Image + Info side-by-side on mobile */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="relative flex-shrink-0">
                    <img
                      src={beat.cover_image || "/placeholder.svg?height=64&width=64"}
                      alt={beat.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <button
                      onClick={() => handlePlayTrack(beat)}
                      className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg opacity-0 hover:opacity-100 transition-opacity"
                    >
                      {currentTrack?.id === beat.id && isPlaying ? (
                        <Pause className="h-6 w-6 text-white" />
                      ) : (
                        <Play className="h-6 w-6 text-white" />
                      )}
                    </button>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg truncate text-card-foreground transition-colors group-hover:text-black">
                      {beat.title}
                    </h3>
                    <p className="text-black/80 text-sm truncate">{beat.producer}</p>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-black/70 mt-1">
                      <span>{beat.genre}</span>
                      <span className="hidden sm:inline">•</span>
                      <span>{beat.bpm} BPM</span>
                      <span className="hidden sm:inline">•</span>
                      <span>{beat.key}</span>
                      {beat.duration && (
                        <>
                          <span className="hidden sm:inline">•</span>
                          <span>{beat.duration}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Buttons inline on mobile, consistent spacing on desktop */}
                <div className="flex flex-row flex-wrap sm:flex-row items-center gap-2 w-full sm:w-auto">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePlayTrack(beat)}
                    className="text-brand-500 hover:text-brand-400 hover:bg-brand-500/10 px-3 flex-1 sm:flex-none"
                  >
                    {currentTrack?.id === beat.id && isPlaying ? (
                      <>
                        <Pause className="h-4 w-4 mr-1" /> Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-1" /> Play
                      </>
                    )}
                  </Button>

                  <Button
                    size="sm"
                    variant="cta"
                    className="text-xs px-3 flex-1 sm:flex-none min-w-[90px]"
                    onClick={() => handleBuyBeat(beat.beatstars_link)}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Buy
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-5 gap-1 md:gap-2">
            {Array.from({ length: totalPages }, (_, index) => {
              const pageNumber = index + 1
              const isActive = pageNumber === currentPage
              return (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => handlePageChange(pageNumber)}
                  className={`inline-flex items-center justify-center w-4 h-4 rounded-full transition-colors border border-transparent !min-w-[16px] !min-h-[16px] ${
                    isActive
                      ? "bg-brand-500"
                      : "bg-black/20"
                  }`}
                  aria-label={`Go to page ${pageNumber}`}
                >
                  <span className="sr-only">{pageNumber}</span>
                </button>
              )
            })}
          </div>
        )}

        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          {/* <Button
            variant="outline"
            
            onClick={() => window.open("https://beatstars.com/catmatildabeat", "_blank")}
          >
            View All Beats on BeatStars
          </Button> */}
        </motion.div>
      </div>
    </section>
  )
}
