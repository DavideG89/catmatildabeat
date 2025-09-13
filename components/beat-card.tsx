"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { Play, Pause, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAudioPlayer } from "@/components/audio-player-context"
import { motion } from "framer-motion"

interface BeatCardProps {
  beat: {
    id: string
    title: string
    producer: string
    coverImage: string
    price?: number
    bpm: number
    key: string
    genre: string
    tags: string[]
    beatstarsLink?: string
    audioFile?: string
    duration?: string
  }
  onClick?: (e: React.MouseEvent) => void
}

export default function BeatCard({ beat, onClick }: BeatCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const { currentTrack, isPlaying, playTrack, togglePlayPause } = useAudioPlayer()
  const cardRef = useRef<HTMLDivElement>(null)

  // Check if this card's track is currently playing
  const isThisTrackPlaying = isPlaying && currentTrack?.id === beat.id

  const handlePlayTrack = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (currentTrack?.id === beat.id) {
      togglePlayPause()
    } else {
      console.log('Beat card - beat data:', beat)
      console.log('Beat card - duration from database:', beat.duration)
      playTrack({
        id: beat.id,
        title: beat.title,
        artist: beat.producer,
        audioSrc: beat.audioFile || "/demo-beat.mp3",
        coverImage: beat.coverImage,
        beatstarsLink: beat.beatstarsLink,
        durationString: beat.duration,
      })
    }
  }

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const link = beat.beatstarsLink || "https://beatstars.com/catmatildabeat"
    window.open(link, "_blank")
  }

  const handleCardClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick(e)
    }
  }

  return (
    <div onClick={handleCardClick} className="block cursor-pointer">
      <motion.div
        ref={cardRef}
        className="group bg-card rounded-xl overflow-hidden border border-black hover:shadow-xl transition-all duration-300"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={beat.coverImage || "/placeholder.svg"}
            alt={beat.title}
            width={400}
            height={400}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Overlay that appears on hover */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered || isThisTrackPlaying ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              className="bg-white/90 hover:bg-white text-black rounded-full h-16 w-16 flex items-center justify-center shadow-lg transform transition-transform hover:scale-110"
              onClick={handlePlayTrack}
              aria-label={isThisTrackPlaying ? "Pause" : "Play"}
            >
              {isThisTrackPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
            </Button>
          </motion.div>

          {/* Beat info overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 md:p-4">
            <div className="flex justify-between items-center mb-1 md:mb-2">
              <div className="flex items-center space-x-1 md:space-x-2">
                <Badge className="bg-white/20 backdrop-blur-sm text-white text-xs border-0">{beat.bpm} BPM</Badge>
                <Badge className="bg-white/20 backdrop-blur-sm text-white text-xs border-0">{beat.key}</Badge>
                <Badge className="bg-white/20 backdrop-blur-sm text-white text-xs border-0">{beat.genre}</Badge>
              </div>
            </div>
            <h3 className="font-bold text-base md:text-lg text-white line-clamp-1">{beat.title}</h3>
            <p className="text-xs md:text-sm text-gray-300">{beat.producer}</p>
          </div>
        </div>

        <div className="p-3 md:p-4 bg-card">
          <div className="flex flex-wrap gap-1 md:gap-2 mb-3">
            {beat.tags.slice(0, 2).map((tag, index) => (
              <Badge key={index} variant="outline" className="bg-secondary text-muted-foreground text-xs">
                {tag}
              </Badge>
            ))}
            {beat.tags.length > 2 && (
              <Badge variant="outline" className="bg-secondary text-muted-foreground text-xs">
                +{beat.tags.length - 2}
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePlayTrack}
              className="text-brand-500 hover:text-brand-400 hover:bg-brand-500/10 px-3"
            >
              {isThisTrackPlaying ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
              {isThisTrackPlaying ? "Pause" : "Play"}
            </Button>

            <Button
              size="sm"
              variant="cta"
              className="transition-colors text-xs h-8"
              onClick={handleBuyNow}
            >
              <ExternalLink className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
              <span>Buy on BeatStars</span>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
