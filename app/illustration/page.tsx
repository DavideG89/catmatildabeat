"use client"

import { useEffect, useMemo, useRef, useState } from "react"
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

const slotLayout = [
  { position: "0rem", scale: 1.08, rotate: -1, opacity: 1, blur: "0px", zIndex: 40 },
  { position: "14rem", scale: 0.96, rotate: -3, opacity: 0.82, blur: "0px", zIndex: 30 },
  { position: "26rem", scale: 0.9, rotate: -5, opacity: 0.68, blur: "1px", zIndex: 20 },
  { position: "38rem", scale: 0.86, rotate: -6, opacity: 0.52, blur: "2px", zIndex: 10 },
]

const spookySlides = Array.from({ length: 9 }, (_, index) => ({
  id: `spooky-${index + 1}`,
  src: `/Carousel/Spooky%20Nights/spoky%20night%20${index + 1}.jpg`,
  alt: `Spooky night illustration ${index + 1}`,
  width: 1600,
  height: 1200,
}))

// Removed duplicate definition of StorySlide

type StoryCatalog = {
  id: string
  title: string
  subtitle?: string
  cover: { src: string; width: number; height: number; alt: string }
  slides: StorySlide[]
  published?: boolean
}

const storyCatalogs: StoryCatalog[] = [
  {
    id: "spooky",
    title: "Spookie Night",
    subtitle: "Dreamy nocturnes & feline adventures",
    cover: { src: "/Carousel/Spooky%20Nights/spoky%20night%201.jpg", width: 1600, height: 1200, alt: "Spookie Night cover" },
    slides: spookySlides,
    published: true,
  },
  // Placeholder examples — duplicate spooky cover for now; you can swap assets later
  {
    id: "neon",
    title: "Neon Promenade",
    subtitle: "Chromatic urban tales",
    cover: { src: "/Illustrazioni/Quadro%202.jpg", width: 1280, height: 983, alt: "Neon Promenade cover" },
    slides: [
      { id: "neon-1", src: "/Illustrazioni/Quadro%202.jpg", alt: "Neon 1", width: 1280, height: 983 },
      { id: "neon-2", src: "/Illustrazioni/Quadro%201.jpg", alt: "Neon 2", width: 1280, height: 983 },
      { id: "neon-3", src: "/Illustrazioni/Quadro%203.jpg", alt: "Neon 3", width: 1280, height: 983 },
    ],
    published: false,
  },
  {
    id: "liquid",
    title: "Liquid Horizons",
    subtitle: "Waves, mist & motion",
    cover: { src: "/Illustrazioni/Quadro%204.jpg", width: 1280, height: 983, alt: "Liquid Horizons cover" },
    slides: [
      { id: "liq-1", src: "/Illustrazioni/Quadro%204.jpg", alt: "Liquid 1", width: 1280, height: 983 },
      { id: "liq-2", src: "/Illustrazioni/Quadro%203.jpg", alt: "Liquid 2", width: 1280, height: 983 },
    ],
    published: false,
  },
]

// Reusable story carousel
type StorySlide = { id: string; src: string; alt: string; width: number; height: number }


