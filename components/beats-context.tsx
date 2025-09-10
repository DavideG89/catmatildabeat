"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

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
  status: string
  beatstarsLink: string
  sales?: number
  description?: string
  duration?: string // Add duration field
}

interface BeatsContextType {
  beats: Beat[]
  addBeat: (beat: Beat) => void
  updateBeat: (id: string, beat: Partial<Beat>) => void
  deleteBeat: (id: string) => void
  searchBeats: (query: string, filters?: any) => Beat[]
}

const BeatsContext = createContext<BeatsContextType | undefined>(undefined)

// Initial beats data
const initialBeats: Beat[] = [
  {
    id: "1",
    title: "Midnight Dreams",
    producer: "Cat Matilda Beat",
    coverImage: "/placeholder.svg?height=400&width=400",
    price: 29.99,
    bpm: 140,
    key: "C Minor",
    genre: "Trap",
    tags: ["Dark", "Emotional", "Trap"],
    status: "Active",
    beatstarsLink: "https://beatstars.com/catmatildabeat/midnight-dreams",
    sales: 24,
    description: "A haunting trap beat with atmospheric melodies and hard-hitting 808s.",
    duration: "2:45",
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
    tags: ["Chill", "Summer", "R&B"],
    status: "Active",
    beatstarsLink: "https://beatstars.com/catmatildabeat/summer-vibes",
    sales: 18,
    description: "Smooth R&B vibes perfect for summer tracks.",
    duration: "3:10",
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
    tags: ["Hard", "Urban", "Hip Hop"],
    status: "Active",
    beatstarsLink: "https://beatstars.com/catmatildabeat/urban-legend",
    sales: 12,
    description: "Hard-hitting hip hop beat with urban influences.",
    duration: "2:50",
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
    tags: ["Upbeat", "Electronic", "Pop"],
    status: "Active",
    beatstarsLink: "https://beatstars.com/catmatildabeat/neon-lights",
    sales: 8,
    description: "Upbeat pop beat with electronic elements.",
    duration: "3:00",
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
    tags: ["Spacey", "Chill", "Ambient"],
    status: "Active",
    beatstarsLink: "https://beatstars.com/catmatildabeat/cosmic-journey",
    sales: 5,
    description: "Ambient journey through space and time.",
    duration: "4:00",
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
    tags: ["Old School", "Hip Hop", "Boom Bap"],
    status: "Active",
    beatstarsLink: "https://beatstars.com/catmatildabeat/street-dreams",
    sales: 15,
    description: "Classic boom bap with old school vibes.",
    duration: "3:20",
  },
]

export function BeatsProvider({ children }: { children: ReactNode }) {
  const [beats, setBeats] = useState<Beat[]>([])

  // Load beats from localStorage on mount
  useEffect(() => {
    const savedBeats = localStorage.getItem("catmatilda-beats")
    if (savedBeats) {
      setBeats(JSON.parse(savedBeats))
    } else {
      setBeats(initialBeats)
    }
  }, [])

  // Save beats to localStorage whenever beats change
  useEffect(() => {
    if (beats.length > 0) {
      localStorage.setItem("catmatilda-beats", JSON.stringify(beats))
    }
  }, [beats])

  const addBeat = (beat: Beat) => {
    const newBeat = {
      ...beat,
      id: Date.now().toString(),
      sales: 0,
      duration: "0:00", // Default duration
    }
    setBeats((prev) => [newBeat, ...prev])
  }

  const updateBeat = (id: string, updatedBeat: Partial<Beat>) => {
    setBeats((prev) => prev.map((beat) => (beat.id === id ? { ...beat, ...updatedBeat } : beat)))
  }

  const deleteBeat = (id: string) => {
    setBeats((prev) => prev.filter((beat) => beat.id !== id))
  }

  const searchBeats = (query: string, filters?: any) => {
    let filteredBeats = beats.filter((beat) => beat.status === "Active")

    if (query) {
      const searchTerm = query.toLowerCase()
      filteredBeats = filteredBeats.filter(
        (beat) =>
          beat.title.toLowerCase().includes(searchTerm) ||
          beat.genre.toLowerCase().includes(searchTerm) ||
          beat.tags.some((tag) => tag.toLowerCase().includes(searchTerm)),
      )
    }

    if (filters) {
      if (filters.genres && filters.genres.length > 0) {
        filteredBeats = filteredBeats.filter((beat) => filters.genres.includes(beat.genre.toLowerCase()))
      }

      if (filters.moods && filters.moods.length > 0) {
        filteredBeats = filteredBeats.filter((beat) =>
          beat.tags.some((tag) => filters.moods.includes(tag.toLowerCase())),
        )
      }

      if (filters.keys && filters.keys.length > 0) {
        filteredBeats = filteredBeats.filter((beat) => filters.keys.includes(beat.key.toLowerCase()))
      }

      if (filters.bpmRange) {
        filteredBeats = filteredBeats.filter(
          (beat) => beat.bpm >= filters.bpmRange[0] && beat.bpm <= filters.bpmRange[1],
        )
      }

      if (filters.durationRange) {
        filteredBeats = filteredBeats.filter((beat) => {
          const [start, end] = filters.durationRange
          const [beatMinutes, beatSeconds] = beat.duration?.split(":").map(Number) || [0, 0]
          const [startMinutes, startSeconds] = start.split(":").map(Number)
          const [endMinutes, endSeconds] = end.split(":").map(Number)
          const beatTotalSeconds = beatMinutes * 60 + beatSeconds
          const startTotalSeconds = startMinutes * 60 + startSeconds
          const endTotalSeconds = endMinutes * 60 + endSeconds
          return beatTotalSeconds >= startTotalSeconds && beatTotalSeconds <= endTotalSeconds
        })
      }
    }

    return filteredBeats
  }

  return (
    <BeatsContext.Provider value={{ beats, addBeat, updateBeat, deleteBeat, searchBeats }}>
      {children}
    </BeatsContext.Provider>
  )
}

export function useBeats() {
  const context = useContext(BeatsContext)
  if (context === undefined) {
    throw new Error("useBeats must be used within a BeatsProvider")
  }
  return context
}
