"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Shuffle, Repeat, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { useAudioPlayer } from "@/components/audio-player-context"
import Image from "next/image"

export default function AdvancedAudioPlayer() {
  const {
    currentTrack,
    isPlaying,
    volume,
    currentTime,
    duration,
    queue,
    togglePlayPause,
    nextTrack,
    previousTrack,
    setVolume,
    seekTo,
    shuffleQueue,
    clearQueue,
  } = useAudioPlayer()

  const [isMuted, setIsMuted] = useState(false)
  const [isShuffled, setIsShuffled] = useState(false)
  const [repeatMode, setRepeatMode] = useState<"off" | "one" | "all">("off")
  const [showQueue, setShowQueue] = useState(false)
  const [previousVolume, setPreviousVolume] = useState(volume)
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Collapse by default on mobile
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      setIsCollapsed(true)
    }
  }, [])


  // Format time helper
  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }


  // Handle volume toggle
  const toggleMute = () => {
    if (isMuted) {
      setVolume(previousVolume)
      setIsMuted(false)
    } else {
      setPreviousVolume(volume)
      setVolume(0)
      setIsMuted(true)
    }
  }

  // Handle shuffle
  const handleShuffle = () => {
    setIsShuffled(!isShuffled)
    if (!isShuffled) {
      shuffleQueue()
    }
  }

  // Handle repeat mode
  const handleRepeat = () => {
    const modes: Array<"off" | "one" | "all"> = ["off", "one", "all"]
    const currentIndex = modes.indexOf(repeatMode)
    const nextIndex = (currentIndex + 1) % modes.length
    setRepeatMode(modes[nextIndex])
  }

  // Handle volume change
  const handleVolumeChange = (newVolume: number[]) => {
    const vol = newVolume[0]
    setVolume(vol)
    setIsMuted(vol === 0)
    if (vol > 0) {
      setPreviousVolume(vol)
    }
  }

  // Handle progress change
  const handleProgressChange = (newProgress: number[]) => {
    const time = (newProgress[0] / 100) * duration
    seekTo(time)
  }

  if (!currentTrack) {
    // Hide player completely when no track is selected
    return null
  }

  const progressPercentage = duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border/80 p-3 md:p-4 z-50 shadow-2xl shadow-black/20 ring-1 ring-black/20">
      <div className="container mx-auto">
        {isCollapsed && (
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={currentTrack.coverImage || "/placeholder.svg?height=40&width=40"}
                  alt={currentTrack.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <h4 className="font-medium text-sm truncate">{currentTrack.title}</h4>
                <p className="text-xs text-muted-foreground truncate">{currentTrack.artist}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={togglePlayPause} className="h-9 w-9 rounded-full bg-white hover:bg-gray-100 text-black">
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(false)} className="h-8 px-2 text-black">
                Show
              </Button>
            </div>
          </div>
        )}

        {!isCollapsed && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          {/* Track Info */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={currentTrack.coverImage || "/placeholder.svg?height=48&width=48"}
                alt={currentTrack.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-medium text-sm truncate">{currentTrack.title}</h4>
              <p className="text-xs text-muted-foreground truncate">{currentTrack.artist}</p>
            </div>
          </div>

          {/* Main Controls */}
          <div className="flex flex-col items-center gap-2 flex-1 max-w-md">
            {/* Control Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShuffle}
                className="h-8 w-8 p-0 text-black"
              >
                <Shuffle className="h-4 w-4" />
              </Button>

              <Button variant="ghost" size="sm" onClick={previousTrack} className="h-8 w-8 p-0">
                <SkipBack className="h-4 w-4" />
              </Button>

              <Button
                onClick={togglePlayPause}
                className="h-10 w-10 rounded-full bg-white hover:bg-gray-100 text-black"
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
              </Button>

              <Button variant="ghost" size="sm" onClick={nextTrack} className="h-8 w-8 p-0 text-black">
                <SkipForward className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleRepeat}
                className="h-8 w-8 p-0 text-black"
              >
                <Repeat className="h-4 w-4" />
                {repeatMode === "one" && (
                  <span className="absolute -top-1 -right-1 text-xs bg-brand-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                    1
                  </span>
                )}
              </Button>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center gap-2 w-full">
              <span className="text-xs text-black w-10 text-right">{formatTime(currentTime)}</span>
              <div className="flex-1">
                <Slider
                  key={`progress-${currentTrack.id}`}
                  value={[progressPercentage]}
                  min={0}
                  max={100}
                  step={0.1}
                  onValueChange={handleProgressChange}
                  className="w-full"
                />
              </div>
              <span className="text-xs text-black w-10">
                {duration > 0 ? formatTime(duration) : "0:00"}
              </span>
            </div>
          </div>

          {/* Volume and Queue Controls */}
          <div className="flex items-center gap-2 flex-1 justify-between sm:justify-end w-full">
            {/* Mobile Buy button */}
            <Button
              size="sm"
              variant="cta"
              className="transition-colors text-xs h-8 sm:hidden"
              onClick={() => window.open(currentTrack.beatstarsLink || 'https://beatstars.com/catmatildabeat', '_blank')}
            >
              Buy
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowQueue(!showQueue)}
              className="h-8 w-8 p-0 text-black hover:text-black"
            >
              <List className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMute}
                className="h-8 w-8 p-0 text-black hover:text-black"
              >
                {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>

              <div className="w-24">
                <Slider
                  value={[isMuted ? 0 : volume * 100]}
                  onValueChange={(value) => handleVolumeChange([value[0] / 100])}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(true)} className="h-8 px-2 text-black">
              Hide
            </Button>
          </div>
        </div>
        )}

        {/* Queue Display */}
        {showQueue && queue.length > 0 && (
          <div className="mt-3 p-4 bg-muted/50 rounded-lg -mx-3 md:mx-0">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-sm">Queue ({queue.length} tracks)</h3>
              <Button variant="ghost" size="sm" onClick={clearQueue} className="text-xs">
                Clear Queue
              </Button>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {queue.map((track, index) => (
                <div
                  key={`${track.id}-${index}`}
                  className={`flex items-center gap-3 p-2 rounded ${
                    track.id === currentTrack.id ? "bg-brand-500/20" : "hover:bg-muted"
                  }`}
                >
                  <div className="w-8 h-8 rounded overflow-hidden flex-shrink-0">
                    <Image
                      src={track.coverImage || "/placeholder.svg?height=32&width=32"}
                      alt={track.title}
                      width={32}
                      height={32}
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{track.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                  </div>
                  {track.id === currentTrack.id && (
                    <div className="text-brand-500">
                      {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
