"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import RelatedBeats from "@/components/related-beats"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Play, Pause } from "lucide-react"
import { useBeats } from "@/components/beats-context"
import { useAudioPlayer } from "@/components/audio-player-context"

interface Beat {
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
  description?: string
  audioFile?: string
  duration?: string
}

// Mock data fallback for when Supabase data isn't available
const mockBeats: Beat[] = [
  {
    id: "1",
    title: "Midnight Vibes",
    producer: "Cat Matilda Beat",
    coverImage: "/placeholder.svg?height=500&width=500&text=Midnight+Vibes",
    price: 29.99,
    bpm: 140,
    key: "C Minor",
    genre: "Alternative HipHop",
    tags: ["Alternative HipHop", "Dark", "Atmospheric"],
    description:
      "A dark and atmospheric alternative hip-hop beat perfect for late night sessions. Features deep bass lines and haunting melodies that create the perfect backdrop for introspective lyrics.",
    beatstarsLink: "https://beatstars.com/catmatildabeat",
  },
  {
    id: "2",
    title: "Summer Vibes",
    producer: "Cat Matilda Beat",
    coverImage: "/placeholder.svg?height=500&width=500&text=Summer+Vibes",
    price: 24.99,
    bpm: 95,
    key: "G Major",
    genre: "Ambient",
    tags: ["Ambient", "Chill", "Summer"],
    description:
      "A smooth ambient beat with summer vibes. Perfect for laid-back vocals and chill sessions with warm, nostalgic melodies.",
    beatstarsLink: "https://beatstars.com/catmatildabeat",
  },
  {
    id: "3",
    title: "Urban Legend",
    producer: "Cat Matilda Beat",
    coverImage: "/placeholder.svg?height=500&width=500&text=Urban+Legend",
    price: 34.99,
    bpm: 160,
    key: "F Minor",
    genre: "HipHop",
    tags: ["HipHop", "Hard", "Urban"],
    description:
      "Hard-hitting urban beat with aggressive drums and street-ready energy. Built for powerful vocals and commanding presence.",
    beatstarsLink: "https://beatstars.com/catmatildabeat",
  },
  {
    id: "4",
    title: "Neon Lights",
    producer: "Cat Matilda Beat",
    coverImage: "/placeholder.svg?height=500&width=500&text=Neon+Lights",
    price: 27.99,
    bpm: 128,
    key: "A Minor",
    genre: "Synthwave",
    tags: ["Synthwave", "Upbeat", "Electronic"],
    description:
      "Upbeat pop beat with electronic elements and catchy melodies. Perfect for radio-ready tracks with commercial appeal.",
    beatstarsLink: "https://beatstars.com/catmatildabeat",
  },
]

export default function BeatDetailPage({ params }: { params: { id: string } }) {
  const { beats, loading } = useBeats()
  const { setCurrentTrack, currentTrack, isPlaying, togglePlayPause } = useAudioPlayer()
  const [beat, setBeat] = useState<Beat | null>(null)

  useEffect(() => {
    // First try to find beat in Supabase data
    if (!loading && beats.length > 0) {
      const foundBeat = beats.find((b) => b.id === params.id)
      if (foundBeat) {
        setBeat({
          id: foundBeat.id,
          title: foundBeat.title,
          producer: foundBeat.producer,
          coverImage: foundBeat.cover_image,
          price: foundBeat.price,
          bpm: foundBeat.bpm,
          key: foundBeat.key,
          genre: foundBeat.genre,
          tags: foundBeat.tags,
          beatstarsLink: foundBeat.beatstars_link,
          description: foundBeat.description,
          audioFile: foundBeat.audio_file,
        })
        return
      }
    }

    // Fallback to mock data if not found in Supabase
    const mockBeat = mockBeats.find((b) => b.id === params.id)
    if (mockBeat) {
      setBeat(mockBeat)
    }
  }, [params.id, beats, loading])

  // Check if this beat is currently playing
  const isThisBeatPlaying = currentTrack?.id === beat?.id && currentTrack?.type === "beat"

  const handlePlayPause = () => {
    if (!beat) return

    if (isThisBeatPlaying) {
      togglePlayPause()
    } else {
      // Set this beat as the current track
      setCurrentTrack({
        id: beat.id,
        title: beat.title,
        artist: beat.producer,
        coverImage: beat.coverImage,
        audioSrc: beat.audioFile || "/demo-beat.mp3",
        type: "beat",
        beatstarsLink: beat.beatstarsLink,
        durationString: beat.duration,
      })
    }
  }

  const handleBuyNow = () => {
    if (beat?.beatstarsLink) {
      window.open(beat.beatstarsLink, "_blank")
    } else {
      window.open("https://beatstars.com/catmatildabeat", "_blank")
    }
  }

  if (loading && !beat) {
    return (
      <div className="container mx-auto px-4 py-6 md:py-12 mb-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading beat...</p>
        </div>
      </div>
    )
  }

  if (!beat) {
    return (
      <div className="container mx-auto px-4 py-6 md:py-12 mb-24">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Beat not found</h1>
          <p className="text-muted-foreground">The beat you're looking for doesn't exist.</p>
          <Button className="mt-4" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-12 mb-24">
      <div className="flex flex-col lg:flex-row gap-6 md:gap-12">
        {/* Left Column - Beat Info */}
        <div className="w-full lg:w-2/3">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 mb-6 md:mb-8">
            <div className="w-full md:w-1/3">
              <div className="relative group">
                <Image
                  src={beat.coverImage || "/placeholder.svg?height=500&width=500"}
                  alt={beat.title}
                  width={500}
                  height={500}
                  className="w-full h-auto rounded-xl"
                />
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                  <Button
                    className="bg-white/90 hover:bg-white text-black rounded-full h-16 w-16 flex items-center justify-center shadow-lg transform transition-transform hover:scale-110"
                    onClick={handlePlayPause}
                  >
                    {isThisBeatPlaying && isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
                  </Button>
                </div>
              </div>
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
                <Button
                  onClick={handlePlayPause}
                  className="bg-brand-600 hover:bg-brand-500 text-white px-6 py-2 rounded-lg flex items-center gap-2"
                >
                  {isThisBeatPlaying && isPlaying ? (
                    <>
                      <Pause className="h-4 w-4" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      Play Preview
                    </>
                  )}
                </Button>
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
              <p className="text-muted-foreground text-sm">Available on BeatStars</p>
            </div>

            <Button size="lg" variant="cta" className="w-full mb-4" onClick={handleBuyNow}>
              <ExternalLink className="mr-2 h-5 w-5" />
              Buy on BeatStars
            </Button>

            <div className="text-center text-sm text-gray-400">
              <p>Secure payment via BeatStars</p>
              <p className="mt-1">Instant delivery after purchase</p>
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <h3 className="font-semibold mb-3">License Options Available:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Basic License</li>
                <li>• Premium License</li>
                <li>• Trackout License</li>
                <li>• Unlimited License</li>
                <li>• Exclusive Rights</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
