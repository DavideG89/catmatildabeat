import Link from "next/link"

import IllustrationGallery from "@/components/illustration-gallery"
import { Button } from "@/components/ui/button"

const illustrations = [
 
  {
    title: "Quadro 1",
    description:
      "Tbd.",
    image: {
      src: "/img/Quadro%201.jpg",
      width: 1280,
      height: 983,
    },
  },
  {
    title: "Quadro 2",
    description:
      "Tbd.",
    image: {
      src: "/img/Quadro%202.jpg",
      width: 1280,
      height: 983,
    },
  },
  {
    title: "Quadro 3",
    description:
      "Tbd.",
    image: {
      src: "/img/Quadro%203.jpg",
      width: 1280,
      height: 983,
    },
  },
  {
    title: "Quadro 4",
    description:
      "Tbd.",
    image: {
      src: "/img/Quadro%204.jpg",
      width: 1280,
      height: 983,
    },
  },
]

const processHighlights = [
  {
    title: "Palette su misura",
    description:
      "Ogni illustrazione nasce da moodboard condivisi e palette accordate ai generi musicali delle release.",
  },
  {
    title: "Texture emotive",
    description:
      "Layer digitali, pennelli organici e grana cinematografica creano profondità e personalità.",
  },
  {
    title: "Formati versatili",
    description:
      "Artwork pronti per social, cover Spotify Canvas, flyer stampati e merch dedicato alla community.",
  },
]

export default function IllustrationPage() {
  return (
    <div className="container mx-auto px-4 py-6 md:py-12 mb-24">
      <section className="mb-12 md:mb-16">
        <span className="inline-flex items-center rounded-full border border-brand-500/40 bg-brand-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-brand-600">
          Cat Matilda Art
        </span>
        <h1 className="mt-4 text-3xl md:text-5xl font-bold font-heading">
          Illustrazioni dedicate a Cat Matilda
        </h1>
        <p className="mt-4 max-w-3xl text-base md:text-lg text-muted-foreground">
          Una raccolta di artwork originali pensati per accompagnare release musicali, campagne social e storytelling visivo. Dalle illustrazioni digitali alle tele fisiche digitalizzate, ogni immagine nasce dall'incontro tra sound design, estetica felina e sperimentazione digitale.
        </p>
      </section>

      <section className="mb-12 md:mb-16">
        <IllustrationGallery items={illustrations} />
      </section>

      <section className="mb-12 md:mb-16">
        <div className="rounded-3xl border border-border/80 bg-card/80 p-6 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {processHighlights.map((highlight) => (
              <div key={highlight.title} className="rounded-2xl border border-border/40 bg-background/60 p-6 card-hover-effect">
                <h3 className="text-lg font-semibold mb-3">{highlight.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{highlight.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-brand-500/30 bg-gradient-to-r from-brand-500/10 via-accent2-500/10 to-brand-500/10 p-8 md:p-12 text-center">
        <h2 className="text-2xl md:text-4xl font-bold font-heading">
          Vuoi un'illustrazione personalizzata per il tuo prossimo progetto?
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-base md:text-lg text-muted-foreground">
          Collaboriamo per creare visual su misura: copertine, animazioni per social e concept grafici per eventi o merchandising.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-4 sm:flex-row">
          <Button size="lg" className="bg-brand-600 hover:bg-brand-500" asChild>
            <Link href="/contact">Parliamone</Link>
          </Button>
          <Button size="lg" variant="outline" className="border-brand-600 text-brand-600 hover:bg-brand-500/10" asChild>
            <Link href="https://www.instagram.com/catmatildabeat/" target="_blank" rel="noopener noreferrer">
              Guarda altre opere
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
