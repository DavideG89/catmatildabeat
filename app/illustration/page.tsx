"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent } from "react"
import Link from "next/link"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowLeft, ArrowRight, X } from "lucide-react"

import { Button } from "@/components/ui/button"

type IllustrationSlide = {
  id: string
  region: string
  headline: string
  description: string
  cardTitle: string
  cardSubtitle: string
  image: {
    src: string
    width: number
    height: number
  }
}

type StorySlide = {
  id: string
  src: string
  alt: string
  width: number
  height: number
}

type StoryCatalog = {
  id: string
  title: string
  subtitle?: string
  cover: { src: string; width: number; height: number; alt: string }
  slides: StorySlide[]
  published?: boolean
}

const slides: IllustrationSlide[] = [
  {
    id: "keeper-of-midnight",
    region: "Moonlit Series",
    headline: "Keeper of Midnight",
    description:
      "Visione onirica che racconta la Matilda notturna: texture vaporose, lune luminose e silhouette felina sospesa tra sogno e reale.",
    cardTitle: "Design One",
    cardSubtitle: "Digital dreamscape",
    image: {
      src: "/Illustrazioni/Quadro%201.jpg",
      width: 1280,
      height: 983,
    },
  },
  {
    id: "neon-promenade",
    region: "Chromatic Stories",
    headline: "Neon Promenade",
    description:
      "Passeggiata urbana illuminata da luci neon. Ideale per release uptempo e cinematiche, con vibrazioni metropolitane.",
    cardTitle: "Design Two",
    cardSubtitle: "Urban pulse",
    image: {
      src: "/Illustrazioni/Quadro%202.jpg",
      width: 1280,
      height: 983,
    },
  },
  {
    id: "aurora-trails",
    region: "Northern Echoes",
    headline: "Aurora Trails",
    description:
      "Un viaggio tra colline ghiacciate e cieli magnetici. Palette pastello e grana cinematografica per soundscapes sospesi.",
    cardTitle: "Design Three",
    cardSubtitle: "Dawn reverie",
    image: {
      src: "/Illustrazioni/Quadro%203.jpg",
      width: 1280,
      height: 983,
    },
  },
  {
    id: "tidal-echoes",
    region: "Liquid Horizons",
    headline: "Tidal Echoes",
    description:
      "Onde che si trasformano in nuvole. Splash art perfetta per i mood chill che scivolano tra ambient e downtempo.",
    cardTitle: "Design Four",
    cardSubtitle: "Misty altitude",
    image: {
      src: "/Illustrazioni/Quadro%204.jpg",
      width: 1280,
      height: 983,
    },
  },
]

const heroSlides: StorySlide[] = slides.map((slide, index) => ({
  id: slide.id,
  src: slide.image.src,
  alt: slide.cardTitle || `Slide ${index + 1}`,
  width: slide.image.width,
  height: slide.image.height,
}))

const spookySlides: StorySlide[] = Array.from({ length: 9 }, (_, index) => ({
  id: `spooky-${index + 1}`,
  src: `/Carousel/Spooky%20Nights/spoky%20night%20${index + 1}.jpg`,
  alt: `Spooky night illustration ${index + 1}`,
  width: 1600,
  height: 1200,
}))

const aPinchOfBadLuckSlides: StorySlide[] = Array.from({ length: 6 }, (_, index) => ({
  id: `apinch-${index + 1}`,
  src: `/Carousel/a Pinch of bad luck/Tavola${index + 1}.jpg`,
  alt: `A pinch of bad luck ${index + 1}`,
  width: 1600,
  height: 1200,
}))

