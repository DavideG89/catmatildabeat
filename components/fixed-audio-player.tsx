"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Play, Pause, Volume2, VolumeX, ExternalLink } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { useAudioPlayer } from "@/components/audio-player-context"
import { motion, AnimatePresence } from "framer-motion"

export default function FixedAudioPlayer() {
  const { currentTrack, isPlaying, togglePlayPause, setIsPlaying } = useAudioPlayer()
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [showVolumeControl, setShowVolumeControl] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)
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
      audio.addEventListener("ended", () => {
        setIsPlaying(false)
        setCurrentTime(0)
      })
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
        audioRef.current.removeEventListener("ended", () => {})
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

  const updateProgress = () => {
    if (audioRef.current && !isDragging) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

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

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  const handleBuyLicense = () => {
    // Redirect to BeatStars
    window.open("https://beatstars.com/catmatildabeat", "_blank")
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
          <div className="container mx-auto flex items-center gap-3 md:gap-4">
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
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mb-1">
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs md:text-sm truncate">{currentTrack.title}</h4>
                    <p className="text-xs text-muted-foreground truncate">{currentTrack.artist}</p>
                  </div>

                  <div className="flex items-center gap-2 sm:ml-auto">
                    <span className="text-xs text-muted-foreground w-8 hidden sm:block">{formatTime(currentTime)}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 md:h-8 md:w-8 text-brand-500 hover:text-brand-400 hover:bg-brand-500/10 p-1"
                      onClick={togglePlayPause}
                      aria-label={isPlaying ? "Pause" : "Play"}
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <span className="text-xs text-muted-foreground w-8 hidden sm:block">{formatTime(duration)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Slider
                    value={[currentTime]}
                    min={0}
                    max={duration || 100}
                    step={0.1}
                    onValueChange={handleProgressChange}
                    onValueCommit={() => setIsDragging(false)}
                    onPointerDown={() => setIsDragging(true)}
                    className="flex-1"
                    aria-label="Playback progress"
                  />

                  <div className="relative ml-1 hidden sm:block" ref={volumeControlRef}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-brand-400 p-1"
                      onClick={() => setShowVolumeControl(!showVolumeControl)}
                      onMouseEnter={() => setShowVolumeControl(true)}
                      aria-label={isMuted ? "Unmute" : "Mute"}
                    >
                      {isMuted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
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
                            aria-label="Volume"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden sm:block">
              <Button
                size="sm"
                className="bg-brand-600 hover:bg-brand-500 transition-colors text-xs h-8"
                onClick={handleBuyLicense}
              >
                <ExternalLink className="h-3 w-3 mr-1 md:mr-2 md:h-4 md:w-4" />
                <span className="hidden md:inline">Buy on BeatStars</span>
                <span className="md:hidden">Buy</span>
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
