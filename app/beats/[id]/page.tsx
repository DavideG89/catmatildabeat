"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import AudioPlayer from "@/components/audio-player"
import RelatedBeats from "@/components/related-beats"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import { useBeats } from "@/components/beats-context"

export default function BeatDetailPage({ params }: { params: { id: string } }) {
  const { beats } = useBeats()
  const [beat, setBeat] = useState<any>(null)

  useEffect(() => {
    const foundBeat = beats.find((b) => b.id === params.id)
    if (foundBeat) {
      setBeat(foundBeat)
    }
  }, [params.id, beats])

  if (!beat) {
    return (
      <div className="container mx-auto px-4 py-6 md:py-12 mb-24">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Beat not found</h1>
          <p className="text-muted-foreground">The beat you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  const handleBuyNow = () => {
    if (beat.beatstarsLink) {
      window.open(beat.beatstarsLink, "_blank")
    } else {
      window.open("https://beatstars.com/catmatildabeat", "_blank")
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-12 mb-24">
      <div className="flex flex-col lg:flex-row gap-6 md:gap-12">
        {/* Left Column - Beat Info */}
        <div className="w-full lg:w-2/3">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 mb-6 md:mb-8">
            <div className="w-full md:w-1/3">
              <Image
                src={beat.coverImage || "/placeholder.svg"}
                alt={beat.title}
                width={500}
                height={500}
                className="w-full h-auto rounded-xl"
              />
            </div>
            <div className="w-full md:w-2/3">
              <h1 className="text-2xl md:text-3xl font-bold mb-2 font-heading">{beat.title}</h1>
              <p className="text-muted-foreground mb-4">Produced by {beat.producer}</p>

              <div className="flex flex-wrap gap-2 mb-6">
                {beat.tags.map((tag: string, index: number) => (
                  <Badge key={index} variant="outline" className="bg-secondary text-muted-foreground">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="mb-6">
                <AudioPlayer />
              </div>

              <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6">
                <div className="bg-card p-3 rounded-lg text-center">
                  <p className="text-xs md:text-sm text-muted-foreground">BPM</p>
                  <p className="font-bold text-sm md:text-base">{beat.bpm}</p>
                </div>
                <div className="bg-card p-3 rounded-lg text-center">
                  <p className="text-xs md:text-sm text-muted-foreground">Key</p>
                  <p className="font-bold text-sm md:text-base">{beat.key}</p>
                </div>
                <div className="bg-card p-3 rounded-lg text-center">
                  <p className="text-xs md:text-sm text-muted-foreground">Genre</p>
                  <p className="font-bold text-sm md:text-base">{beat.genre}</p>
                </div>
              </div>
            </div>
          </div>

          {beat.description && (
            <div className="mb-8 md:mb-12">
              <h2 className="text-xl font-bold mb-4 font-heading">Description</h2>
              <p className="text-muted-foreground text-sm md:text-base">{beat.description}</p>
            </div>
          )}

          <div>
            <h2 className="text-xl font-bold mb-6 font-heading">You Might Also Like</h2>
            <RelatedBeats currentBeatId={beat.id} />
          </div>
        </div>

        {/* Right Column - Purchase Options */}
        <div className="w-full lg:w-1/3">
          <div className="bg-card rounded-xl p-4 md:p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-6 font-heading">Get This Beat</h2>

            <div className="text-center mb-6">
              <div className="text-3xl font-bold mb-2">${beat.price}</div>
              <p className="text-muted-foreground text-sm">Available on BeatStars</p>
            </div>

            <Button size="lg" className="w-full bg-brand-600 hover:bg-brand-500 mb-4" onClick={handleBuyNow}>
              <ExternalLink className="mr-2 h-5 w-5" />
              Buy on BeatStars
            </Button>

            <div className="text-center text-sm text-gray-400">
              <p>Secure payment via BeatStars</p>
              <p className="mt-1">Instant delivery after purchase</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
