"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface Track {
  id: string
  title: string
  artist: string
  coverImage: string
  audioSrc: string
  type: "beat" | "sample-pack"
  beatstarsLink?: string
  duration?: string
  genre?: string
  bpm?: number
  key?: string
}

interface AudioPlayerContextType {
  currentTrack: Track | null
  isPlaying: boolean
  queue: Track[]
  currentIndex: number
  setCurrentTrack: (track: Track | null) => void
  addToQueue: (track: Track) => void
  setQueue: (tracks: Track[]) => void
  togglePlayPause: () => void
  setIsPlaying: (isPlaying: boolean) => void
  nextTrack: () => void
  previousTrack: () => void
  playTrackAtIndex: (index: number) => void
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined)

export function AudioPlayerProvider({ children }: { children: ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [queue, setQueue] = useState<Track[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  // When track changes, automatically start playing
  useEffect(() => {
    if (currentTrack) {
      setIsPlaying(true)
    } else {
      setIsPlaying(false)
    }
  }, [currentTrack])

  // Handle media session API for mobile devices
  useEffect(() => {
    if (!currentTrack) return

    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentTrack.title,
        artist: currentTrack.artist,
        artwork: [
          { src: currentTrack.coverImage, sizes: "96x96", type: "image/png" },
          { src: currentTrack.coverImage, sizes: "128x128", type: "image/png" },
          { src: currentTrack.coverImage, sizes: "192x192", type: "image/png" },
          { src: currentTrack.coverImage, sizes: "256x256", type: "image/png" },
          { src: currentTrack.coverImage, sizes: "384x384", type: "image/png" },
          { src: currentTrack.coverImage, sizes: "512x512", type: "image/png" },
        ],
      })

      navigator.mediaSession.setActionHandler("play", () => {
        setIsPlaying(true)
      })

      navigator.mediaSession.setActionHandler("pause", () => {
        setIsPlaying(false)
      })

      navigator.mediaSession.setActionHandler("nexttrack", () => {
        nextTrack()
      })

      navigator.mediaSession.setActionHandler("previoustrack", () => {
        previousTrack()
      })
    }
  }, [currentTrack])

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const addToQueue = (track: Track) => {
    setQueue((prev) => [...prev, track])
  }

  const nextTrack = () => {
    if (currentIndex < queue.length - 1) {
      const nextIndex = currentIndex + 1
      setCurrentIndex(nextIndex)
      setCurrentTrack(queue[nextIndex])
    }
  }

  const previousTrack = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1
      setCurrentIndex(prevIndex)
      setCurrentTrack(queue[prevIndex])
    }
  }

  const playTrackAtIndex = (index: number) => {
    if (index >= 0 && index < queue.length) {
      setCurrentIndex(index)
      setCurrentTrack(queue[index])
    }
  }

  const handleSetCurrentTrack = (track: Track | null) => {
    if (track) {
      // Add to queue if not already there
      const existingIndex = queue.findIndex((t) => t.id === track.id)
      if (existingIndex === -1) {
        setQueue((prev) => [...prev, track])
        setCurrentIndex(queue.length)
      } else {
        setCurrentIndex(existingIndex)
      }
    }
    setCurrentTrack(track)
  }

  return (
    <AudioPlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        queue,
        currentIndex,
        setCurrentTrack: handleSetCurrentTrack,
        addToQueue,
        setQueue,
        togglePlayPause,
        setIsPlaying,
        nextTrack,
        previousTrack,
        playTrackAtIndex,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  )
}

export function useAudioPlayer() {
  const context = useContext(AudioPlayerContext)
  if (context === undefined) {
    throw new Error("useAudioPlayer must be used within an AudioPlayerProvider")
  }
  return context
}
