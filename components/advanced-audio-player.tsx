"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Image from "next/image"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Shuffle,
  ExternalLink,
  List,
  X,
} from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { useAudioPlayer } from "@/components/audio-player-context"
import { motion, AnimatePresence } from "framer-motion"

export default function AdvancedAudioPlayer() {
  const { currentTrack, isPlaying, togglePlayPause, setIsPlaying, queue, currentIndex, nextTrack, previousTrack } =
    useAudioPlayer()
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [showVolumeControl, setShowVolumeControl] = useState(false)
  const [showQueue, setShowQueue] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [repeatMode, setRepeatMode] = useState<"off" | "all" | "one">("off")
  const [shuffleMode, setShuffleMode] = useState(false)
  const [crossfade, setCrossfade] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const nextAudioRef = useRef<HTMLAudioElement | null>(null)
  const volumeControlRef = useRef<HTMLDivElement>(null)

  // Handle clicks outside volume control
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (volumeControlRef.current && !volumeControlRef.current.contains(event.target as Node)) {
        setShowVolumeControl(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    // Create audio element if it doesn't exist
    if (!audioRef.current) {
      const audio = new Audio()
      audioRef.current = audio

      // Set up event listeners
      audio.addEventListener("timeupdate", updateProgress)
      audio.addEventListener("loadedmetadata", () => {
        setDuration(audio.duration)
      })
      audio.addEventListener("ended", handleTrackEnd)
    }

    // Update audio source when currentTrack changes
    if (currentTrack && audioRef.current) {
      audioRef.current.src = currentTrack.audioSrc
      audioRef.current.load()

      // Show the player with animation
      setIsVisible(true)

      if (isPlaying) {
        const playPromise = audioRef.current.play()

        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.error("Error playing audio:", error)
            setIsPlaying(false)
          })
        }
      }
    } else {
      setIsVisible(false)
    }

    // Clean up
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.removeEventListener("timeupdate", updateProgress)
        audioRef.current.removeEventListener("loadedmetadata", () => {})
        audioRef.current.removeEventListener("ended", handleTrackEnd)
      }
    }
  }, [currentTrack, isPlaying, setIsPlaying])

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying && !isDragging) {
        const playPromise = audioRef.current.play()

        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.error("Error playing audio:", error)
            setIsPlaying(false)
          })
        }
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying, isDragging, setIsPlaying])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  const updateProgress = useCallback(() => {
    if (audioRef.current && !isDragging) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }, [isDragging])

  const handleTrackEnd = useCallback(() => {
    if (repeatMode === "one") {
      // Repeat current track
      if (audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play()
      }
    } else if (repeatMode === "all" || currentIndex < queue.length - 1) {
      // Play next track
      nextTrack()
    } else {
      // Stop playing
      setIsPlaying(false)
      setCurrentTime(0)
    }
  }, [repeatMode, currentIndex, queue.length, nextTrack, setIsPlaying])

  const handleProgressChange = (value: number[]) => {
    if (audioRef.current) {
      const newTime = value[0]
      audioRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)
    if (newVolume === 0) {
      setIsMuted(true)
    } else {
      setIsMuted(false)
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const toggleRepeat = () => {
    setRepeatMode((prev) => {
      switch (prev) {
        case "off":
          return "all"
        case "all":
          return "one"
        case "one":
          return "off"
        default:
          return "off"
      }
    })
  }

  const toggleShuffle = () => {
    setShuffleMode(!shuffleMode)
  }

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  const handleBuyLicense = () => {
    if (currentTrack?.beatstarsLink) {
      window.open(currentTrack.beatstarsLink, "_blank")
    } else {
      window.open("https://beatstars.com/catmatildabeat", "_blank")
    }
  }

  if (!currentTrack) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border py-2 md:py-3 px-3 md:px-4 z-50 shadow-lg"
        >
          <div className="container mx-auto">
            {/* Main Player Controls */}
            <div className="flex items-center gap-3 md:gap-4 mb-2">
              <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                <div className="flex-shrink-0">
                  <Image
                    src={currentTrack.coverImage || "/placeholder.svg"}
                    alt={currentTrack.title}
                    width={40}
                    height={40}
                    className="rounded-md w-10 h-10 md:w-12 md:h-12 object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-xs md:text-sm truncate">{currentTrack.title}</h4>
                  <p className="text-xs text-muted-foreground truncate">{currentTrack.artist}</p>
                </div>

                {/* Desktop Controls */}
                <div className="hidden md:flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-brand-400"
                    onClick={toggleShuffle}
                  >
                    <Shuffle className={`h-4 w-4 ${shuffleMode ? "text-brand-500" : ""}`} />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-brand-400"
                    onClick={previousTrack}
                    disabled={currentIndex === 0 && repeatMode !== "all"}
                  >
                    <SkipBack className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-brand-500 hover:text-brand-400 hover:bg-brand-500/10"
                    onClick={togglePlayPause}
                  >
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-brand-400"
                    onClick={nextTrack}
                    disabled={currentIndex === queue.length - 1 && repeatMode !== "all"}
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-brand-400"
                    onClick={toggleRepeat}
                  >
                    <Repeat className={`h-4 w-4 ${repeatMode !== "off" ? "text-brand-500" : ""}`} />
                    {repeatMode === "one" && <span className="absolute -top-1 -right-1 text-xs text-brand-500">1</span>}
                  </Button>
                </div>

                {/* Mobile Controls */}
                <div className="flex md:hidden items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-brand-500 hover:text-brand-400"
                    onClick={togglePlayPause}
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Right Side Controls */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-brand-400 hidden sm:flex"
                  onClick={() => setShowQueue(!showQueue)}
                >
                  <List className="h-4 w-4" />
                </Button>

                <div className="relative hidden sm:block" ref={volumeControlRef}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-brand-400"
                    onClick={() => setShowVolumeControl(!showVolumeControl)}
                    onMouseEnter={() => setShowVolumeControl(true)}
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>

                  <AnimatePresence>
                    {showVolumeControl && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.15 }}
                        className="absolute bottom-full mb-2 bg-card rounded-md p-2 shadow-lg w-24 border border-border"
                        onMouseLeave={() => setShowVolumeControl(false)}
                      >
                        <Slider
                          value={[isMuted ? 0 : volume]}
                          min={0}
                          max={1}
                          step={0.01}
                          onValueChange={handleVolumeChange}
                          orientation="vertical"
                          className="h-20"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Button
                  size="sm"
                  className="bg-brand-600 hover:bg-brand-500 transition-colors text-xs h-8 hidden sm:flex"
                  onClick={handleBuyLicense}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Buy
                </Button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-muted-foreground w-10 hidden sm:block">{formatTime(currentTime)}</span>
              <Slider
                value={[currentTime]}
                min={0}
                max={duration || 100}
                step={0.1}
                onValueChange={handleProgressChange}
                onValueCommit={() => setIsDragging(false)}
                onPointerDown={() => setIsDragging(true)}
                className="flex-1"
              />
              <span className="text-xs text-muted-foreground w-10 hidden sm:block">{formatTime(duration)}</span>
            </div>

            {/* Queue Panel */}
            <AnimatePresence>
              {showQueue && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border-t border-border pt-2 mt-2 overflow-hidden"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-bold">Queue ({queue.length} tracks)</h4>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setShowQueue(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {queue.map((track, index) => (
                      <div
                        key={`${track.id}-${index}`}
                        className={`flex items-center gap-2 p-2 rounded text-sm ${
                          index === currentIndex ? "bg-brand-500/20 text-brand-500" : "hover:bg-secondary/50"
                        }`}
                      >
                        <span className="w-4 text-xs text-muted-foreground">{index + 1}</span>
                        <Image
                          src={track.coverImage || "/placeholder.svg"}
                          alt={track.title}
                          width={24}
                          height={24}
                          className="rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="truncate">{track.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
