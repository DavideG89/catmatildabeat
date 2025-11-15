import SamplePackCard from "@/components/sample-pack-card"

// Mock data - in a real app, this would come from an API or database
const samplePacks = [
  {
    id: "1",
    title: "Analog Drum Kit",
    producer: "Matilda The Cat",
    coverImage: "/placeholder.svg?height=400&width=400",
    price: 49.99,
    description:
      "A collection of warm, vintage drum samples recorded through analog hardware. Perfect for hip-hop, lo-fi, and boom bap productions.",
    genre: "HipHop",
    tags: ["Drums", "Analog", "Lo-Fi"],
    sampleCount: 120,
  },
  {
    id: "2",
    title: "Future Bass Essentials",
    producer: "Matilda The Cat",
    coverImage: "/placeholder.svg?height=400&width=400",
    price: 39.99,
    description:
      "Modern synth sounds, vocal chops, and punchy drums designed for future bass and electronic pop productions.",
    genre: "Electronic",
    tags: ["Synths", "Vocals", "Future Bass"],
    sampleCount: 85,
  },
  {
    id: "3",
    title: "Ambient Textures",
    producer: "Matilda The Cat",
    coverImage: "/placeholder.svg?height=400&width=400",
    price: 34.99,
    description: "Ethereal pads, atmospheric textures, and evolving soundscapes for ambient and cinematic productions.",
    genre: "Ambient",
    tags: ["Textures", "Pads", "Cinematic"],
    sampleCount: 60,
  },
  {
    id: "4",
    title: "Rap Melody Loops",
    producer: "Matilda The Cat",
    coverImage: "/placeholder.svg?height=400&width=400",
    price: 29.99,
    description:
      "Dark, melodic loops and one-shots perfect for modern rap productions. Includes MIDI files for all melodic content.",
    genre: "Rap",
    tags: ["Melodies", "Loops", "MIDI"],
    sampleCount: 75,
  },
]

export default function SamplePacksList() {
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <p className="text-muted-foreground text-sm">Showing {samplePacks.length} sample packs</p>
        <select className="bg-secondary text-foreground px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm">
          <option>Sort by: Newest</option>
          <option>Sort by: Price (Low to High)</option>
          <option>Sort by: Price (High to Low)</option>
          <option>Sort by: Most Popular</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {samplePacks.map((pack) => (
          <div key={pack.id} className="group">
            <SamplePackCard pack={pack} />
          </div>
        ))}
      </div>
    </div>
  )
}
