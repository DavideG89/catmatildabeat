import type { Metadata } from "next"

const title = "About Matilda The Cat"
const description = "Learn about Cat Matilda's journey, philosophy, and the creative vision behind the beats."

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title,
    description,
    url: "/about",
    images: [
      {
        url: "/img/MatildaTheCat-Poster.png",
        width: 1200,
        height: 630,
        alt: " Matilda The Cat - About Page",
      },
    ],
  },
}
