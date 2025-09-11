"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRef } from "react"

const genres = [
  {
    name: "Trap",
    image: "/placeholder.svg?height=400&width=400&text=Trap",
    count: 124,
    description: "Hard-hitting trap beats",
  },
  {
    name: "Hip Hop",
    image: "/placeholder.svg?height=400&width=400&text=Hip+Hop",
    count: 98,
    description: "Classic hip hop vibes",
  },
  {
    name: "R&B",
    image: "/placeholder.svg?height=400&width=400&text=R%26B",
    count: 76,
    description: "Smooth R&B grooves",
  },
  {
    name: "Drill",
    image: "/placeholder.svg?height=400&width=400&text=Drill",
    count: 60,
    description: "Aggressive drill energy",
  },
  {
    name: "Pop",
    image: "/placeholder.svg?height=400&width=400&text=Pop",
    count: 85,
    description: "Radio-ready pop hits",
  },
  {
    name: "Afrobeat",
    image: "/placeholder.svg?height=400&width=400&text=Afrobeat",
    count: 45,
    description: "African rhythms",
  },
  {
    name: "Electronic",
    image: "/placeholder.svg?height=400&width=400&text=Electronic",
    count: 70,
    description: "Electronic soundscapes",
  },
  {
    name: "Lo-Fi",
    image: "/placeholder.svg?height=400&width=400&text=Lo-Fi",
    count: 55,
    description: "Chill lo-fi vibes",
  },
  {
    name: "UK Drill",
    image: "/placeholder.svg?height=400&width=400&text=UK+Drill",
    count: 42,
    description: "UK drill energy",
  },
  {
    name: "Synthwave",
    image: "/placeholder.svg?height=400&width=400&text=Synthwave",
    count: 38,
    description: "Retro synthwave vibes",
  },
]

export default function PopularGenres() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

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
        {/* Scroll Buttons */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white"
          onClick={scrollLeft}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white"
          onClick={scrollRight}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 px-12"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {genres.map((genre, index) => (
            <motion.div
              key={genre.name}
              className="flex-shrink-0 w-64"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Link href={`/beats?genre=${genre.name.toLowerCase()}`}>
                <div className="group relative overflow-hidden rounded-xl aspect-square">
                  <Image
                    src={genre.image || "/placeholder.svg"}
                    alt={genre.name}
                    fill
                    sizes="256px"
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
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
          {genres.map((genre, index) => (
            <motion.div
              key={genre.name}
              className="flex-shrink-0 w-32"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Link href={`/beats?genre=${genre.name.toLowerCase()}`}>
                <div className="group relative overflow-hidden rounded-xl aspect-square">
                  <Image
                    src={genre.image || "/placeholder.svg"}
                    alt={genre.name}
                    fill
                    sizes="128px"
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
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
