"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import BeatCard from "@/components/beat-card"
import { useBeats } from "@/components/beats-context"

interface RelatedBeatsProps {
  currentBeatId: string
}

export default function RelatedBeats({ currentBeatId }: RelatedBeatsProps) {
  const router = useRouter()
  const { beats } = useBeats()

  // Find current beat and compute related ones from real data
  const current = beats.find((b) => b.id === currentBeatId)
  let candidates = beats.filter((b) => b.id !== currentBeatId && b.status === "active")

  if (current?.genre) {
    const sameGenre = candidates.filter((b) => b.genre === current.genre)
    const others = candidates.filter((b) => b.genre !== current.genre)
    candidates = [...sameGenre, ...others]
  }

  const related = candidates.slice(0, 3)

  const handleBeatClick = (beatId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    router.push(`/beats/${beatId}`)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {related.map((beat) => (
        <div key={beat.id} onClick={(e) => handleBeatClick(beat.id, e)} className="cursor-pointer">
          <BeatCard
            beat={{
              id: beat.id,
              title: beat.title,
              producer: beat.producer,
              coverImage: beat.cover_image,
              price: beat.price || 0,
              bpm: beat.bpm,
              key: beat.key,
              genre: beat.genre,
              tags: beat.tags || [],
              beatstarsLink: beat.beatstars_link,
              audioFile: beat.audio_file,
              duration: beat.duration,
            }}
          />
        </div>
      ))}
    </div>
  )
}
