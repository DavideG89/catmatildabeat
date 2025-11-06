import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Illustrazioni | Matilda The Cat",
  description:
    "Discover Matilda’s illustrations – custom artwork for your beats and visuals.",
  alternates: {
    canonical: "/illustration",
  },
  openGraph: {
    title: "Illustrazioni | Matilda The Cat",
    description:
      "Discover Matilda’s illustrations – custom artwork for your beats and visuals",
    url: "/illustration",
    images: [
      {
        url: "/illustrazioni/Quadro1.jpg",
        width: 1200,
        height: 1600,
        alt: "Matilda The Cat resting on beds of colorful illustrations",
      },
    ],
  },
}
