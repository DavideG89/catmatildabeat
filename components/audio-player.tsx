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

  const audioRef = useRef<HTMLAudioElement | null>(null)

  // In a real app, this would be a prop or from a context
  const audioSrc = "/demo-beat.mp3"
  const trackTitle = "Midnight Dreams"
  const artistName = "BeatVault"

  useEffect(() => {
    // Create audio element
    const audio = new Audio()
    audio.src = audioSrc
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

    // Clean up
    return () => {
      audio.pause()
      audio.removeEventListener("timeupdate", updateProgress)
      audio.removeEventListener("loadedmetadata", () => {})
      audio.removeEventListener("ended", () => {})
    }
  }, [audioSrc])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  const updateProgress = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
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
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  return (
    <div className="bg-zinc-900 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold">{trackTitle}</h3>
          <p className="text-sm text-gray-400">{artistName}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={toggleMute}>
            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </Button>
          <div className="w-24">
            <Slider value={[isMuted ? 0 : volume]} min={0} max={1} step={0.01} onValueChange={handleVolumeChange} />
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 mb-4">
        <span className="text-xs text-gray-400 w-10">{formatTime(currentTime)}</span>
        <Slider
          value={[currentTime]}
          min={0}
          max={duration || 100}
          step={0.1}
          onValueChange={handleProgressChange}
          className="flex-1"
        />
        <span className="text-xs text-gray-400 w-10">{formatTime(duration)}</span>
      </div>

      <div className="flex justify-center space-x-4">
        <Button variant="ghost" size="icon">
          <SkipBack className="h-5 w-5" />
        </Button>
        <Button
          onClick={togglePlay}
          className="bg-purple-600 hover:bg-purple-700 rounded-full h-12 w-12 flex items-center justify-center"
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </Button>
        <Button variant="ghost" size="icon">
          <SkipForward className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