const storyCatalogs: StoryCatalog[] = [
  {
    id: "spooky",
    title: "Spookie Night",
    subtitle: "Dreamy nocturnes & feline adventures",
    cover: { src: "/Carousel/Spooky%20Nights/spoky%20night%201.jpg", width: 1600, height: 1200, alt: "Spookie Night cover" },
    slides: spookySlides,
    published: true,
  },
  {
    id: "a-pinch-of-bad-luck",
    title: "A Pinch of Bad Luck",
    subtitle: "An unfortunate but pleasant ending",
    cover: { src: "/Carousel/a Pinch of bad luck/Copertina.jpg", width: 1600, height: 1200, alt: "A Pinch of Bad Luck cover" },
    slides: aPinchOfBadLuckSlides,
    published: true,
  },
]

const heroStory = {
  id: "__hero__",
  title: "Illustration",
  slides: heroSlides,
}

export default function IllustrationPage() {
  const scrollLockRef = useRef(0)
  const galleryRef = useRef<HTMLDivElement>(null)
  const dragStateRef = useRef({
    isPointerDown: false,
    startX: 0,
    scrollLeft: 0,
    moved: false,
    preventClick: false,
  })
  const [isDraggingGallery, setIsDraggingGallery] = useState(false)
  const [openStoryId, setOpenStoryId] = useState<string | null>(null)
  const [storyIndex, setStoryIndex] = useState(0)

  const lockScroll = useCallback(() => {
    scrollLockRef.current = window.scrollY
    document.documentElement.style.overflow = "hidden"
    document.body.style.overflow = "hidden"
    document.body.style.position = "fixed"
    document.body.style.top = `-${scrollLockRef.current}px`
    document.body.style.width = "100%"
  }, [])

  const unlockScroll = useCallback(() => {
    document.body.style.overflow = ""
    document.documentElement.style.overflow = ""
    document.body.style.position = ""
    document.body.style.top = ""
    document.body.style.width = ""
    window.scrollTo(0, scrollLockRef.current)
  }, [])

  const openHeroLightbox = useCallback(
    (index = 0) => {
      setOpenStoryId("__hero__")
      setStoryIndex(index)
      lockScroll()
    },
    [lockScroll],
  )

  const openLightbox = useCallback(
    (storyId: string, index = 0) => {
      setOpenStoryId(storyId)
      setStoryIndex(index)
      lockScroll()
    },
    [lockScroll],
  )

  const closeLightbox = useCallback(() => {
    setOpenStoryId(null)
    unlockScroll()
  }, [unlockScroll])

  const openStory = openStoryId === "__hero__" ? heroStory : storyCatalogs.find((story) => story.id === openStoryId) || null

  const handleGalleryPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || !galleryRef.current) return
    dragStateRef.current.isPointerDown = true
    dragStateRef.current.startX = event.clientX
    dragStateRef.current.scrollLeft = galleryRef.current.scrollLeft
    dragStateRef.current.moved = false
    dragStateRef.current.preventClick = false
    setIsDraggingGallery(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handleGalleryPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragStateRef.current.isPointerDown || !galleryRef.current) return
    event.preventDefault()
    const deltaX = event.clientX - dragStateRef.current.startX
    if (Math.abs(deltaX) > 2) {
      dragStateRef.current.moved = true
    }
    galleryRef.current.scrollLeft = dragStateRef.current.scrollLeft - deltaX
  }

  const endGalleryDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragStateRef.current.isPointerDown) return
    dragStateRef.current.isPointerDown = false
    dragStateRef.current.preventClick = dragStateRef.current.moved
    dragStateRef.current.moved = false
    setIsDraggingGallery(false)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  const handleSlideClick = (event: ReactMouseEvent<HTMLButtonElement>, index: number) => {
    if (dragStateRef.current.preventClick) {
      event.preventDefault()
      dragStateRef.current.preventClick = false
      return
    }
    openHeroLightbox(index)
  }

  const prevStorySlide = useCallback(() => {
    if (!openStory) return
    setStoryIndex((previous) => (previous - 1 + openStory.slides.length) % openStory.slides.length)
  }, [openStory])

  const nextStorySlide = useCallback(() => {
    if (!openStory) return
    setStoryIndex((previous) => (previous + 1) % openStory.slides.length)
  }, [openStory])

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!openStory) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox()
      if (e.key === "ArrowLeft") prevStorySlide()
      if (e.key === "ArrowRight") nextStorySlide()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [closeLightbox, nextStorySlide, openStory, prevStorySlide])

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Hero Section */}
      <section className="container flex flex-1 flex-col justify-end px-6 pb-12 pt-6 md:px-12 lg:px-16 lg:pb-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="flex flex-col gap-10">
            <div className="space-y-3">
              <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                Illustration
              </h1>
              <p className="max-w-xl text-sm text-muted-foreground sm:text-base">
                Explore Matilda&apos;s visual universe: curated digital and mixed-media pieces crafted to set the mood for your stories, releases, and campaigns.
              </p>
            </div>


            <div className="flex flex-wrap items-center gap-4">
              <Button className="rounded-full bg-brand-600 px-6 py-5 text-xs uppercase tracking-[0.32em] text-white hover:bg-brand-500" asChild>
                <Link href="/contact">Request Artwork</Link>
              </Button>
            </div>
            
          </div>
          <div className="">
            <Image
              src="/MatildaPost2.jpeg"
              width={400}
              height={500}
              alt="Matilda Cat Music illustration poster">
            </Image>
          </div>
        </div>

       
      </section>
      {/* Illustrations Section */}
      <section className="border-t border-border bg-muted/20" aria-labelledby="illustrations-title">
        <div className="container px-6 py-16 md:px-12 lg:px-16">
          <div className="mb-8 text-left">
            <span className="text-xs font-semibold uppercase tracking-[0.42em] text-muted-foreground">Art</span>
            <h2 id="illustrations-title" className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Matilda&apos;s Illustrations</h2>
            <p className="mx-auto mt-2 text-sm text-muted-foreground sm:text-base">Scroll through a selection of dreamy frames.</p>
          </div>
          <div
            ref={galleryRef}
            className={`illustration-scroll -mx-6 mt-10 overflow-x-auto px-6 pb-4 md:-mx-12 md:px-12 lg:-mx-16 lg:px-16 ${isDraggingGallery ? "cursor-grabbing" : "cursor-grab"}`}
            onPointerDown={handleGalleryPointerDown}
            onPointerMove={handleGalleryPointerMove}
            onPointerUp={endGalleryDrag}
            onPointerLeave={endGalleryDrag}
            onPointerCancel={endGalleryDrag}
          >
            <div className="flex gap-6">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={(event) => handleSlideClick(event, index)}
                  className="group relative h-[340px] min-w-[340px] overflow-hidden rounded-[16px] bg-background shadow-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/40 sm:min-w-[300px] lg:h-[420px] lg:min-w-[600px]"
                  aria-label={`Apri illustrazione ${slide.cardTitle}`}
                >
                  <Image
                    src={slide.image.src}
                    alt={slide.cardTitle}
                    fill
                    sizes="(min-width: 1024px) 360px, (min-width: 640px) 300px, 240px"
                    className="object-full transition-transform duration-300 group-hover:scale-[1.01]"
                  />
                  <span className="sr-only">{slide.cardTitle}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stories Catalog Grid */}
      <section className="border-t border-border bg-muted/20" aria-labelledby="stories-grid-title">
        <div className="container px-6 py-16 md:px-12 lg:px-16">
          <div className="mb-8 text-left">
            <span className="text-xs font-semibold uppercase tracking-[0.42em] text-muted-foreground">Stories</span>
            <h2 id="stories-grid-title" className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Matilda&apos;s Adventure</h2>
            <p className="mx-auto mt-2  text-sm text-muted-foreground sm:text-base">Choose a story from our Catalog.</p>
          </div>

          {(() => {
            const visibleCatalogs = storyCatalogs.filter((s) => s.published)
            const single = visibleCatalogs.length === 1
            return (
              <div className={`grid gap-6 ${single ? "grid-cols-1 max-w-xl" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}>
                {visibleCatalogs.map((story) => (
                  <button
                    key={story.id}
                    type="button"
                    onClick={() => openLightbox(story.id, 0)}
                    className="group relative block h-[400px] w-[300px] overflow-hidden rounded-[28px] bg-background text-left shadow-md transition hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/40"
                    aria-label={`Apri la storia ${story.title}`}
                  >
                    <div className="relative h-full w-full">
                      <Image
                        src={story.cover.src}
                        alt={story.cover.alt}
                        fill
                        sizes="(min-width:1280px) 33vw, (min-width:768px) 50vw, 100vw"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 flex items-end">
                        <div className="w-full bg-gradient-to-t from-black/40 via-black/50 to-transparent p-4 text-white">
                          <h3 className="text-base font-semibold leading-tight">{story.title}</h3>
                          {story.subtitle && <p className="text-xs text-white/70">{story.subtitle}</p>}
                          <p className="mt-1 text-[0.7rem] uppercase tracking-[0.32em] text-white/60">
                            {String(story.slides.length).padStart(2, "0")} images
                          </p>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )
          })()}
        </div>
      </section>

      {/* Stories Catalog Lightbox */}
      <AnimatePresence>
        {openStory && (
          <motion.div
            key={`story-lightbox-${openStory.id}`}
            className="fixed inset-0 z-50 flex min-h-[100dvh] flex-col bg-black/95 overscroll-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            <div className="flex items-center justify-between px-4 pt-[calc(env(safe-area-inset-top)+16px)]">
              <span className="text-xs tabular-nums tracking-[0.2em] text-white/70">
                {String(storyIndex + 1).padStart(2, "0")} / {String(openStory.slides.length).padStart(2, "0")}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  closeLightbox()
                }}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/70 p-0 text-white"
                aria-label="Chiudi galleria"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="relative flex-1 px-4">
              {/* SWIPEABLE, pointer-events pattern */}
              <AnimatePresence mode="wait">
                <motion.figure
                  key={`${openStory.id}-${openStory.slides[storyIndex].id}`}
                  initial={{ opacity: 0, scale: 0.98, x: 24 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.98, x: -24 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="relative h-full w-full overflow-hidden rounded-[32px] bg-transparent shadow-none pointer-events-none"
                >
                  <motion.div
                    className="relative h-full w-full pointer-events-auto"
                    onClick={(e) => e.stopPropagation()}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.15}
                    onDragEnd={(_, info) => {
                      const threshold = 60
                      if (info.offset.x > threshold || info.velocity.x > 400) prevStorySlide()
                      if (info.offset.x < -threshold || info.velocity.x < -400) nextStorySlide()
                    }}
                  >
                    <Image
                      src={openStory.slides[storyIndex].src}
                      alt={openStory.slides[storyIndex].alt}
                      fill
                      sizes="100vw"
                      priority
                      className="object-contain"
                    />
                  </motion.div>
                </motion.figure>
              </AnimatePresence>
              {/* Desktop side arrows (closer to image, centered) */}
              <div className="pointer-events-none absolute inset-y-0 left-1/2 z-10 hidden w-full max-w-5xl -translate-x-1/2 items-center justify-between px-4 lg:flex">
                <div className="pointer-events-auto">
                  <Button
                    type="button"
                    variant="secondary"
                    className="h-12 w-12 rounded-full border-white/25 text-white hover:bg-white/10"
                    onClick={(e) => {
                      e.stopPropagation()
                      prevStorySlide()
                    }}
                    aria-label="Slide precedente"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </div>
                <div className="pointer-events-auto">
                  <Button
                    type="button"
                    className="h-12 w-12 rounded-full bg-brand-600 text-white hover:bg-brand-500"
                    onClick={(e) => {
                      e.stopPropagation()
                      nextStorySlide()
                    }}
                    aria-label="Slide successiva"
                  >
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  )
}