export default function IllustrationPage() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isMobileFullscreen, setIsMobileFullscreen] = useState(false)
  const scrollLockRef = useRef(0)

  const activeSlide = slides[activeIndex]
  const visibleIndices = useMemo(
    () => slotLayout.map((_, slotIndex) => slides[(activeIndex + slotIndex) % slides.length]),
    [activeIndex],
  )

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % slides.length)
  }


  // Lightbox state for Stories Catalog
  const [openStoryId, setOpenStoryId] = useState<string | null>(null)
  const [storyIndex, setStoryIndex] = useState(0)
  // --- HERO LIGHTBOX SUPPORT ---
  const heroSlides: StorySlide[] = slides.map((s, i) => ({
    id: s.id,
    src: s.image.src,
    alt: s.cardTitle || `Slide ${i + 1}`,
    width: s.image.width,
    height: s.image.height,
  }))
  const openStory = openStoryId === "__hero__"
    ? { id: "__hero__", title: "Illustration", slides: heroSlides }
    : (storyCatalogs.find((s) => s.id === openStoryId) || null)

  // Open hero lightbox at index (global, not slot)
  const openHeroLightbox = (index = 0) => {
    setOpenStoryId("__hero__")
    // See above: openStory will resolve to heroSlides
    setStoryIndex(index)
    // lock scroll (reuse existing)
    const y = window.scrollY
    document.documentElement.style.overflow = "hidden"
    document.body.style.overflow = "hidden"
    document.body.style.position = "fixed"
    document.body.style.top = `-${y}px`
    document.body.style.width = "100%"
  }

  // Lightbox handlers
  const openLightbox = (storyId: string, index = 0) => {
    setOpenStoryId(storyId)
    setStoryIndex(index)
    // lock scroll
    const y = window.scrollY
    document.documentElement.style.overflow = "hidden"
    document.body.style.overflow = "hidden"
    document.body.style.position = "fixed"
    document.body.style.top = `-${y}px`
    document.body.style.width = "100%"
  }
  const closeLightbox = () => {
    setOpenStoryId(null)
    // unlock
    const top = document.body.style.top
    document.body.style.overflow = ""
    document.documentElement.style.overflow = ""
    document.body.style.position = ""
    document.body.style.top = ""
    document.body.style.width = ""
    const y = top ? parseInt(top.replace("-", "")) : 0
    window.scrollTo(0, y)
  }
  const prevStorySlide = () => {
    if (!openStory) return
    setStoryIndex((p) => (p - 1 + openStory.slides.length) % openStory.slides.length)
  }
  const nextStorySlide = () => {
    if (!openStory) return
    setStoryIndex((p) => (p + 1) % openStory.slides.length)
  }

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!openStory) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') prevStorySlide()
      if (e.key === 'ArrowRight') nextStorySlide()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [openStory])

  useEffect(() => {
    if (!isMobileFullscreen) return

    const originalBodyOverflow = document.body.style.overflow
    const originalHtmlOverflow = document.documentElement.style.overflow
    const originalBodyPosition = document.body.style.position
    const originalBodyTop = document.body.style.top
    const originalBodyWidth = document.body.style.width

    scrollLockRef.current = window.scrollY
    document.documentElement.style.overflow = "hidden"
    document.body.style.overflow = "hidden"
    document.body.style.position = "fixed"
    document.body.style.top = `-${scrollLockRef.current}px`
    document.body.style.width = "100%"

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (isMobileFullscreen) {
          setIsMobileFullscreen(false)
        }
      }
      if (event.key === "ArrowLeft") {
        handlePrev()
      }
      if (event.key === "ArrowRight") {
        handleNext()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = originalBodyOverflow
      document.documentElement.style.overflow = originalHtmlOverflow
      document.body.style.position = originalBodyPosition
      document.body.style.top = originalBodyTop
      document.body.style.width = originalBodyWidth
      window.removeEventListener("keydown", handleKeyDown)
      window.scrollTo(0, scrollLockRef.current)
    }
  }, [isMobileFullscreen])

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
              { /* <Button className="rounded-full bg-brand-600 px-6 py-5 text-xs uppercase tracking-[0.32em] text-white hover:bg-brand-500">
                Browse Collection
              </Button> */}
              <Button className="rounded-full bg-brand-600 px-6 py-5 text-xs uppercase tracking-[0.32em] text-white hover:bg-brand-500" asChild>
                <Link href="/contact">Request Artwork</Link>
              </Button>
            </div>
              <div className=" flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button
                        type="button"
                        variant="secondary"
                        className="h-12 w-12 rounded-full border-border text-foreground hover:bg-muted"
                        onClick={handlePrev}
                      >
                        <ArrowLeft className="h-5 w-5" />
                      </Button>
                      <Button
                        type="button"
                        className="h-12 w-12 rounded-full bg-brand-600 text-white hover:bg-brand-500"
                        onClick={handleNext}
                      >
                        <ArrowRight className="h-5 w-5" />
                      </Button>
                    </div>
              </div>
          </div>

          <div className="relative hidden h-[420px] w-full max-w-3xl justify-self-center lg:block lg:justify-self-end">
            {visibleIndices.map((slide, slotIndex) => {
              const layout = slotLayout[slotIndex]
              return (
                <motion.article
                  key={`${slide.id}-${slotIndex}`}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: layout.opacity, y: 0 }}
                  transition={{ duration: 0.4, delay: slotIndex * 0.05 }}
                  className="group absolute left-0 w-[320px] -translate-y-1/2 cursor-pointer sm:w-[360px] md:w-[580px]"
                  style={{
                    transform: `translateY(-50%) translateX(${layout.position}) rotate(${layout.rotate}deg) scale(${layout.scale})`,
                    zIndex: layout.zIndex,
                    filter: `blur(${layout.blur})`,
                  }}
                  onClick={() => openHeroLightbox((activeIndex + slotIndex) % slides.length)}
                >
                  <div
                    className="relative overflow-hidden rounded-[40px] transition-transform group-hover:scale-[1.03]"
                    style={{ aspectRatio: `${slide.image.width} / ${slide.image.height}` }}
                  >
                    <Image
                      src={slide.image.src}
                      alt={slide.cardTitle}
                      width={slide.image.width}
                      height={slide.image.height}
                      className="h-auto w-full object-cover"
                      sizes="(min-width: 1440px) 580px, (min-width: 1280px) 520px, (min-width: 1024px) 360px, 320px"/>
                    <div className="absolute bottom-6 left-6 right-6 space-y-2 text-white drop-shadow-md">
                      <span className="text-[0.7rem] uppercase tracking-[0.42em]">{slide.cardTitle}</span>
                    </div>
                  </div>
                </motion.article>
              )
            })}
          </div>
            
          <div className="relative flex justify-center pb-6 lg:hidden">
            <AnimatePresence mode="wait">
              <motion.article
                key={activeSlide.id}
                initial={{ opacity: 0, x: 48 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -48 }}
                transition={{ duration: 0.4 }}
                className="relative w-full max-w-sm cursor-pointer overflow-hidden rounded-[32px] border border-border bg-background shadow-none"
                style={{ aspectRatio: `${activeSlide.image.width} / ${activeSlide.image.height}` }}
                onClick={() => openHeroLightbox(activeIndex)}
              >
                <Image
                  src={activeSlide.image.src}
                  alt={activeSlide.cardTitle}
                  width={activeSlide.image.width}
                  height={activeSlide.image.height}
                  className="h-full w-full object-cover"
                />
                <div className="absolute bottom-5 left-5 right-5 space-y-1.5 text-white drop-shadow-md">
                  <span className="text-[0.65rem] uppercase tracking-[0.42em]">{activeSlide.region}</span>
                  <h3 className="text-base font-semibold leading-snug">{activeSlide.cardTitle}</h3>
                  <p className="text-sm text-white/80">{activeSlide.cardSubtitle}</p>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>

        </div>

       
      </section>

      {/* Stories Catalog Grid */}
      <section className="border-t border-border bg-muted/20" aria-labelledby="stories-grid-title">
        <div className="container px-6 py-16 md:px-12 lg:px-16">
          <div className="mb-8 text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.42em] text-muted-foreground">Stories</span>
            <h2 id="stories-grid-title" className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Matilda&apos;s Adventure</h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">Choose a story from our Catalog.</p>
          </div>

          {(() => {
            const visibleCatalogs = storyCatalogs.filter((s) => s.published)
            const single = visibleCatalogs.length === 1
            return (
              <div className={`grid gap-6 ${single ? 'grid-cols-1 max-w-xl mx-auto' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
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
              <span className="text-xs tabular-nums tracking-[0.2em] text-white/70">{String(storyIndex + 1).padStart(2,'0')} / {String(openStory.slides.length).padStart(2,'0')}</span>
              <button type="button" onClick={(e) => { e.stopPropagation(); closeLightbox() }} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/70 text-white p-0" aria-label="Chiudi galleria">
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
                    onClick={(e) => { e.stopPropagation(); prevStorySlide() }}
                    aria-label="Slide precedente"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </div>
                <div className="pointer-events-auto">
                  <Button
                    type="button"
                    className="h-12 w-12 rounded-full bg-brand-600 text-white hover:bg-brand-500"
                    onClick={(e) => { e.stopPropagation(); nextStorySlide() }}
                    aria-label="Slide successiva"
                  >
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
            {/* Removed bottom buttons for lightbox */}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
