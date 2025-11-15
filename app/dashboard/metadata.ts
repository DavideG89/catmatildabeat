import type { Metadata } from "next"

const title = "Beats Dashboard"
const description = "Manage Matilda The Cat listings, releases, and analytics from the producer dashboard."

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/dashboard",
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title,
    description,
    url: "/dashboard",
  },
}
