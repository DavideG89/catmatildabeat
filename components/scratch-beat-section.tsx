"use client"

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import { Download, Pause, Play, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useBeats } from "@/components/beats-context"
import { useAudioPlayer } from "@/components/audio-player-context"
import { featureFlags, scratchCardConfig } from "@/lib/feature-flags"
import type { Beat } from "@/lib/supabase"

interface ScratchCardProps {
  children: ReactNode
  onReveal?: () => void
  revealThreshold?: number
}

const SCRATCH_CHECK_INTERVAL = 90
const SCRATCH_RADIUS = 36
const REVEAL_THRESHOLD = 0.2

const ScratchCard = ({ children, onReveal, revealThreshold = REVEAL_THRESHOLD }: ScratchCardProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const contextRef = useRef<CanvasRenderingContext2D | null>(null)
  const dprRef = useRef<number>(1)
  const lastCheckRef = useRef<number>(0)
  const revealedRef = useRef<boolean>(false)

  const [isDrawing, setIsDrawing] = useState(false)
  const [isRevealed, setIsRevealed] = useState(false)
  const [scratchedPercent, setScratchedPercent] = useState(0)

  const renderCover = useCallback(() => {
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

    context.save()
    context.setTransform(1, 0, 0, 1, 0, 0)
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.scale(devicePixelRatio, devicePixelRatio)

    const width = rect.width
    const height = rect.height

    const gradient = context.createLinearGradient(0, 0, width, height)
    gradient.addColorStop(0, "rgba(17, 24, 39, 0.96)")
    gradient.addColorStop(0.4, "rgba(30, 64, 175, 0.92)")
    gradient.addColorStop(1, "rgba(59, 130, 246, 0.88)")

    context.globalCompositeOperation = "source-over"
    context.fillStyle = gradient
    context.fillRect(0, 0, width, height)

    const noiseDensity = Math.floor((width * height) / 45)
    context.fillStyle = "rgba(255,255,255,0.07)"
    for (let i = 0; i < noiseDensity; i++) {
      const x = Math.random() * width
      const y = Math.random() * height
      context.fillRect(x, y, 1.3, 1.3)
    }

    context.fillStyle = "rgba(255,255,255,0.88)"
    context.textAlign = "center"
    context.font = "700 22px 'Inter', sans-serif"
    context.fillText("Scratch the card", width / 2, height / 2 - 6)
    context.font = "500 16px 'Inter', sans-serif"


    context.restore()

    contextRef.current = context
    lastCheckRef.current = 0
    revealedRef.current = false
    setScratchedPercent(0)
    setIsRevealed(false)
  }, [])

  useEffect(() => {
    renderCover()

    const handleResize = () => {
      if (!revealedRef.current) {
        renderCover()
      }
    }

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [renderCover])

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
      setIsRevealed(true)
      onReveal?.()
    }
  }, [onReveal, revealThreshold])

  const scratchAt = useCallback(
    (clientX: number, clientY: number, forceCheck = false) => {
      const canvas = canvasRef.current
      const context = contextRef.current

      if (!canvas || !context || revealedRef.current) return

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
      if (forceCheck || now - lastCheckRef.current > SCRATCH_CHECK_INTERVAL) {
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
    scratchAt(event.clientX, event.clientY, true)
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || isRevealed) return
    event.preventDefault()
    scratchAt(event.clientX, event.clientY)
  }

  const finishDrawing = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    event.preventDefault()
    setIsDrawing(false)
    event.currentTarget.releasePointerCapture(event.pointerId)
    measureScratchedArea()
  }

  useEffect(() => {
    revealedRef.current = isRevealed
  }, [isRevealed])

  return (
    <div ref={containerRef} className="relative h-full">
      <div className="relative h-full overflow-hidden rounded-3xl border border-white/10 bg-slate-950">
        {!isRevealed && (
          <div className="absolute left-4 top-4 z-20 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-white/80">
            {Math.min(100, Math.round(scratchedPercent * 100))}%
          </div>
        )}

        <div
          className={`pointer-events-none absolute inset-0 z-10 flex h-full w-full items-center justify-center transition-opacity duration-500 ${
            isRevealed ? "opacity-0" : scratchedPercent > 0.2 ? "opacity-15" : scratchedPercent > 0.05 ? "opacity-40" : "opacity-85"
          }`}
        >
        {  /* <div className="rounded-full border border-white/25 bg-black/35 px-5 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-white/85 backdrop-blur">
            Scratch the card to reveal
          </div> */}
        </div>

        <div
          className={`relative h-full w-full transition-opacity duration-500 ${
            isRevealed ? "opacity-100" : "opacity-0"
          }`}
        >
          {children}
        </div>

        <canvas
          ref={canvasRef}
          className={`absolute inset-0 z-30 h-full w-full cursor-pointer transition-opacity duration-500 ${
            isRevealed ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
          style={{ touchAction: "none" }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={finishDrawing}
          onPointerLeave={finishDrawing}
        />
      </div>
    </div>
  )
}

const ScratchBeatSection = () => {
  const { scratchCard } = featureFlags
  const { beats } = useBeats()
  const { currentTrack, isPlaying, playTrack, togglePlayPause } = useAudioPlayer()
  const [isRevealed, setIsRevealed] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  if (!scratchCard) {
    return null
  }

  const activeBeats = useMemo(() => beats.filter((beat) => beat.status === "active"), [beats])

  const displayBeat: Beat = useMemo(() => {
    if (scratchCardConfig.beatId) {
      const configured = activeBeats.find((beat) => beat.id === scratchCardConfig.beatId)
      if (configured) return configured
    }

    if (activeBeats.length > 0) {
      return activeBeats[Math.floor(Math.random() * activeBeats.length)]
    }

    return {
      id: "scratch-card-free-beat",
      title: "Catnip Dreams",
      producer: "Cat Matilda Beat",
      cover_image: scratchCardConfig.coverImage,
      audio_file: scratchCardConfig.downloadUrl,
      bpm: 88,
      key: "Dm",
      genre: "Lo-Fi",
      tags: ["lo-fi", "calm", "midnight"],
      status: "active",
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
  }, [activeBeats])

  const downloadUrl = displayBeat.audio_file || displayBeat.beatstars_link || scratchCardConfig.downloadUrl || ""
  const canDownload = Boolean(downloadUrl)
  const canStream = Boolean(displayBeat.audio_file)
  const isCurrentTrack = currentTrack?.id === displayBeat.id

  const handleReveal = () => {
    setIsRevealed(true)
  }

  useEffect(() => {
    if (isRevealed) {
      setShowCelebration(true)
      const timer = setTimeout(() => setShowCelebration(false), 1500)
      return () => clearTimeout(timer)
    }
  }, [isRevealed])

  const handlePlay = () => {
    if (!canStream) return

    if (isCurrentTrack) {
      togglePlayPause()
      return
    }

    playTrack({
      id: displayBeat.id,
      title: displayBeat.title,
      artist: displayBeat.producer,
      audioSrc: displayBeat.audio_file || "",
      coverImage: displayBeat.cover_image,
      beatstarsLink: displayBeat.beatstars_link,
      durationString: displayBeat.duration,
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
              Scratch the card to reveal the Beat
            </h2>
            <p className="max-w-xl text-base text-white/80 sm:text-lg">
              Scratch below to uncover a surprise Cat Matilda beat. Once you clear about 20% of the foil, the beat unlocks with full preview and download.
            </p>
            <ul className="space-y-2 text-sm text-white/70">
              <li>• Gratta almeno il 20% della card per completare il gioco.</li>
              <li>• Beat gratuito pronto per l&apos;uso personale o commerciale (ricordati di citare Cat Matilda).</li>
              <li>• Il contenuto rimane nascosto finché la scratch card non è completata.</li>
            </ul>
           {/*  {isRevealed ? (
              <div className="rounded-2xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
                That&apos;s great! You got this beat: <span className="font-semibold text-white">{displayBeat.title}</span>. Download it below and let the creativity flow.
              </div>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
                Scratch the card to unveil the hidden beat and instant download link.
              </div>
            )}*/}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            viewport={{ once: true }}
          >
            <ScratchCard onReveal={handleReveal}>
              <div className="relative h-full min-h-[360px] overflow-hidden rounded-3xl bg-slate-950">
                <AnimatePresence>
                  {showCelebration && (
                    <motion.div
                      key="celebration"
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.1 }}
                      transition={{ duration: 0.45, ease: "easeOut" }}
                      className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center"
                    >
                      <div className="flex min-w-[200px] items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-400/20 px-6 py-2 text-sm font-semibold uppercase tracking-[0.35em] text-emerald-100 shadow-lg backdrop-blur">
                        <Sparkles className="h-4 w-4" />
                        Beat Unlocked
                        <Sparkles className="h-4 w-4" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <Image
                  src={displayBeat.cover_image || "/img/CatMatildaStudio.jpg"}
                  alt={displayBeat.title}
                  fill
                  className={`object-cover transition duration-500 ${isRevealed ? "opacity-100" : "blur-sm scale-105 opacity-35"}`}
                  sizes="(min-width: 1024px) 480px, 100vw"
                  priority={false}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-slate-950/65 to-brand-600/45" aria-hidden="true" />
                <div className="relative z-10 flex h-full flex-col justify-between gap-6 p-6 sm:p-8 lg:p-10">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white/80">
                      {isRevealed ? "Beat unlocked" : "Keep scratching"}
                    </div>
                    <div>
                      <h3 className="font-heading text-2xl font-bold text-white sm:text-3xl">
                        {isRevealed ? displayBeat.title : "??? ???"}
                      </h3>
                      <p className="text-sm text-white/70">
                        {isRevealed ? `Produced by ${displayBeat.producer}` : "Scratch a little more to reveal the producer"}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-4 text-xs text-white/75">
                      <span>{isRevealed && displayBeat.bpm ? `BPM ${displayBeat.bpm}` : "BPM ???"}</span>
                      <span>{isRevealed && displayBeat.key ? `Key ${displayBeat.key}` : "Key ???"}</span>
                      <span>{isRevealed ? displayBeat.genre || "Genre" : "Genre ???"}</span>
                    </div>
                    <p className="text-sm text-white/70">
                      {isRevealed
                        ? displayBeat.description ||
                          "Enjoy this exclusive Cat Matilda Beat and let it spark your next creative idea."
                        : "Continua a grattare per sbloccare titolo, dettagli e download del beat gratuito."}
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button
                      className="flex-1"
                      size="lg"
                      variant="secondary"
                      onClick={handlePlay}
                      disabled={!isRevealed || !canStream}
                    >
                      {isRevealed ? (
                        isCurrentTrack && isPlaying ? (
                          <>
                            <Pause className="mr-2 h-4 w-4" />
                            Pause Preview
                          </>
                        ) : (
                          <>
                            <Play className="mr-2 h-4 w-4" />
                            Play Preview
                          </>
                        )
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Unlock to listen
                        </>
                      )}
                    </Button>
                    <Button
                      className="flex-1"
                      size="lg"
                      onClick={handleDownload}
                      disabled={!isRevealed || !canDownload}
                    >
                      {isRevealed ? (
                        <>
                          <Download className="mr-2 h-4 w-4" />
                          Free Download
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Unlock to download
                        </>
                      )}
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
