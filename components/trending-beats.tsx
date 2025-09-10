"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import BeatCard from "@/components/beat-card"
import MobileScrollContainer from "@/components/mobile-scroll-container"

// Mock data for trending beats
const trendingBeats = [
  {
    id: "1",
    title: "Midnight Dreams",
    producer: "Cat Matilda Beat",
    coverImage: "/placeholder.svg?height=400&width=400",
    price: 29.99,
    bpm: 140,
    key: "C Minor",
    genre: "Trap",
    duration: "2:45",
    tags: ["Dark", "Emotional", "Trap"],
    beatstarsLink: "https://beatstars.com/catmatildabeat/midnight-dreams",
  },
  {
    id: "2",
    title: "Summer Vibes",
    producer: "Cat Matilda Beat",
    coverImage: "/placeholder.svg?height=400&width=400",
    price: 24.99,
    bpm: 95,
    key: "G Major",
    genre: "R&B",
    duration: "3:12",
    tags: ["Chill", "Summer", "R&B"],
    beatstarsLink: "https://beatstars.com/catmatildabeat/summer-vibes",
  },
  {
    id: "3",
    title: "Urban Legend",
    producer: "Cat Matilda Beat",
    coverImage: "/placeholder.svg?height=400&width=400",
    price: 34.99,
    bpm: 160,
    key: "F Minor",
    genre: "Hip Hop",
    duration: "2:58",
    tags: ["Hard", "Urban", "Hip Hop"],
    beatstarsLink: "https://beatstars.com/catmatildabeat/urban-legend",
  },
  {
    id: "4",
    title: "Neon Lights",
    producer: "Cat Matilda Beat",
    coverImage: "/placeholder.svg?height=400&width=400",
    price: 27.99,
    bpm: 128,
    key: "A Minor",
    genre: "Pop",
    duration: "3:24",
    tags: ["Upbeat", "Electronic", "Pop"],
    beatstarsLink: "https://beatstars.com/catmatildabeat/neon-lights",
  },
  {
    id: "5",
    title: "Cosmic Journey",
    producer: "Cat Matilda Beat",
    coverImage: "/placeholder.svg?height=400&width=400",
    price: 39.99,
    bpm: 85,
    key: "E Minor",
    genre: "Ambient",
    duration: "4:15",
    tags: ["Spacey", "Chill", "Ambient"],
    beatstarsLink: "https://beatstars.com/catmatildabeat/cosmic-journey",
  },
  {
    id: "6",
    title: "Street Dreams",
    producer: "Cat Matilda Beat",
    coverImage: "/placeholder.svg?height=400&width=400",
    price: 32.99,
    bpm: 90,
    key: "D Minor",
    genre: "Boom Bap",
    duration: "3:05",
    tags: ["Old School", "Hip Hop", "Boom Bap"],
    beatstarsLink: "https://beatstars.com/catmatildabeat/street-dreams",
  },
]

export default function TrendingBeats() {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <MobileScrollContainer>
      {trendingBeats.map((beat) => (
        <motion.div
          key={beat.id}
          variants={item}
          onHoverStart={() => setHoveredId(beat.id)}
          onHoverEnd={() => setHoveredId(null)}
          className="flex-shrink-0 w-72 md:w-auto"
        >
          <BeatCard beat={beat} />
        </motion.div>
      ))}
    </MobileScrollContainer>
  )
}
