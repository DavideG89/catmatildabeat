import type { Metadata } from "next"

const title = "Beats Marketplace | Matilda The Cat"
const description = "Browse and filter exclusive Beat instrumentals across genres, moods, and BPM."

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/beats",
  },
  openGraph: {
    title,
    description: "Get original, royalty-free beats for your musical projects.",
    url: "/beats",
    images: [
      {
        url: "/img/MatildaTheCat-Poster.png",
        width: 1200,
        height: 630,
        alt: "Browse Matilda The Cat marketplace",
      },
    ],
  },
}
