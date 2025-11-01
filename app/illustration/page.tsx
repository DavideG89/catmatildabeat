"use client"

import { useEffect, useMemo, useState } from "react"
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
    cardTitle: "Keeper of Midnight",
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
    cardTitle: "Nagano Prefecture",
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
    cardTitle: "Marrakech Merzouga",
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
    cardTitle: "Yosemite Nation Park",
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

const storyFigureVariants = {
  enter: (direction: 1 | -1) => ({
    opacity: 0,
    x: direction > 0 ? 140 : -140,
    rotate: direction > 0 ? 4 : -4,
    scale: 0.94,
  }),
  center: {
    opacity: 1,
    x: 0,
    rotate: 0,
    scale: 1,
  },
  exit: (direction: 1 | -1) => ({
    opacity: 0,
    x: direction > 0 ? -140 : 140,
    rotate: direction > 0 ? -4 : 4,
    scale: 0.94,
  }),
}

export default function IllustrationPage() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [spookyIndex, setSpookyIndex] = useState(0)
  const [spookyDirection, setSpookyDirection] = useState<1 | -1>(1)
  const [isMobileFullscreen, setIsMobileFullscreen] = useState(false)

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

  const handleCardSelect = (slotIndex: number) => {
    setActiveIndex((prev) => (prev + slotIndex) % slides.length)
  }

  const handleSpookyPrev = () => {
    setSpookyDirection(-1)
    setSpookyIndex((prev) => (prev - 1 + spookySlides.length) % spookySlides.length)
  }

  const handleSpookyNext = () => {
    setSpookyDirection(1)
    setSpookyIndex((prev) => (prev + 1) % spookySlides.length)
  }

  const handleSpookySelect = (index: number) => {
    if (index === spookyIndex) return
    setSpookyDirection(index > spookyIndex ? 1 : -1)
    setSpookyIndex(index)
  }

  const spookySlide = spookySlides[spookyIndex]

  useEffect(() => {
    if (!isMobileFullscreen) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileFullscreen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isMobileFullscreen])

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
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
              <Button className="rounded-full bg-brand-600 px-6 py-5 text-xs uppercase tracking-[0.32em] text-white hover:bg-brand-500">
                Browse Collection
              </Button>
              <Button
                variant="outline"
                className="rounded-full border-brand-500/50 px-6 py-5 text-xs uppercase tracking-[0.32em] text-brand-600 hover:bg-brand-500/10"
                asChild
              >
                <Link href="/contact">Request Artwork</Link>
              </Button>
            </div>
              <div className=" flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button
                        type="button"
                        variant="outline"
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
                  onClick={() => handleCardSelect(slotIndex)}
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
                      sizes="(min-width: 1440px) 580px, (min-width: 1280px) 520px, (min-width: 1024px) 360px, 320px"
                    />
                    <div className="absolute bottom-6 left-6 right-6 space-y-2 text-white drop-shadow-md">
                      <span className="text-[0.7rem] uppercase tracking-[0.42em]">{slide.region}</span>
                      <h3 className="text-lg font-semibold leading-snug">{slide.cardTitle}</h3>
                      <p className="text-sm text-white/80">{slide.cardSubtitle}</p>
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
                onClick={() => setIsMobileFullscreen(true)}
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

      <section className="border-t border-border bg-muted/20">
        <div className="container flex flex-col gap-10 px-6 py-16 md:px-12 lg:px-16">
          <div className="flex flex-col gap-4 text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.42em] text-muted-foreground">
              Stories Carousel
            </span>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Spookie Night</h2>
            <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base">
              Stories of the spooky nights and the adventure of Matilda the cat in a dreamy atmosphere.
            </p>
          </div>

          <div className="flex flex-col items-center gap-6">
            <div className="relative w-full max-w-4xl overflow-hidden ">
              <AnimatePresence initial={false} custom={spookyDirection} mode="wait">
                <motion.figure
                  key={spookySlide.id}
                  custom={spookyDirection}
                  variants={storyFigureVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.55, ease: "easeInOut" }}
                  className="relative w-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/40"
                  tabIndex={0}
                  onClick={(event) => event.currentTarget.focus()}
                  whileTap={{ scale: 0.98 }}
                  whileFocus={{ scale: 1.01 }}
                  style={{ aspectRatio: `${spookySlide.width} / ${spookySlide.height}` }} >
                  <Image
                    src={spookySlide.src}
                    alt={spookySlide.alt}
                    width={spookySlide.width}
                    height={spookySlide.height}
                    className="h-full w-full object-contain"
                    priority
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/40 to-transparent p-6 text-white">
                    <p className="text-sm uppercase tracking-[0.32em]">Slide 0{spookyIndex + 1}</p>
                    <h3 className="text-2xl font-semibold">Spooky Night Reverie</h3>
                  </div>
                </motion.figure>
              </AnimatePresence>

              <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 w-12 rounded-full border border-border bg-background/80 text-foreground backdrop-blur"
                  onClick={handleSpookyPrev}
                  aria-label="Previous spooky slide"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 w-12 rounded-full border border-border bg-background/80 text-foreground backdrop-blur"
                  onClick={handleSpookyNext}
                  aria-label="Next spooky slide"
                >
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="flex max-w-4xl flex-wrap justify-center gap-3">
              {spookySlides.map((thumb, index) => (
                <button
                  key={thumb.id}
                  type="button"
                  onClick={() => handleSpookySelect(index)}
                  className={`relative h-16 w-20 overflow-hidden rounded-2xl border transition ${
                    index === spookyIndex ? "border-brand-600 shadow-lg" : "border-border opacity-70 hover:opacity-100"
                  }`}
                  aria-label={`Seleziona illustrazione spooky night ${index + 1}`}
                >
                  <Image
                    src={thumb.src}
                    alt={thumb.alt}
                    width={thumb.width}
                    height={thumb.height}
                    className="h-full w-full object-contain"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {isMobileFullscreen && (
          <motion.div
            key="mobile-fullscreen-carousel"
            className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center justify-between px-4 pt-4">
              <span className="text-xs uppercase tracking-[0.42em] text-muted-foreground">
                0{activeIndex + 1} / 0{slides.length}
              </span>
              <button
                type="button"
                onClick={() => setIsMobileFullscreen(false)}
                className="rounded-full border border-border bg-background/80 p-2 text-foreground shadow-sm"
                aria-label="Chiudi anteprima illustrazioni"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative flex-1 px-4">
              <AnimatePresence mode="wait">
                <motion.figure
                  key={`mobile-fullslide-${activeSlide.id}`}
                  initial={{ opacity: 0, scale: 0.96, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: -16 }}
                  transition={{ duration: 0.35 }}
                  className="relative h-full w-full overflow-hidden rounded-[32px] border border-border bg-background/70"
                >
                  <div className="relative h-full w-full">
                    <Image
                      src={activeSlide.image.src}
                      alt={activeSlide.cardTitle}
                      fill
                      sizes="100vw"
                      priority
                      className="object-contain"
                    />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 space-y-1 bg-gradient-to-t from-background/80 via-background/20 to-transparent px-6 pb-6 pt-12 text-foreground">
                    <span className="text-[0.6rem] uppercase tracking-[0.42em] text-muted-foreground">
                      {activeSlide.region}
                    </span>
                    <h3 className="text-xl font-semibold leading-tight">{activeSlide.cardTitle}</h3>
                    <p className="text-sm text-muted-foreground">{activeSlide.cardSubtitle}</p>
                  </div>
                </motion.figure>
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-3 px-6 pb-6">
              <Button
                type="button"
                variant="outline"
                className="h-12 w-12 rounded-full border-border text-foreground hover:bg-muted"
                onClick={handlePrev}
                aria-label="Illustrazione precedente"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <input
                type="range"
                min={0}
                max={slides.length - 1}
                value={activeIndex}
                onChange={(event) => setActiveIndex(Number(event.target.value))}
                className="h-1 flex-1 accent-brand-600"
                aria-label="Seleziona illustrazione"
              />
              <Button
                type="button"
                className="h-12 w-12 rounded-full bg-brand-600 text-white hover:bg-brand-500"
                onClick={handleNext}
                aria-label="Illustrazione successiva"
              >
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
