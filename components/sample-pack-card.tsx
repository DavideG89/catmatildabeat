"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { Play, Pause, ShoppingCart, FileAudio } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAudioPlayer } from "@/components/audio-player-context"
import { motion } from "framer-motion"

interface SamplePackCardProps {
  pack: {
    id: string
    title: string
    producer: string
    coverImage: string
    price: number
    description: string
    genre: string
    tags: string[]
    sampleCount: number
  }
}

export default function SamplePackCard({ pack }: SamplePackCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const { setCurrentTrack, currentTrack, isPlaying: globalIsPlaying } = useAudioPlayer()
  const cardRef = useRef<HTMLDivElement>(null)

  // Check if this card's track is currently playing
  const isThisTrackPlaying = globalIsPlaying && currentTrack?.id === pack.id && currentTrack?.type === "sample-pack"

  const handlePlayPreview = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Set the current track in the global audio player
    if (!isThisTrackPlaying) {
      setCurrentTrack({
        title: pack.title,
        artist: pack.producer,
        coverImage: pack.coverImage,
        audioSrc: "/demo-beat.mp3", // In a real app, this would be the actual preview audio
        id: pack.id,
        type: "sample-pack",
      })
    } else {
      // If it's already playing, we'll let the audio context handle pausing
      setCurrentTrack(null)
    }
  }

  return (
    <motion.div
      ref={cardRef}
      className="beat-card card-hover-effect"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => (window.location.href = `/samples/${pack.id}`)}
    >
      <div className="relative">
        <Image
          src={pack.coverImage || "/placeholder.svg"}
          alt={pack.title}
          width={400}
          height={400}
          className="beat-card-image"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <motion.div
          className="absolute top-4 right-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered || isThisTrackPlaying ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            className="bg-brand-500 hover:bg-brand-400 rounded-full h-9 w-9 md:h-10 md:w-10 flex items-center justify-center"
            onClick={handlePlayPreview}
            aria-label={isThisTrackPlaying ? "Pause" : "Play"}
          >
            {isThisTrackPlaying ? (
              <Pause className="h-4 w-4 md:h-5 md:w-5" />
            ) : (
              <Play className="h-4 w-4 md:h-5 md:w-5" />
            )}
          </Button>
        </motion.div>
      </div>

      <div className="p-3 md:p-4 xs-p-2">
        <h3 className="font-bold text-base md:text-lg mb-1 line-clamp-1">{pack.title}</h3>
        <p className="text-xs md:text-sm text-muted-foreground mb-2">{pack.producer}</p>

        <div className="flex flex-wrap gap-1 md:gap-2 mb-3 xs-gap-1">
          <Badge variant="outline" className="bg-secondary text-muted-foreground text-xs xs-text-xs">
            {pack.genre}
          </Badge>
          {pack.tags.slice(0, 1).map((tag, index) => (
            <Badge key={index} variant="outline" className="bg-secondary text-muted-foreground text-xs xs-text-xs">
              {tag}
            </Badge>
          ))}
          {pack.tags.length > 1 && (
            <Badge variant="outline" className="bg-secondary text-muted-foreground text-xs xs-text-xs">
              +{pack.tags.length - 1}
            </Badge>
          )}
        </div>

        <p className="text-muted-foreground mb-3 text-xs md:text-sm line-clamp-2 xs-hidden">{pack.description}</p>

        <div className="flex items-center text-xs text-muted-foreground mb-3">
          <FileAudio className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
          <span>{pack.sampleCount} samples</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="font-bold text-sm md:text-base">${pack.price}</span>
          <Button
            size="sm"
            className="bg-brand-600 hover:bg-brand-500 transition-colors text-xs h-8"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              // Handle buy action
              window.location.href = `/checkout?sample=${pack.id}`
            }}
          >
            <ShoppingCart className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
            <span className="xs-hidden">Buy Now</span>
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
