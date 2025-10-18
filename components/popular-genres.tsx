"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useBeats } from "@/components/beats-context"
import { useMemo, useRef } from "react"

// Backgrounds from public/img
const genreImages = [
  "/img/Alternative.png",
  "/img/CHILL.png",
  "/img/CLASSIC(Full HD).png",
  "/img/FUSION.png",
  "/img/Pop.png",
  "/img/CHILL.png",
  "/img/CLASSIC(Full HD).png",
  "/img/Pop.png",
  "/img/FUSION.png",
]

const ORDERED_GENRES = [
  "Alternative HipHop",
  "Alternative Rock",
  "Ambient",
  "Ambient Electronic",
  "Boom Bap / Old school",
  "Cinematic Emotional",
  "Electronic",
  "Funk",
  "FunkRock",
  "HipHop",
  "Indie",
  "Lo-Fi",
  "Rap",
  "Rock",
  "Synthwave",
  "Trip Hop",
]

const genreDescriptions: Record<string, string> = {
  "Alternative HipHop": "Leftfield hip-hop textures",
  "Alternative Rock": "Indie edges and electric grit",
  Ambient: "Dreamy ambient textures",
  "Ambient Electronic": "Spacey ambient electronics",
  "Boom Bap / Old school": "Golden-era grooves",
  "Cinematic Emotional": "Score-ready emotional cues",
  Electronic: "Futuristic electronic palettes",
  Funk: "Syncopated funk rhythms",
  FunkRock: "Guitar-driven funk energy",
  HipHop: "Classic hip-hop energy",
  Indie: "Indie-styled soundscapes",
  "Lo-Fi": "Chill lo-fi vibes",
  Rap: "Punchy rap instrumentals",
  Rock: "High-voltage rock riffs",
  Synthwave: "Retro synthwave vibes",
  "Trip Hop": "Dusty trip-hop atmospheres",
}

const genreMetadata = ORDERED_GENRES.map((genre, index) => ({
  name: genre,
  description: genreDescriptions[genre] || "",
  image: genreImages[index % genreImages.length],
}))

const allowedGenres = new Set(ORDERED_GENRES)

export default function PopularGenres() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const { beats, loading } = useBeats()

  const genres = useMemo(() => {
    const counts = new Map<string, number>()

    beats
      .filter((beat) => beat.status === "active")
      .forEach((beat) => {
        const beatGenres = new Set<string>()

        if (beat.genre && allowedGenres.has(beat.genre)) {
          beatGenres.add(beat.genre)
        }

        if (Array.isArray(beat.tags)) {
          beat.tags.forEach((tag) => {
            if (allowedGenres.has(tag)) {
              beatGenres.add(tag)
            }
          })
        }

        beatGenres.forEach((genre) => {
          counts.set(genre, (counts.get(genre) ?? 0) + 1)
        })
      })

    return genreMetadata
      .map((meta) => ({ ...meta, count: counts.get(meta.name) ?? 0 }))
      .sort((a, b) => b.count - a.count)
  }, [beats])

  const showSkeleton = loading && beats.length === 0

  const skeletonItems = genreMetadata.slice(0, 6)

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" })
    }
  }

  return (
    <div className="relative">
      {/* Desktop View with Horizontal Scroll */}
      <div className="hidden md:block relative">
        {genres.length > 0 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white"
              onClick={scrollLeft}
              aria-label="Scroll genres left"
            >
              <span className="sr-only">Scroll genres left</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white"
              onClick={scrollRight}
              aria-label="Scroll genres right"
            >
              <span className="sr-only">Scroll genres right</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 px-12"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {showSkeleton &&
            skeletonItems.map((item, index) => (
              <div key={item.name + index} className="flex-shrink-0 w-64">
                <div className="relative overflow-hidden rounded-xl aspect-square">
                  <Skeleton className="absolute inset-0 h-full w-full" />
                </div>
                <div className="mt-3 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </div>
            ))}

          {!showSkeleton &&
            genres.map((genre, index) => (
              <motion.div
                key={genre.name}
                className="flex-shrink-0 w-64"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Link href={`/beats?genre=${encodeURIComponent(genre.name)}`}>
                  <div className="group relative overflow-hidden rounded-xl aspect-square">
                    <img
                      src={genre.image || "/placeholder.svg"}
                      alt={genre.name}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="font-bold text-lg text-white mb-1 group-hover:text-brand-400 transition-colors">
                        {genre.name}
                      </h3>
                      <p className="text-sm text-gray-300 mb-1">{genre.description}</p>
                      <p className="text-xs text-brand-400 font-medium">{genre.count} beats</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
        </div>
      </div>

      {/* Mobile View with Horizontal Scroll */}
      <div className="md:hidden">
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
          {showSkeleton &&
            skeletonItems.slice(0, 4).map((item, index) => (
              <div key={item.name + index} className="flex-shrink-0 w-32 space-y-2">
                <div className="relative overflow-hidden rounded-xl aspect-square">
                  <Skeleton className="absolute inset-0 h-full w-full" />
                </div>
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}

          {!showSkeleton &&
            genres.map((genre, index) => (
              <motion.div
                key={genre.name}
                className="flex-shrink-0 w-32"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Link href={`/beats?genre=${encodeURIComponent(genre.name)}`}>
                  <div className="group relative overflow-hidden rounded-xl aspect-square">
                    <img
                      src={genre.image || "/placeholder.svg"}
                      alt={genre.name}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h3 className="font-bold text-sm text-white mb-1 group-hover:text-brand-400 transition-colors">
                        {genre.name}
                      </h3>
                      <p className="text-xs text-brand-400 font-medium">{genre.count} beats</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
        </div>
      </div>
    </div>
  )
}
