import type { Metadata } from "next"

const title = "Contact Cat Matilda Beat"
const description = "Get in touch with Cat Matilda Beat for custom productions, collaborations, or support inquiries."

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title,
    description,
    url: "/contact",
    images: [
      {
        url: "/img/CatMatildaStudio.jpg",
        width: 1200,
        height: 630,
        alt: "Contact Cat Matilda Beat",
      },
    ],
  },
}
