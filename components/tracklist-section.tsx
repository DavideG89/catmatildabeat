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

  useEffect(() => {
    const beats = getBeatsByCategory("latest").slice(0, 8)
    setLatestBeats(beats)
  }, [getBeatsByCategory])

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
        className="py-12 md:py-16 bg-gradient-to-b from-card/50 to-background"
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
      className="py-12 md:py-16 bg-gradient-to-b from-card/50 to-background"
      style={{
        "--card": "0 0% 100%",
        "--card-foreground": "0 0% 10%",
        "--muted-foreground": "0 0% 40%",
      } as React.CSSProperties}
    >
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4 font-heading">Latest Tracks</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Fresh beats ready to elevate your next project
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {latestBeats.map((beat, index) => (
            <motion.div
              key={beat.id}
              className="group bg-card rounded-xl p-4 border border-black transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
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

                {/* Buttons stacked under on mobile, right side on desktop */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePlayTrack(beat)}
                    className="text-brand-500 hover:text-brand-400 hover:bg-brand-500/10 px-3 w-full sm:w-auto"
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
                    className="text-xs px-3 w-full sm:w-auto"
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
