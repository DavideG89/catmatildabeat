import BeatCard from "@/components/beat-card"

// Mock data - in a real app, this would come from an API based on the current beat
const relatedBeats = [
  {
    id: "2",
    title: "Summer Vibes",
    producer: "BeatVault",
    coverImage: "/placeholder.svg?height=400&width=400",
    price: 24.99,
    bpm: 95,
    key: "G Major",
    genre: "R&B",
    tags: ["R&B", "Chill", "Summer"],
  },
  {
    id: "3",
    title: "Urban Legend",
    producer: "BeatVault",
    coverImage: "/placeholder.svg?height=400&width=400",
    price: 34.99,
    bpm: 160,
    key: "F Minor",
    genre: "Hip Hop",
    tags: ["Hip Hop", "Hard", "Urban"],
  },
  {
    id: "4",
    title: "Neon Lights",
    producer: "BeatVault",
    coverImage: "/placeholder.svg?height=400&width=400",
    price: 27.99,
    bpm: 128,
    key: "A Minor",
    genre: "Pop",
    tags: ["Pop", "Upbeat", "Electronic"],
  },
]

interface RelatedBeatsProps {
  currentBeatId: string
}

export default function RelatedBeats({ currentBeatId }: RelatedBeatsProps) {
  // Filter out the current beat
  const filteredBeats = relatedBeats.filter((beat) => beat.id !== currentBeatId)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {filteredBeats.map((beat) => (
        <BeatCard key={beat.id} beat={beat} />
      ))}
    </div>
  )
}
