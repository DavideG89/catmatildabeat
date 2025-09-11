"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import BeatCard from "@/components/beat-card"

// Mock data - in a real app, this would come from an API based on the current beat
const relatedBeats = [
  {
    id: "2",
    title: "Summer Vibes",
    producer: "Cat Matilda Beat",
    coverImage: "/placeholder.svg?height=400&width=400&text=Summer+Vibes",
    price: 24.99,
    bpm: 95,
    key: "G Major",
    genre: "R&B",
    tags: ["R&B", "Chill", "Summer"],
    beatstarsLink: "https://beatstars.com/catmatildabeat",
  },
  {
    id: "3",
    title: "Urban Legend",
    producer: "Cat Matilda Beat",
    coverImage: "/placeholder.svg?height=400&width=400&text=Urban+Legend",
    price: 34.99,
    bpm: 160,
    key: "F Minor",
    genre: "Hip Hop",
    tags: ["Hip Hop", "Hard", "Urban"],
    beatstarsLink: "https://beatstars.com/catmatildabeat",
  },
  {
    id: "4",
    title: "Neon Lights",
    producer: "Cat Matilda Beat",
    coverImage: "/placeholder.svg?height=400&width=400&text=Neon+Lights",
    price: 27.99,
    bpm: 128,
    key: "A Minor",
    genre: "Pop",
    tags: ["Pop", "Upbeat", "Electronic"],
    beatstarsLink: "https://beatstars.com/catmatildabeat",
  },
  {
    id: "1",
    title: "Midnight Vibes",
    producer: "Cat Matilda Beat",
    coverImage: "/placeholder.svg?height=400&width=400&text=Midnight+Vibes",
    price: 29.99,
    bpm: 140,
    key: "C Minor",
    genre: "Hip Hop",
    tags: ["Hip Hop", "Dark", "Atmospheric"],
    beatstarsLink: "https://beatstars.com/catmatildabeat",
  },
]

interface RelatedBeatsProps {
  currentBeatId: string
}

export default function RelatedBeats({ currentBeatId }: RelatedBeatsProps) {
  const router = useRouter()

  // Filter out the current beat and limit to 3 results
  const filteredBeats = relatedBeats.filter((beat) => beat.id !== currentBeatId).slice(0, 3)

  const handleBeatClick = (beatId: string, e: React.MouseEvent) => {
    // Prevent any parent click handlers
    e.preventDefault()
    e.stopPropagation()

    // Navigate to the beat detail page
    router.push(`/beats/${beatId}`)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {filteredBeats.map((beat) => (
        <div key={beat.id} onClick={(e) => handleBeatClick(beat.id, e)} className="cursor-pointer">
          <BeatCard beat={beat} />
        </div>
      ))}
    </div>
  )
}
