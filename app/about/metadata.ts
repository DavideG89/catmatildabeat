import type { Metadata } from "next"

const title = "About Cat Matilda Beat"
const description = "Learn about Cat Matilda Beat's journey, philosophy, and the creative vision behind the beats."

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
        url: "/img/CatMatildaStudio.jpg",
        width: 1200,
        height: 630,
        alt: "Cat Matilda Beat studio",
      },
    ],
  },
}
