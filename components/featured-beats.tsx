"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Play, Pause, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAudioPlayer } from "@/components/audio-player-context"
import MobileScrollContainer from "@/components/mobile-scroll-container"

// Mock data for featured beats
const featuredBeats = [
  {
    id: "7",
    title: "Astral Plane",
    producer: "Cat Matilda Beat",
    coverImage: "/placeholder.svg?height=400&width=400",
    price: 39.99,
    bpm: 110,
    key: "B Minor",
    genre: "Electronic",
    duration: "3:35",
    tags: ["Atmospheric", "Electronic", "Chill"],
    beatstarsLink: "https://beatstars.com/catmatildabeat/astral-plane",
  },
  {
    id: "8",
    title: "Golden Hour",
    producer: "Cat Matilda Beat",
    coverImage: "/placeholder.svg?height=400&width=400",
    price: 34.99,
    bpm: 92,
    key: "A Major",
    genre: "Lo-Fi",
    duration: "2:48",
    tags: ["Chill", "Lo-Fi", "Jazzy"],
    beatstarsLink: "https://beatstars.com/catmatildabeat/golden-hour",
  },
  {
    id: "9",
    title: "Neon City",
    producer: "Cat Matilda Beat",
    coverImage: "/placeholder.svg?height=400&width=400",
    price: 29.99,
    bpm: 125,
    key: "G Minor",
    genre: "Synthwave",
    duration: "3:22",
    tags: ["Retro", "Synthwave", "Electronic"],
    beatstarsLink: "https://beatstars.com/catmatildabeat/neon-city",
  },
  {
    id: "10",
    title: "Rainy Days",
    producer: "Cat Matilda Beat",
    coverImage: "/placeholder.svg?height=400&width=400",
    price: 24.99,
    bpm: 75,
    key: "E Minor",
    genre: "Lo-Fi",
    duration: "2:55",
    tags: ["Melancholic", "Lo-Fi", "Chill"],
    beatstarsLink: "https://beatstars.com/catmatildabeat/rainy-days",
  },
  {
    id: "11",
    title: "Urban Jungle",
    producer: "Cat Matilda Beat",
    coverImage: "/placeholder.svg?height=400&width=400",
    price: 32.99,
    bpm: 145,
    key: "D Minor",
    genre: "Trap",
    duration: "3:10",
    tags: ["Hard", "Trap", "Dark"],
    beatstarsLink: "https://beatstars.com/catmatildabeat/urban-jungle",
  },
  {
    id: "12",
    title: "Sunset Drive",
    producer: "Cat Matilda Beat",
    coverImage: "/placeholder.svg?height=400&width=400",
    price: 27.99,
    bpm: 105,
    key: "C Major",
    genre: "R&B",
    duration: "3:42",
    tags: ["Smooth", "R&B", "Chill"],
    beatstarsLink: "https://beatstars.com/catmatildabeat/sunset-drive",
  },
]

export default function FeaturedBeats() {
  const [playingId, setPlayingId] = useState<string | null>(null)
  const { setCurrentTrack } = useAudioPlayer()

  const handlePlay = (beat: any) => {
    if (playingId === beat.id) {
      setPlayingId(null)
      setCurrentTrack(null)
    } else {
      setPlayingId(beat.id)
      setCurrentTrack({
        id: beat.id,
        title: beat.title,
        artist: beat.producer,
        coverImage: beat.coverImage,
        audioSrc: "/demo-beat.mp3", // In a real app, this would be the actual beat audio
        type: "beat",
      })
    }
  }

  return (
    <MobileScrollContainer>
      {featuredBeats.map((beat) => (
        <div key={beat.id} className="group relative flex-shrink-0 w-72 md:w-auto">
          <Link href={`/beats/${beat.id}`} className="block">
            <div className="beat-card card-hover-effect group">
              <div className="relative overflow-hidden rounded-t-xl">
                <Image
                  src={beat.coverImage || "/placeholder.svg"}
                  alt={beat.title}
                  width={400}
                  height={400}
                  className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />

                {/* Overlay that appears on hover */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Button
                    className="bg-white/90 hover:bg-white text-black rounded-full h-16 w-16 flex items-center justify-center shadow-lg transform transition-transform hover:scale-110"
                    onClick={(e) => {
                      e.preventDefault()
                      handlePlay(beat)
                    }}
                  >
                    {playingId === beat.id ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
                  </Button>
                </div>

                {/* Beat info overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 md:p-4">
                  <div className="flex justify-between items-center mb-1 md:mb-2">
                    <div className="flex items-center space-x-1 md:space-x-2">
                      <Badge className="bg-white/20 backdrop-blur-sm text-white text-xs border-0">{beat.bpm} BPM</Badge>
                      <Badge className="bg-white/20 backdrop-blur-sm text-white text-xs border-0">{beat.key}</Badge>
                    </div>
                    <div className="flex items-center text-white text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {beat.duration}
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
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      const link = beat.beatstarsLink || "https://beatstars.com/catmatildabeat"
                      window.open(link, "_blank")
                    }}
                  >
                    Buy on BeatStars
                  </Button>
                </div>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </MobileScrollContainer>
  )
}
