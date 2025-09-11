"use client"

import { createContext, useContext, useState, useRef, useEffect, useCallback, type ReactNode } from "react"

interface Track {
  id: string
  title: string
  artist: string
  audioSrc: string
  coverImage: string
  type?: "beat" | "track"
  beatstarsLink?: string
}

interface AudioPlayerContextType {
  currentTrack: Track | null
  isPlaying: boolean
  volume: number
  currentTime: number
  duration: number
  queue: Track[]
  currentIndex: number
  setCurrentTrack: (track: Track | null) => void
  playTrack: (track: Track) => void
  togglePlayPause: () => void
  nextTrack: () => void
  previousTrack: () => void
  setVolume: (volume: number) => void
  seekTo: (time: number) => void
  addToQueue: (track: Track) => void
  removeFromQueue: (index: number) => void
  clearQueue: () => void
  shuffleQueue: () => void
  setIsPlaying: (playing: boolean) => void
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined)

// Generate a simple demo audio tone
const generateDemoAudio = (frequency = 440, duration = 30): string => {
  try {
    const sampleRate = 44100
    const samples = sampleRate * duration
    const buffer = new ArrayBuffer(44 + samples * 2)
    const view = new DataView(buffer)

    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i))
      }
    }

    writeString(0, "RIFF")
    view.setUint32(4, 36 + samples * 2, true)
    writeString(8, "WAVE")
    writeString(12, "fmt ")
    view.setUint32(16, 16, true)
    view.setUint16(20, 1, true)
    view.setUint16(22, 1, true)
    view.setUint32(24, sampleRate, true)
    view.setUint32(28, sampleRate * 2, true)
    view.setUint16(32, 2, true)
    view.setUint16(34, 16, true)
    writeString(36, "data")
    view.setUint32(40, samples * 2, true)

    // Generate a more musical tone with harmonics
    for (let i = 0; i < samples; i++) {
      const t = i / sampleRate
      const fundamental = Math.sin(2 * Math.PI * frequency * t)
      const harmonic2 = Math.sin(2 * Math.PI * frequency * 2 * t) * 0.3
      const harmonic3 = Math.sin(2 * Math.PI * frequency * 3 * t) * 0.1

      // Add some rhythm by modulating amplitude
      const rhythm = Math.sin(2 * Math.PI * 2 * t) * 0.2 + 0.8

      const sample = (fundamental + harmonic2 + harmonic3) * 0.3 * rhythm
      view.setInt16(44 + i * 2, sample * 32767, true)
    }

    const blob = new Blob([buffer], { type: "audio/wav" })
    return URL.createObjectURL(blob)
  } catch (error) {
    console.error("Error generating demo audio:", error)
    // Return a data URL for a very short silent audio as ultimate fallback
    return "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT"
  }
}

// Get frequency from musical key
const getFrequencyFromKey = (key: string): number => {
  const keyMap: { [key: string]: number } = {
    C: 261.63,
    "C#": 277.18,
    Db: 277.18,
    D: 293.66,
    "D#": 311.13,
    Eb: 311.13,
    E: 329.63,
    F: 349.23,
    "F#": 369.99,
    Gb: 369.99,
    G: 392.0,
    "G#": 415.3,
    Ab: 415.3,
    A: 440.0,
    "A#": 466.16,
    Bb: 466.16,
    B: 493.88,
  }

  // Extract base key (e.g., 'C' from 'C Minor' or 'C# Major')
  const baseKey = key.split(" ")[0]
  return keyMap[baseKey] || 440.0
}

