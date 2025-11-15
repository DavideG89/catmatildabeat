import type { Metadata } from "next"

const title = "Checkout"
const description = "Secure checkout for Matilda The Cat purchases."

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/checkout",
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title,
    description,
    url: "/checkout",
  },
}
