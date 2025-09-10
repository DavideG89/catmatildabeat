"use client"

import { useState } from "react"
import { Play, Pause, Clock, Music } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAudioPlayer } from "@/components/audio-player-context"
import { useBeats } from "@/components/beats-context"
import { motion } from "framer-motion"

export default function TracklistSection() {
  const { beats } = useBeats()
  const { setCurrentTrack, setQueue, currentTrack, isPlaying } = useAudioPlayer()
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null)

  // Get active beats for tracklist
  const activeBeats = beats.filter((beat) => beat.status === "Active")

  const handlePlayTrack = (beat: any, index: number) => {
    const track = {
      id: beat.id,
      title: beat.title,
      artist: beat.producer,
      coverImage: beat.coverImage,
      audioSrc: "/demo-beat.mp3",
      type: "beat" as const,
      beatstarsLink: beat.beatstarsLink,
      duration: beat.duration || "3:00",
      genre: beat.genre,
      bpm: beat.bpm,
      key: beat.key,
    }

    if (playingTrackId === beat.id && isPlaying) {
      setPlayingTrackId(null)
      setCurrentTrack(null)
    } else {
      // Set up the queue with all tracks
      const trackQueue = activeBeats.map((b) => ({
        id: b.id,
        title: b.title,
        artist: b.producer,
        coverImage: b.coverImage,
        audioSrc: "/demo-beat.mp3",
        type: "beat" as const,
        beatstarsLink: b.beatstarsLink,
        duration: b.duration || "3:00",
        genre: b.genre,
        bpm: b.bpm,
        key: b.key,
      }))

      setQueue(trackQueue)
      setPlayingTrackId(beat.id)
      setCurrentTrack(track)
    }
  }

  const handlePlayAll = () => {
    if (activeBeats.length === 0) return

    const trackQueue = activeBeats.map((beat) => ({
      id: beat.id,
      title: beat.title,
      artist: beat.producer,
      coverImage: beat.coverImage,
      audioSrc: "/demo-beat.mp3",
      type: "beat" as const,
      beatstarsLink: beat.beatstarsLink,
      duration: beat.duration || "3:00",
      genre: beat.genre,
      bpm: beat.bpm,
      key: beat.key,
    }))

    setQueue(trackQueue)
    setCurrentTrack(trackQueue[0])
    setPlayingTrackId(trackQueue[0].id)
  }

  const formatDuration = (duration?: string) => {
    return duration || "3:00"
  }

  const isCurrentlyPlaying = (beatId: string) => {
    return currentTrack?.id === beatId && isPlaying
  }

  return (
    <section className="py-10 md:py-16 bg-gradient-to-b from-card/30 to-background animate-on-scroll">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-8 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center mb-4">
            <Music className="h-6 w-6 md:h-8 md:w-8 text-brand-500 mr-3" />
            <h2 className="text-2xl md:text-3xl font-bold font-heading">Latest Tracks</h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our complete collection of premium beats
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Header with Play All button */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button
                onClick={handlePlayAll}
                className="bg-brand-600 hover:bg-brand-500"
                disabled={activeBeats.length === 0}
              >
                <Play className="h-4 w-4 mr-2" />
                Play All
              </Button>
              <span className="text-sm text-muted-foreground">{activeBeats.length} tracks</span>
            </div>
          </div>

          {/* Tracklist */}
          <div className="bg-card rounded-xl overflow-hidden">
            {activeBeats.length === 0 ? (
              <div className="p-8 text-center">
                <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No tracks available</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {activeBeats.map((beat, index) => (
                  <motion.div
                    key={beat.id}
                    className="flex items-center gap-4 p-4 hover:bg-secondary/50 transition-colors group"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    {/* Track Number / Play Button */}
                    <div className="w-8 flex items-center justify-center">
                      <span className="text-sm text-muted-foreground group-hover:hidden">{index + 1}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hidden group-hover:flex text-brand-500 hover:text-brand-400"
                        onClick={() => handlePlayTrack(beat, index)}
                      >
                        {isCurrentlyPlaying(beat.id) ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                    </div>

                    {/* Track Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <div className="min-w-0 flex-1">
                          <h3
                            className={`font-medium truncate ${
                              isCurrentlyPlaying(beat.id) ? "text-brand-500" : "text-foreground"
                            }`}
                          >
                            {beat.title}
                          </h3>
                          <p className="text-sm text-muted-foreground truncate">{beat.producer}</p>
                        </div>
                      </div>
                    </div>

                    {/* Genre */}
                    <div className="hidden sm:block">
                      <Badge variant="outline" className="bg-secondary text-muted-foreground text-xs">
                        {beat.genre}
                      </Badge>
                    </div>

                    {/* BPM */}
                    <div className="hidden md:block w-16 text-center">
                      <span className="text-sm text-muted-foreground">{beat.bpm}</span>
                    </div>

                    {/* Key */}
                    <div className="hidden md:block w-20 text-center">
                      <span className="text-sm text-muted-foreground">{beat.key}</span>
                    </div>

                    {/* Duration */}
                    <div className="w-16 text-right">
                      <div className="flex items-center justify-end">
                        <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{formatDuration(beat.duration)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
