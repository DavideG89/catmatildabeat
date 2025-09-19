import type { Metadata } from "next"

const title = "Producer Login"
const description = "Access the Cat Matilda Beat dashboard to manage beats and sample packs."

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/login",
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title,
    description,
    url: "/login",
  },
}
