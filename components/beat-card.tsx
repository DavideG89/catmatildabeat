"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
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
    price: number
    bpm: number
    key: string
    genre: string
    tags: string[]
    beatstarsLink?: string
  }
}

export default function BeatCard({ beat }: BeatCardProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const { setCurrentTrack, currentTrack, isPlaying: globalIsPlaying } = useAudioPlayer()
  const cardRef = useRef<HTMLDivElement>(null)

  // Check if this card's track is currently playing
  const isThisTrackPlaying = globalIsPlaying && currentTrack?.id === beat.id && currentTrack?.type === "beat"

  const togglePlay = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Update local state
    setIsPlaying(!isThisTrackPlaying)

    // Set the current track in the global audio player
    if (!isThisTrackPlaying) {
      setCurrentTrack({
        title: beat.title,
        artist: beat.producer,
        coverImage: beat.coverImage,
        audioSrc: "/demo-beat.mp3", // In a real app, this would be the actual beat audio
        id: beat.id,
        type: "beat",
      })
    } else {
      // If it's already playing, we'll let the audio context handle pausing
      setCurrentTrack(null)
    }
  }

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // Redirect to BeatStars
    const link = beat.beatstarsLink || "https://beatstars.com/catmatildabeat"
    window.open(link, "_blank")
  }

  return (
    <Link href={`/beats/${beat.id}`} className="block">
      <motion.div
        ref={cardRef}
        className="beat-card card-hover-effect group"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <div className="relative overflow-hidden rounded-t-xl">
          <Image
            src={beat.coverImage || "/placeholder.svg"}
            alt={beat.title}
            width={400}
            height={400}
            className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-110"
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
              onClick={togglePlay}
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
              </div>
            </div>
            <h3 className="font-bold text-base md:text-lg text-white line-clamp-1">{beat.title}</h3>
            <p className="text-xs md:text-sm text-gray-300">{beat.producer}</p>
          </div>
        </div>

        <div className="p-3 md:p-4 bg-card rounded-b-xl">
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

          <div className="flex justify-start">
            <Button
              size="sm"
              className="bg-brand-600 hover:bg-brand-500 transition-colors text-xs h-8"
              onClick={handleBuyNow}
            >
              <ExternalLink className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
              <span>Buy on BeatStars</span>
            </Button>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
