"use client"

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Download, Pause, Play, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useBeats } from "@/components/beats-context"
import { useAudioPlayer } from "@/components/audio-player-context"
import { featureFlags, scratchCardConfig } from "@/lib/feature-flags"

interface ScratchCardProps {
  children: ReactNode
  onReveal?: () => void
  revealThreshold?: number
  overlayContent?: ReactNode
}

const SCRATCH_CHECK_INTERVAL = 120
const SCRATCH_RADIUS = 42
const REVEAL_THRESHOLD = 0.3

const ScratchCard = ({ children, onReveal, revealThreshold = REVEAL_THRESHOLD, overlayContent }: ScratchCardProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const contextRef = useRef<CanvasRenderingContext2D | null>(null)
  const dprRef = useRef<number>(1)
  const lastCheckRef = useRef<number>(0)
  const revealedRef = useRef<boolean>(false)
  const [isDrawing, setIsDrawing] = useState(false)
  const [isRevealed, setIsRevealed] = useState(false)
  const [scratchedPercent, setScratchedPercent] = useState(0)

  const initializeCanvas = useCallback(() => {
    const container = containerRef.current
    const canvas = canvasRef.current

    if (!container || !canvas) return

    const context = canvas.getContext("2d", { willReadFrequently: true })
    if (!context) return

    const rect = container.getBoundingClientRect()
    const devicePixelRatio = window.devicePixelRatio || 1

    dprRef.current = devicePixelRatio

    canvas.width = Math.max(rect.width, 1) * devicePixelRatio
    canvas.height = Math.max(rect.height, 1) * devicePixelRatio
    canvas.style.width = `${rect.width}px`
    canvas.style.height = `${rect.height}px`

    const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0, "rgba(17, 24, 39, 0.94)")
    gradient.addColorStop(0.35, "rgba(30, 64, 175, 0.93)")
    gradient.addColorStop(1, "rgba(59, 130, 246, 0.9)")

    context.globalCompositeOperation = "source-over"
    context.fillStyle = gradient
    context.fillRect(0, 0, canvas.width, canvas.height)

    // Light noise to make scratching feel tactile
    context.fillStyle = "rgba(255,255,255,0.05)"
    for (let i = 0; i < 1200; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      context.fillRect(x, y, 2, 2)
    }

    contextRef.current = context
    lastCheckRef.current = 0
    if (!revealedRef.current) {
      setScratchedPercent(0)
    }
  }, [])

  useEffect(() => {
    initializeCanvas()

    const handleResize = () => {
      if (!revealedRef.current) {
        initializeCanvas()
      }
    }

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [initializeCanvas])

  const measureScratchedArea = useCallback(() => {
    const canvas = canvasRef.current
    const context = contextRef.current
    if (!canvas || !context) return

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
    const totalPixels = imageData.data.length / 4
    let transparentPixels = 0

    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] === 0) {
        transparentPixels++
      }
    }

    const percent = transparentPixels / totalPixels
    setScratchedPercent(percent)

    if (percent >= revealThreshold && !revealedRef.current) {
      revealedRef.current = true
      setScratchedPercent(1)
      setIsRevealed(true)
      onReveal?.()
    }
  }, [onReveal, revealThreshold])

  const scratchAt = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = canvasRef.current
      const context = contextRef.current

      if (!canvas || !context) return

      const rect = canvas.getBoundingClientRect()
      const dpr = dprRef.current
      const x = (clientX - rect.left) * dpr
      const y = (clientY - rect.top) * dpr
      const radius = SCRATCH_RADIUS * dpr

      context.globalCompositeOperation = "destination-out"
      context.beginPath()
      context.arc(x, y, radius, 0, Math.PI * 2, false)
      context.fill()
      context.closePath()
      context.globalCompositeOperation = "source-over"

      const now = performance.now()
      if (now - lastCheckRef.current > SCRATCH_CHECK_INTERVAL) {
        lastCheckRef.current = now
        requestAnimationFrame(() => measureScratchedArea())
      }
    },
    [measureScratchedArea],
  )

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (isRevealed) return
    setIsDrawing(true)
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    scratchAt(event.clientX, event.clientY)
    measureScratchedArea()
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || isRevealed) return
    event.preventDefault()
    scratchAt(event.clientX, event.clientY)
    measureScratchedArea()
  }

  const handlePointerUp = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    event.preventDefault()
    setIsDrawing(false)
    event.currentTarget.releasePointerCapture(event.pointerId)
    measureScratchedArea()
  }

  useEffect(() => {
    revealedRef.current = isRevealed
  }, [isRevealed])

  const progressPercent = Math.min(Math.round(scratchedPercent * 100), 100)

  const promptContent = overlayContent ?? (
    <div className="flex flex-col items-center gap-3 text-white">
      <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.35em] text-white/70">
        <Sparkles className="h-4 w-4" />
        Scratch
      </div>
      <p className="text-lg font-medium text-white/90">Gratta la card per sbloccare il beat gratuito</p>
    </div>
  )

  return (
    <div ref={containerRef} className="relative h-full">
      <div className="relative h-full overflow-hidden rounded-3xl border border-white/10 bg-slate-950">
        <div
          className={`absolute inset-0 z-0 flex h-full w-full flex-col items-center justify-center gap-5 p-8 text-center transition-all duration-500 ${
            isRevealed ? "pointer-events-none opacity-0 -translate-y-2" : "opacity-100 translate-y-0"
          }`}
          aria-hidden={isRevealed}
        >
          {promptContent}
          <div className="text-xs uppercase tracking-widest text-white/60">{progressPercent}% completato</div>
        </div>

        <div
          className={`absolute inset-0 z-0 h-full w-full transition-all duration-500 ${
            isRevealed ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-4"
          }`}
          aria-hidden={!isRevealed}
        >
          <div className="relative h-full w-full">{children}</div>
        </div>

        <canvas
          ref={canvasRef}
          className={`absolute inset-0 z-10 h-full w-full cursor-pointer transition-opacity duration-500 ${
            isRevealed ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
          style={{ touchAction: "none" }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        />
      </div>
    </div>
  )
}

const ScratchBeatSection = () => {
  const { scratchCard } = featureFlags
  const { getActiveBeat } = useBeats()
  const { currentTrack, isPlaying, playTrack, togglePlayPause } = useAudioPlayer()
  const [isRevealed, setIsRevealed] = useState(false)

  if (!scratchCard) {
    return null
  }

  const activeBeat = scratchCardConfig.beatId ? getActiveBeat(scratchCardConfig.beatId) : null

  const resolvedBeat = activeBeat || {
    id: "scratch-card-free-beat",
    title: "Catnip Dreams",
    producer: "Cat Matilda Beat",
    cover_image: scratchCardConfig.coverImage,
    audio_file: scratchCardConfig.downloadUrl,
    bpm: 88,
    key: "Dm",
    genre: "Lo-Fi",
    tags: ["lo-fi", "calm", "midnight"],
    status: "active" as const,
    categories: [],
    beatstars_link: scratchCardConfig.downloadUrl,
    sales: 0,
    description:
      "A royalty-free lo-fi beat with mellow drums and dreamy chords. Perfect for content creators, freestyles, and storytelling.",
    duration: "02:46",
    price: 0,
    created_at: "",
    updated_at: "",
  }

  const downloadUrl = scratchCardConfig.downloadUrl || activeBeat?.audio_file || activeBeat?.beatstars_link || ""
  const canDownload = Boolean(downloadUrl)
  const canStream = Boolean(activeBeat?.audio_file)
  const isCurrentTrack = currentTrack?.id === resolvedBeat.id

  const handleReveal = () => {
    setIsRevealed(true)
  }

  const handlePlay = () => {
    if (!canStream) return

    if (isCurrentTrack) {
      togglePlayPause()
      return
    }

    playTrack({
      id: resolvedBeat.id,
      title: resolvedBeat.title,
      artist: resolvedBeat.producer,
      audioSrc: resolvedBeat.audio_file || "",
      coverImage: resolvedBeat.cover_image,
      beatstarsLink: resolvedBeat.beatstars_link,
      durationString: resolvedBeat.duration,
    })
  }

  const handleDownload = () => {
    if (!canDownload) return
    window.open(downloadUrl, "_blank", "noopener,noreferrer")
  }

  return (
    <section className="relative py-14 md:py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-black" aria-hidden="true" />
      <div className="container relative mx-auto px-4">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-6 text-white"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white/80">
              <Sparkles className="h-4 w-4" />
              Exclusive Drop
            </div>
            <h2 className="font-heading text-3xl font-bold sm:text-4xl md:text-5xl">
              {scratchCardConfig.headline}
            </h2>
            <p className="max-w-xl text-base text-white/80 sm:text-lg">
              {scratchCardConfig.subheadline}
            </p>
            <ul className="space-y-2 text-sm text-white/70">
              <li>• Personal or commercial use with full WAV quality.</li>
              <li>• No strings attached — credit Cat Matilda Beat when you publish.</li>
              <li>• Feature flag ready: toggle via `NEXT_PUBLIC_ENABLE_SCRATCH_CARD`.</li>
            </ul>
            {isRevealed ? (
              <div className="rounded-2xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
                Free beat unlocked! Download it below and let the creativity flow.
              </div>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
                Scratch the card to unveil the hidden beat and instant download link.
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            viewport={{ once: true }}
          >
            <ScratchCard
              onReveal={handleReveal}
              overlayContent={
                <div className="flex flex-col items-center gap-3 text-white">
                  <div className="text-xs font-semibold uppercase tracking-[0.4em] text-white/70">Gratta la card</div>
                  <p className="max-w-xs text-sm text-white/75 sm:text-base">
                    Usa il dito o il mouse per rimuovere il rivestimento. Al 30% il beat gratuito si svelerà con il link di download.
                  </p>
                </div>
              }
            >
              <div className="relative h-full min-h-[360px] overflow-hidden rounded-3xl bg-slate-950">
                <Image
                  src={resolvedBeat.cover_image || "/img/CatMatildaStudio.jpg"}
                  alt={resolvedBeat.title}
                  fill
                  className="object-cover opacity-60"
                  sizes="(min-width: 1024px) 480px, 100vw"
                  priority={false}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950/70 via-slate-950/60 to-brand-600/50" aria-hidden="true" />
                <div className="relative z-10 flex h-full flex-col justify-between p-8">
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white/80">
                      Hidden Beat
                    </div>
                    <div>
                      <h3 className="font-heading text-2xl font-bold text-white sm:text-3xl">
                        {resolvedBeat.title}
                      </h3>
                      <p className="text-sm text-white/70">Produced by {resolvedBeat.producer}</p>
                    </div>
                    <div className="flex flex-wrap gap-4 text-xs text-white/75">
                      <span>BPM {resolvedBeat.bpm || "?"}</span>
                      <span>Key {resolvedBeat.key || "?"}</span>
                      <span>{resolvedBeat.genre || "Genre"}</span>
                    </div>
                    <p className="text-sm text-white/70">
                      {resolvedBeat.description || "Unlock this exclusive Cat Matilda Beat scratch card to reveal a free download and vibe."}
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button
                      className="flex-1"
                      size="lg"
                      variant="secondary"
                      onClick={handlePlay}
                      disabled={!canStream}
                    >
                      {isCurrentTrack && isPlaying ? (
                        <>
                          <Pause className="mr-2 h-4 w-4" />
                          Pause Preview
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-4 w-4" />
                          Play Preview
                        </>
                      )}
                    </Button>
                    <Button
                      className="flex-1"
                      size="lg"
                      onClick={handleDownload}
                      disabled={!canDownload}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Free Download
                    </Button>
                  </div>
                </div>
              </div>
            </ScratchCard>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default ScratchBeatSection
