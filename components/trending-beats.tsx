"use client"

import { useState, useEffect } from "react"
import BeatCard from "@/components/beat-card"
import { useBeats } from "@/components/beats-context"

export default function TrendingBeats() {
  const { getBeatsByCategory } = useBeats()
  const [trendingBeats, setTrendingBeats] = useState<any[]>([])

  useEffect(() => {
    const beats = getBeatsByCategory("trending").slice(0, 6)
    setTrendingBeats(beats)
  }, [getBeatsByCategory])

  if (trendingBeats.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No trending beats available at the moment.</p>
      </div>
    )
  }

  return (
    <>
      {trendingBeats.map((beat) => (
        <div key={beat.id} className="w-[85vw] sm:w-[75vw] md:w-auto flex-shrink-0 snap-start">
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
              tags: beat.tags,
              beatstarsLink: beat.beatstars_link,
              audioFile: beat.audio_file,
              duration: beat.duration,
            }}
          />
        </div>
      ))}
    </>
  )
}
