"use client"

import { useState, useEffect } from "react"
import { Play, Pause, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useAudioPlayer } from "@/components/audio-player-context"
import { useBeats } from "@/components/beats-context"

export default function TrendingBeats() {
  const { currentTrack, isPlaying, playTrack, togglePlayPause } = useAudioPlayer()
  const { getBeatsByCategory } = useBeats()
  const [trendingBeats, setTrendingBeats] = useState<any[]>([])

  useEffect(() => {
    const beats = getBeatsByCategory("trending").slice(0, 6)
    setTrendingBeats(beats)
  }, [getBeatsByCategory])

  const handlePlayTrack = (beat: any) => {
    if (currentTrack?.id === beat.id) {
      togglePlayPause()
    } else {
      playTrack({
        id: beat.id,
        title: beat.title,
        artist: beat.producer,
        audioSrc: beat.audio_file || "/demo-beat.mp3",
        coverImage: beat.cover_image,
        beatstarsLink: beat.beatstars_link,
      })
    }
  }

  const handleBuyBeat = (beatstarsLink: string) => {
    window.open(beatstarsLink || "https://beatstars.com/catmatildabeat", "_blank")
  }

  if (trendingBeats.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No trending beats available at the moment.</p>
      </div>
    )
  }

  return (
    <>
      {trendingBeats.map((beat, index) => (
        <motion.div
          key={beat.id}
          className="group bg-card rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 min-w-[280px] md:min-w-[320px] flex-shrink-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
        >
          <div className="relative aspect-square overflow-hidden">
            <img
              src={beat.cover_image || "/placeholder.svg?height=300&width=300"}
              alt={beat.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <button
              onClick={() => handlePlayTrack(beat)}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-brand-600 hover:bg-brand-500 rounded-full p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
            >
              {currentTrack?.id === beat.id && isPlaying ? (
                <Pause className="h-6 w-6 text-white" />
              ) : (
                <Play className="h-6 w-6 text-white" />
              )}
            </button>
          </div>

          <div className="p-4">
            <h3 className="font-bold text-lg mb-1 truncate">{beat.title}</h3>
            <p className="text-muted-foreground text-sm mb-3 truncate">{beat.producer}</p>

            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
              <span>{beat.genre}</span>
              <span>•</span>
              <span>{beat.bpm} BPM</span>
              <span>•</span>
              <span>{beat.key}</span>
            </div>

            {beat.tags && (
              <div className="flex flex-wrap gap-1 mb-4">
                {beat.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
                  <span key={tagIndex} className="px-2 py-1 bg-brand-500/20 text-brand-500 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handlePlayTrack(beat)}
                className="text-brand-500 hover:text-brand-400 hover:bg-brand-500/10 px-3"
              >
                {currentTrack?.id === beat.id && isPlaying ? (
                  <Pause className="h-4 w-4 mr-1" />
                ) : (
                  <Play className="h-4 w-4 mr-1" />
                )}
                {currentTrack?.id === beat.id && isPlaying ? "Pause" : "Play"}
              </Button>

              <Button
                size="sm"
                className="bg-brand-600 hover:bg-brand-500"
                onClick={() => handleBuyBeat(beat.beatstars_link)}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Buy
              </Button>
            </div>
          </div>
        </motion.div>
      ))}
    </>
  )
}
