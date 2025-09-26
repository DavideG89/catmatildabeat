import type { Metadata } from "next"
import BeatDetailPage from "@/components/beat-detail-page"

interface BeatDetailPageProps {
  params: { id: string }
}

export function generateMetadata({ params }: BeatDetailPageProps): Metadata {
  const path = `/beats/${params.id}`

  return {
    alternates: {
      canonical: path,
    },
    openGraph: {
      url: path,
    },
  }
}

export default function BeatDetailPageRoute({ params }: BeatDetailPageProps) {
  return <BeatDetailPage params={params} />
}