export function AudioPlayerProvider({ children }: { children: ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolumeState] = useState(0.7)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [queue, setQueue] = useState<Track[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const demoAudioCache = useRef<Map<string, string>>(new Map())

  // Initialize audio element
  useEffect(() => {
    if (typeof window !== "undefined" && !audioRef.current) {
      const audio = new Audio()
      audioRef.current = audio
      audio.volume = volume
      audio.preload = "metadata"

      const handleLoadedMetadata = () => {
        setDuration(audio.duration || 0)
      }

      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime || 0)
      }

      const handleEnded = () => {
        setIsPlaying(false)
        nextTrack()
      }

      const handleError = (e: Event) => {
        console.error("Audio error:", e)
        // Try to generate demo audio as fallback
        if (currentTrack) {
          const demoAudio = generateDemoAudio(440, 30)
          audio.src = demoAudio
          audio.load()
        }
      }

      const handleCanPlay = () => {
        if (isPlaying) {
          audio.play().catch(console.error)
        }
      }

      const handleLoadStart = () => {
        setCurrentTime(0)
        setDuration(0)
      }

      const handlePlay = () => {
        setIsPlaying(true)
      }

      const handlePause = () => {
        setIsPlaying(false)
      }

      audio.addEventListener("loadedmetadata", handleLoadedMetadata)
      audio.addEventListener("timeupdate", handleTimeUpdate)
      audio.addEventListener("ended", handleEnded)
      audio.addEventListener("error", handleError)
      audio.addEventListener("canplay", handleCanPlay)
      audio.addEventListener("loadstart", handleLoadStart)
      audio.addEventListener("play", handlePlay)
      audio.addEventListener("pause", handlePause)

      return () => {
        if (audioRef.current) {
          const audio = audioRef.current
          audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
          audio.removeEventListener("timeupdate", handleTimeUpdate)
          audio.removeEventListener("ended", handleEnded)
          audio.removeEventListener("error", handleError)
          audio.removeEventListener("canplay", handleCanPlay)
          audio.removeEventListener("loadstart", handleLoadStart)
          audio.removeEventListener("play", handlePlay)
          audio.removeEventListener("pause", handlePause)
        }
      }
    }
  }, [])

  // Get or generate demo audio for a track
  const getDemoAudioSrc = useCallback((track: Track): string => {
    const cacheKey = `${track.id}-${track.title}`

    if (demoAudioCache.current.has(cacheKey)) {
      return demoAudioCache.current.get(cacheKey)!
    }

    // Try to extract key information for more realistic demo
    let frequency = 440 // Default A4
    if (track.title) {
      // Look for key information in title or use a hash-based frequency
      const hash = track.title.split("").reduce((a, b) => {
        a = (a << 5) - a + b.charCodeAt(0)
        return a & a
      }, 0)
      frequency = 220 + Math.abs(hash % 440) // Range from 220Hz to 660Hz
    }

    const demoAudio = generateDemoAudio(frequency, 30)
    demoAudioCache.current.set(cacheKey, demoAudio)
    return demoAudio
  }, [])

  // Update audio source when track changes
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      const audio = audioRef.current

      // Stop current playback
      audio.pause()
      audio.currentTime = 0

      // Try original source first, then fallback to demo
      const tryLoadAudio = async (src: string) => {
        return new Promise<boolean>((resolve) => {
          const testAudio = new Audio()
          testAudio.oncanplaythrough = () => resolve(true)
          testAudio.onerror = () => resolve(false)
          testAudio.src = src
        })
      }

      const loadAudio = async () => {
        let audioSrc = currentTrack.audioSrc

        // If the original source fails or doesn't exist, use demo audio
        if (!audioSrc || audioSrc === "/demo-beat.mp3" || !(await tryLoadAudio(audioSrc))) {
          audioSrc = getDemoAudioSrc(currentTrack)
        }

        audio.src = audioSrc
        audio.load()

        // Auto-play if isPlaying is true
        if (isPlaying) {
          try {
            await audio.play()
          } catch (error) {
            console.error("Error playing audio:", error)
            setIsPlaying(false)
          }
        }
      }

      loadAudio()
    }
  }, [currentTrack, getDemoAudioSrc])

  // Handle play/pause state changes
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      const audio = audioRef.current

      if (isPlaying) {
        const playPromise = audio.play()
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.error("Error playing audio:", error)
            setIsPlaying(false)
          })
        }
      } else {
        audio.pause()
      }
    }
  }, [isPlaying, currentTrack])

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const playTrack = useCallback((track: Track) => {
    setCurrentTrack(track)
    setIsPlaying(true)

    // Add to queue if not already there
    setQueue((prevQueue) => {
      const existingIndex = prevQueue.findIndex((t) => t.id === track.id)
      if (existingIndex === -1) {
        const newQueue = [...prevQueue, track]
        setCurrentIndex(newQueue.length - 1)
        return newQueue
      } else {
        setCurrentIndex(existingIndex)
        return prevQueue
      }
    })
  }, [])

  const togglePlayPause = useCallback(() => {
    if (!audioRef.current || !currentTrack) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      const playPromise = audioRef.current.play()
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error("Error playing audio:", error)
          setIsPlaying(false)
        })
      }
    }
  }, [isPlaying, currentTrack])

  const nextTrack = useCallback(() => {
    if (queue.length === 0) return

    const nextIndex = (currentIndex + 1) % queue.length
    setCurrentIndex(nextIndex)
    setCurrentTrack(queue[nextIndex])
    setIsPlaying(true)
  }, [queue, currentIndex])

  const previousTrack = useCallback(() => {
    if (queue.length === 0) return

    const prevIndex = currentIndex === 0 ? queue.length - 1 : currentIndex - 1
    setCurrentIndex(prevIndex)
    setCurrentTrack(queue[prevIndex])
    setIsPlaying(true)
  }, [queue, currentIndex])

  const setVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume))
    setVolumeState(clampedVolume)
  }, [])

  const seekTo = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }, [])

  const addToQueue = useCallback((track: Track) => {
    setQueue((prevQueue) => {
      const existingIndex = prevQueue.findIndex((t) => t.id === track.id)
      if (existingIndex === -1) {
        return [...prevQueue, track]
      }
      return prevQueue
    })
  }, [])

  const removeFromQueue = useCallback(
    (index: number) => {
      setQueue((prevQueue) => {
        const newQueue = prevQueue.filter((_, i) => i !== index)
        if (index === currentIndex && newQueue.length > 0) {
          const newCurrentIndex = Math.min(currentIndex, newQueue.length - 1)
          setCurrentIndex(newCurrentIndex)
          setCurrentTrack(newQueue[newCurrentIndex])
        } else if (index < currentIndex) {
          setCurrentIndex(currentIndex - 1)
        }
        return newQueue
      })
    },
    [currentIndex],
  )

  const clearQueue = useCallback(() => {
    setQueue([])
    setCurrentIndex(0)
    setCurrentTrack(null)
    setIsPlaying(false)
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ""
    }
  }, [])

  const shuffleQueue = useCallback(() => {
    setQueue((prevQueue) => {
      const shuffled = [...prevQueue].sort(() => Math.random() - 0.5)
      if (currentTrack) {
        const currentTrackIndex = shuffled.findIndex((t) => t.id === currentTrack.id)
        if (currentTrackIndex !== -1) {
          setCurrentIndex(currentTrackIndex)
        }
      }
      return shuffled
    })
  }, [currentTrack])

  const handleSetCurrentTrack = useCallback(
    (track: Track | null) => {
      if (track) {
        playTrack(track)
      } else {
        setCurrentTrack(null)
        setIsPlaying(false)
        if (audioRef.current) {
          audioRef.current.pause()
          audioRef.current.src = ""
        }
      }
    },
    [playTrack],
  )

  const value: AudioPlayerContextType = {
    currentTrack,
    isPlaying,
    volume,
    currentTime,
    duration,
    queue,
    currentIndex,
    setCurrentTrack: handleSetCurrentTrack,
    playTrack,
    togglePlayPause,
    nextTrack,
    previousTrack,
    setVolume,
    seekTo,
    addToQueue,
    removeFromQueue,
    clearQueue,
    shuffleQueue,
    setIsPlaying,
  }

  return <AudioPlayerContext.Provider value={value}>{children}</AudioPlayerContext.Provider>
}

export function useAudioPlayer() {
  const context = useContext(AudioPlayerContext)
  if (context === undefined) {
    throw new Error("useAudioPlayer must be used within an AudioPlayerProvider")
  }
  return context
}
