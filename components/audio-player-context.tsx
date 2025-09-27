"use client"

import { createContext, useContext, useState, useRef, useEffect, useCallback, type ReactNode } from "react"

interface Track {
  id: string
  title: string
  artist: string
  audioSrc: string
  coverImage: string
  type?: "beat" | "track" | "sample-pack"
  beatstarsLink?: string
  duration?: number // Duration in seconds
  durationString?: string // Duration as string from database (e.g., "3:30")
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

// Parse duration string (e.g., "3:30") to seconds
const parseDurationString = (durationString: string): number => {
  if (!durationString || typeof durationString !== 'string') return 0
  
  const parts = durationString.split(':')
  if (parts.length === 2) {
    const minutes = parseInt(parts[0], 10) || 0
    const seconds = parseInt(parts[1], 10) || 0
    const totalSeconds = minutes * 60 + seconds
    console.log(`Parsed duration: "${durationString}" -> ${totalSeconds} seconds`)
    return totalSeconds
  } else if (parts.length === 1) {
    // Just seconds
    const seconds = parseInt(parts[0], 10) || 0
    console.log(`Parsed duration: "${durationString}" -> ${seconds} seconds`)
    return seconds
  }
  console.log(`Failed to parse duration: "${durationString}"`)
  return 0
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
  const [duration, setDurationState] = useState(0)
  
  // Custom setDuration that also updates the ref
  const setDuration = useCallback((newDuration: number) => {
    durationRef.current = newDuration
    setDurationState(newDuration)
  }, [])
  const [queue, setQueue] = useState<Track[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const demoAudioCache = useRef<Map<string, string>>(new Map())
  const durationRef = useRef<number>(0)
  const rafRef = useRef<number | null>(null)

  const startProgressUpdater = useCallback(() => {
    const tick = () => {
      if (audioRef.current && !isNaN(audioRef.current.currentTime)) {
        setCurrentTime(audioRef.current.currentTime)
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    if (rafRef.current == null) {
      rafRef.current = requestAnimationFrame(tick)
    }
  }, [])

  const stopProgressUpdater = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [])

  // Initialize audio element
  useEffect(() => {
    if (typeof window !== "undefined" && !audioRef.current) {
      const audio = new Audio()
      audioRef.current = audio
      audio.volume = volume
      audio.preload = "metadata"
      // Allow metadata/time updates with cross-origin sources (Supabase)
      audio.crossOrigin = "anonymous"

      const handleLoadedMetadata = () => {
        const audioDuration = audio.duration
        console.log('Audio metadata loaded, audio duration:', audioDuration, 'current duration state:', durationRef.current)
        if (audioDuration && !isNaN(audioDuration) && isFinite(audioDuration)) {
          // Prefer actual audio metadata for precise progress/minutes
          if (Math.abs(audioDuration - durationRef.current) > 0.25) {
            console.log('Updating duration from audio metadata:', audioDuration)
            setDuration(audioDuration)
          }
        }
      }

      const handleTimeUpdate = () => {
        const newTime = audio.currentTime || 0
        setCurrentTime(newTime)
        console.log('Time update - currentTime:', newTime, 'duration:', durationRef.current)
      }

      const handleEnded = () => {
        setIsPlaying(false)
        nextTrack()
        stopProgressUpdater()
      }

      const handleError = (e: Event) => {
        console.error("Audio error:", e)
        // Fallback to generated demo audio and attempt to play
        if (currentTrack) {
          const demoAudio = generateDemoAudio(440, 30)
          audio.src = demoAudio
          audio.load()
          if (isPlaying) {
            const p = audio.play()
            if (p) p.catch(console.error)
          }
        }
      }

      const handleCanPlay = () => {
        if (isPlaying) {
          audio.play().catch(console.error)
        }
      }

      const handleLoadStart = () => {
        setCurrentTime(0)
        console.log('Audio load started, current duration:', durationRef.current)
        // Avoid forcing fallback duration here; wait for metadata for accuracy
      }

      const handlePlay = () => {
        setIsPlaying(true)
        startProgressUpdater()
      }

      const handlePause = () => {
        setIsPlaying(false)
        stopProgressUpdater()
      }

      audio.addEventListener("loadedmetadata", handleLoadedMetadata)
      audio.addEventListener("timeupdate", handleTimeUpdate)
      audio.addEventListener("ended", handleEnded)
      audio.addEventListener("error", handleError)
      audio.addEventListener("canplay", handleCanPlay)
      audio.addEventListener("canplaythrough", handleCanPlay)
      audio.addEventListener("durationchange", handleLoadedMetadata)
      audio.addEventListener("loadstart", handleLoadStart)
      audio.addEventListener("play", handlePlay)
      audio.addEventListener("playing", handlePlay)
      audio.addEventListener("pause", handlePause)

      return () => {
        if (audioRef.current) {
          const audio = audioRef.current
          audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
          audio.removeEventListener("timeupdate", handleTimeUpdate)
          audio.removeEventListener("ended", handleEnded)
          audio.removeEventListener("error", handleError)
          audio.removeEventListener("canplay", handleCanPlay)
          audio.removeEventListener("canplaythrough", handleCanPlay)
          audio.removeEventListener("durationchange", handleLoadedMetadata)
          audio.removeEventListener("loadstart", handleLoadStart)
          audio.removeEventListener("play", handlePlay)
          audio.removeEventListener("playing", handlePlay)
          audio.removeEventListener("pause", handlePause)
        }
        stopProgressUpdater()
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

  // Update audio source when track changes (non-interruptive)
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      const audio = audioRef.current

      const updateSrc = async () => {
        let desiredSrc = currentTrack.audioSrc
        if (!desiredSrc || desiredSrc === '/demo-beat.mp3') {
          desiredSrc = getDemoAudioSrc(currentTrack)
        }

        // Skip if already set to desired source (normalize to absolute URL)
        let absDesired = desiredSrc
        try {
          absDesired = new URL(desiredSrc, window.location.href).toString()
        } catch {}
        if (audio.src === absDesired) {
          return
        }

        const currentDuration = durationRef.current
        console.log('Track changed - setting src (non-interruptive):', desiredSrc)

        audio.src = desiredSrc
        audio.load()

        if (desiredSrc === getDemoAudioSrc(currentTrack)) {
          setDuration(30)
        } else if (currentDuration === 0 && !currentTrack.duration && !currentTrack.durationString) {
          setDuration(0)
        }

        if (isPlaying) {
          try {
            await audio.play()
          } catch (error) {
            console.error('Error auto-playing after src update:', error)
          }
        }
      }

      updateSrc()
    }
  }, [currentTrack, getDemoAudioSrc])

  // Handle play/pause state changes
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      const audio = audioRef.current

      if (isPlaying) {
        console.log('Attempting to play audio:', audio.src)
        const playPromise = audio.play()
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.error("Error playing audio:", error)
            setIsPlaying(false)
          })
        }
      } else {
        console.log('Pausing audio')
        audio.pause()
      }
    }
  }, [isPlaying, currentTrack])

  // Ensure progress updates while playing (cross-browser)
  useEffect(() => {
    if (isPlaying) {
      // Start updater loop
      const tick = () => {
        if (audioRef.current && !isNaN(audioRef.current.currentTime)) {
          setCurrentTime(audioRef.current.currentTime)
        }
        rafRef.current = requestAnimationFrame(tick)
      }
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(tick)
      }
      return () => {
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current)
          rafRef.current = null
        }
      }
    } else {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [isPlaying])

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const playTrack = useCallback((track: Track) => {
    console.log('Playing track (user action):', track)

    // Ensure duration is set ASAP for UI feedback
    if (track.duration) {
      console.log('Setting duration from track.duration:', track.duration)
      setDuration(track.duration)
    } else if (track.durationString) {
      console.log('Setting duration from track.durationString:', track.durationString)
      const parsedDuration = parseDurationString(track.durationString)
      setDuration(parsedDuration > 0 ? parsedDuration : 30)
    } else {
      console.log('No duration info, using fallback')
      setDuration(30)
    }

    // Set state
    setCurrentTrack(track)
    setIsPlaying(true)

    // Synchronous playback to satisfy autoplay policies (Safari/iOS)
    const audio = audioRef.current
    if (audio) {
      try {
        // Prefer provided src, otherwise generate a demo tone
        let src = track.audioSrc
        if (!src || src === '/demo-beat.mp3') {
          src = getDemoAudioSrc(track)
          // If using demo, we know duration ~30s
          setDuration(30)
        }

        console.log('Immediate play - setting src:', src)
        audio.pause()
        audio.currentTime = 0
        audio.src = src
        audio.load()

        const playPromise = audio.play()
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.error('Immediate play failed:', error)
            setIsPlaying(false)
          })
        }
      } catch (err) {
        console.error('Error during immediate playback setup:', err)
        setIsPlaying(false)
      }
    }

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
  }, [getDemoAudioSrc])

  const togglePlayPause = useCallback(() => {
    if (!audioRef.current || !currentTrack) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      const playPromise = audioRef.current.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true)
          })
          .catch((error) => {
            console.error("Error playing audio:", error)
            setIsPlaying(false)
          })
      } else {
        // Older browsers
        setIsPlaying(true)
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
    console.log('SeekTo called with time:', time)
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
      console.log('Audio currentTime set to:', time)
    } else {
      console.log('No audio ref available for seeking')
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
