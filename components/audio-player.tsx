"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)

  // In a real app, this would be a prop or from a context
  const audioSrc = "/demo-beat.mp3"
  const trackTitle = "Midnight Dreams"
  const artistName = "BeatVault"

  useEffect(() => {
    // Create audio element
    const audio = new Audio()
    audio.preload = "metadata"
    audio.src = audioSrc
    audioRef.current = audio

    // Set up event listeners
    const updateProgress = () => {
      if (audio && !isNaN(audio.currentTime)) {
        setCurrentTime(audio.currentTime)
      }
    }

    const handleLoadedMetadata = () => {
      if (audio && !isNaN(audio.duration)) {
        setDuration(audio.duration)
        setIsLoading(false)
      }
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }

    const handleLoadStart = () => {
      setIsLoading(true)
    }

    const handleCanPlay = () => {
      setIsLoading(false)
    }

    const handleError = () => {
      setIsLoading(false)
      console.error("Audio loading error")
    }

    audio.addEventListener("timeupdate", updateProgress)
    audio.addEventListener("loadedmetadata", handleLoadedMetadata)
    audio.addEventListener("ended", handleEnded)
    audio.addEventListener("loadstart", handleLoadStart)
    audio.addEventListener("canplay", handleCanPlay)
    audio.addEventListener("error", handleError)

    // Set initial volume
    audio.volume = volume

    // Clean up
    return () => {
      audio.pause()
      audio.removeEventListener("timeupdate", updateProgress)
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
      audio.removeEventListener("ended", handleEnded)
      audio.removeEventListener("loadstart", handleLoadStart)
      audio.removeEventListener("canplay", handleCanPlay)
      audio.removeEventListener("error", handleError)
    }
  }, [audioSrc])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  const togglePlay = async () => {
    if (!audioRef.current) return

    try {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        setIsLoading(true)
        await audioRef.current.play()
        setIsPlaying(true)
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Error playing audio:", error)
      setIsPlaying(false)
      setIsLoading(false)
    }
  }

  const handleProgressChange = (value: number[]) => {
    if (audioRef.current && !isNaN(value[0])) {
      const newTime = value[0]
      audioRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const skipForward = () => {
    if (audioRef.current) {
      const newTime = Math.min(currentTime + 10, duration)
      audioRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const skipBackward = () => {
    if (audioRef.current) {
      const newTime = Math.max(currentTime - 10, 0)
      audioRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  return (
    <div className="bg-zinc-900 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-lg">{trackTitle}</h3>
          <p className="text-sm text-gray-400">{artistName}</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="tertiary" size="icon" onClick={toggleMute} className="h-8 w-8">
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          <div className="w-24">
            <Slider
              value={[isMuted ? 0 : volume]}
              min={0}
              max={1}
              step={0.01}
              onValueChange={handleVolumeChange}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-3 mb-6">
        <span className="text-xs text-gray-400 w-12 text-right">{formatTime(currentTime)}</span>
        <Slider
          value={[currentTime]}
          min={0}
          max={duration || 100}
          step={0.1}
          onValueChange={handleProgressChange}
          className="flex-1"
          disabled={isLoading}
        />
        <span className="text-xs text-gray-400 w-12">{formatTime(duration)}</span>
      </div>

      <div className="flex justify-center items-center space-x-4">
        <Button variant="tertiary" size="icon" onClick={skipBackward} className="h-10 w-10" disabled={isLoading}>
          <SkipBack className="h-5 w-5" />
        </Button>

        <Button
          onClick={togglePlay}
          disabled={isLoading}
          className="bg-purple-600 hover:bg-purple-700 rounded-full h-14 w-14 flex items-center justify-center"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : isPlaying ? (
            <Pause className="h-6 w-6" />
          ) : (
            <Play className="h-6 w-6" />
          )}
        </Button>

        <Button variant="tertiary" size="icon" onClick={skipForward} className="h-10 w-10" disabled={isLoading}>
          <SkipForward className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
