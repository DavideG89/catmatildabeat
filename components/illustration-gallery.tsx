"use client"

import { useState } from "react"
import Image from "next/image"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

type IllustrationItem = {
  title: string
  description: string
  image: {
    src: string
    width: number
    height: number
  }
}

interface IllustrationGalleryProps {
  items: IllustrationItem[]
}

export default function IllustrationGallery({ items }: IllustrationGalleryProps) {
  const [focusEnabled, setFocusEnabled] = useState(false)
  const [activeItem, setActiveItem] = useState<IllustrationItem | null>(null)

  const handleFocusToggle = () => {
    setFocusEnabled((prev) => !prev)
    setActiveItem(null)
  }

  const handleImageClick = (item: IllustrationItem) => {
    if (!focusEnabled) return
    setActiveItem(item)
  }

  return (
    <>
      <div className="mb-8 flex items-center gap-3 text-sm text-muted-foreground">
        <button
          type="button"
          onClick={handleFocusToggle}
          className="group flex items-center gap-3 rounded-full border border-border/60 bg-background/70 px-4 py-2 shadow-sm transition-colors hover:border-brand-500/60 hover:text-foreground"
        >
          <span
            className={cn(
              "flex h-5 w-5 items-center justify-center rounded-full border border-border/60 transition-colors",
              focusEnabled ? "border-brand-500 bg-brand-500/90" : "bg-background",
            )}
          >
            <span
              className={cn(
                "h-2 w-2 rounded-full transition-opacity",
                focusEnabled ? "bg-white opacity-100" : "opacity-0",
              )}
            />
          </span>
          <span className="font-semibold uppercase tracking-[0.28em]">Focus View</span>
        </button>
        <span className="text-xs uppercase tracking-[0.32em] text-muted-foreground/70">
          {focusEnabled ? "Attivo" : "Standard"}
        </span>
      </div>

      {focusEnabled ? (
        <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-black/95 p-10 shadow-2xl">
          <div className="flex items-center justify-between text-white/70">
            <span className="text-xs uppercase tracking-[0.42em]">Focus View</span>
            <span className="text-xs uppercase tracking-[0.32em]">Modalità immagine piena</span>
          </div>
          <div className="mt-8 flex flex-col items-center gap-10">
            {items.map((item, index) => (
              <figure key={item.title} className="flex max-w-4xl flex-col items-center gap-6">
                <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-black">
                  <Image
                    src={item.image.src}
                    alt={item.title}
                    width={item.image.width}
                    height={item.image.height}
                    className="h-auto w-full object-contain"
                    sizes="(min-width: 1536px) 70vw, (min-width: 1280px) 72vw, (min-width: 1024px) 80vw, 94vw"
                    priority={index === 0}
                  />
                </div>
                <figcaption className="flex flex-col items-center gap-2 text-center text-white">
                  <span className="text-xs uppercase tracking-[0.32em] text-white/60">Serie Cat Matilda</span>
                  <h3 className="text-2xl font-semibold">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-white/80">{item.description}</p>
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={handleFocusToggle}
              className="rounded-full border border-white/40 px-6 py-2 text-xs uppercase tracking-[0.32em] text-white transition-colors hover:bg-white/10"
            >
              Chiudi Focus View
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          {items.map((item, index) => (
            <figure key={item.title} className="group flex flex-col gap-4">
              <div className="relative w-full">
                <Image
                  src={item.image.src}
                  alt={item.title}
                  width={item.image.width}
                  height={item.image.height}
                  onClick={() => handleImageClick(item)}
                  className={cn(
                    "h-auto w-full cursor-default object-cover transition-opacity",
                    focusEnabled && "cursor-zoom-in hover:opacity-90",
                  )}
                  sizes="(min-width: 1536px) 42vw, (min-width: 1280px) 46vw, (min-width: 1024px) 48vw, (min-width: 768px) 94vw, 96vw"
                  priority={index === 0}
                />
              </div>
              <figcaption className="flex flex-col gap-2 text-center md:text-left">
                <span className="text-xs uppercase tracking-[0.32em] text-muted-foreground/70">Serie Cat Matilda</span>
                <h3 className="text-xl font-semibold md:text-2xl">{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground md:text-base">{item.description}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      )}

      <Dialog open={!!activeItem} onOpenChange={(open) => !open && setActiveItem(null)}>
        <DialogContent className="max-w-5xl border-none bg-transparent p-0 shadow-none text-white">
          {activeItem && (
            <div className="flex flex-col gap-4">
              <div className="overflow-hidden rounded-2xl bg-black">
                <Image
                  src={activeItem.image.src}
                  alt={activeItem.title}
                  width={activeItem.image.width}
                  height={activeItem.image.height}
                  className="h-auto w-full object-contain"
                  sizes="100vw"
                />
              </div>
              <div className="text-center text-white">
                <span className="text-xs uppercase tracking-[0.32em] text-white/70">Focus View</span>
                <h3 className="mt-2 text-2xl font-semibold">{activeItem.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/80">{activeItem.description}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
