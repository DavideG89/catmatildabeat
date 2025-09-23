import type { Metadata } from "next"

const title = "Beats Marketplace"
const description = "Browse and filter exclusive Beat instrumentals across genres, moods, and BPM."

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/beats",
  },
  openGraph: {
    title,
    description,
    url: "/beats",
    images: [
      {
        url: "/img/CatMatildaStudio.jpg",
        width: 1200,
        height: 630,
        alt: "Browse Cat Matilda Beat marketplace",
      },
    ],
  },
}
