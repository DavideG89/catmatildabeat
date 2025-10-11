import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const illustrations = [
  {
    title: "Synthwave Reverie",
    description:
      "Ritratti cinematici con luci al neon che evocano la dimensione futurista dei beat di Cat Matilda.",
    image: "/img/Cat_Genre_u9585422994_keep_realistic_black_cat_and_change_color_backgro_23cc16e6-eb15-4165-9239-f18e7d3eaa25_2.jpg",
  },
  {
    title: "Studio Glow",
    description: "La postazione sonora di Cat Matilda trasformata in poster illustrato a tinte analogiche.",
    image: "/img/CatMatildaStudio.jpg",
  },
  {
    title: "Feline Frequencies",
    description:
      "Sovrapposizioni di texture e glitch delicati per raccontare il ritmo felino dietro ogni produzione.",
    image: "/img/Cat_Genre_u9585422994_keep_realistic_black_cat_and_change_solid_color_b_bae04826-da40-4261-a588-cd65f0c56282_2.jpg",
  },
  {
    title: "Chromatic Nights",
    description:
      "Palette audaci e contrasti cromatici pensati per release notturne e campagne social.",
    image: "/img/Cat_Genre_u9585422994_realistic_black_cat_and_solid_color_background_--_7353baf1-5db6-494a-95d6-868f93e63e40_2.jpg",
  },
  {
    title: "Scratch Memories",
    description:
      "Illustrazioni che uniscono vinili, graffi e storytelling visivo per merch e cover art.",
    image: "/img/Cat_Genre_u9585422994_keep_realistic_black_cat_and_change_solid_green_c_14c08551-d0e2-4f2d-86d9-db3005094aa1_1.jpg",
  },
  {
    title: "Dreamscape Sessions",
    description:
      "Atmosfere soft-focus ispirate ai momenti di studio e alle sessioni di scrittura condivise.",
    image: "/img/Cat_Genre_u9585422994_realistic_black_cat_and_solid_color_background_--_7353baf1-5db6-494a-95d6-868f93e63e40_3.jpg",
  },
  {
    title: "Quadro 1",
    description:
      "Opera pittorica che cattura l'energia di Cat Matilda con trattamenti analogici e texture materiche.",
    image: "/img/Quadro%201.jpg",
  },
  {
    title: "Quadro 2",
    description:
      "Interpretazione illustrata in formato fisico, digitalizzata per cataloghi e showcase online.",
    image: "/img/Quadro%202.jpg",
  },
  {
    title: "Quadro 3",
    description:
      "Palette calde e pennellate dinamiche per narrare il lato emotivo delle produzioni di Cat Matilda.",
    image: "/img/Quadro%203.jpg",
  },
  {
    title: "Quadro 4",
    description:
      "Composizione su tela con focus sul ritmo grafico, ideale per esposizioni e stampe large format.",
    image: "/img/Quadro%204.jpg",
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

export const metadata: Metadata = {
  title: "Illustrazioni | Cat Matilda Beat",
  description:
    "Scopri la galleria di illustrazioni dedicate a Cat Matilda: poster, ritratti e visual storytelling per release e collaborazioni.",
  alternates: {
    canonical: "/illustration",
  },
  openGraph: {
    title: "Illustrazioni | Cat Matilda Beat",
    description:
      "Visual originali, poster esclusivi e concept grafici che traducono l'energia dei beat di Cat Matilda in immagini.",
    url: "/illustration",
    images: [
      {
        url: "/img/Cat_Genre_u9585422994_keep_realistic_black_cat_and_change_color_backgro_23cc16e6-eb15-4165-9239-f18e7d3eaa25_2.jpg",
        width: 1200,
        height: 1600,
        alt: "Illustrazione di Cat Matilda con luci al neon",
      },
    ],
  },
}

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {illustrations.map((item) => (
            <Card key={item.title} className="overflow-hidden border-border/60 bg-card/90 backdrop-blur card-hover-effect">
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-300 hover:scale-105"
                  priority={item.title === "Synthwave Reverie"}
                />
              </div>
              <CardContent className="pt-6">
                <h3 className="text-lg md:text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-sm md:text-base text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
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
