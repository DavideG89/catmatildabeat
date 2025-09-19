import type { Metadata } from "next"

const title = "Sample Packs"
const description = "Download Cat Matilda Beat sample packs packed with drums, melodies, and textures for producers."

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/samples",
  },
  openGraph: {
    title,
    description,
    url: "/samples",
    images: [
      {
        url: "/img/CatMatildaStudio.jpg",
        width: 1200,
        height: 630,
        alt: "Cat Matilda Beat sample packs",
      },
    ],
  },
}
