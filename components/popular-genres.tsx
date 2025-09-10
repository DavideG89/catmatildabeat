import Link from "next/link"
import Image from "next/image"
import MobileScrollContainer from "@/components/mobile-scroll-container"

const genres = [
  {
    name: "Trap",
    image: "/placeholder.svg?height=400&width=400",
    count: 124,
  },
  {
    name: "Hip Hop",
    image: "/placeholder.svg?height=400&width=400",
    count: 98,
  },
  {
    name: "R&B",
    image: "/placeholder.svg?height=400&width=400",
    count: 76,
  },
  {
    name: "Pop",
    image: "/placeholder.svg?height=400&width=400",
    count: 65,
  },
  {
    name: "Lo-Fi",
    image: "/placeholder.svg?height=400&width=400",
    count: 52,
  },
  {
    name: "Drill",
    image: "/placeholder.svg?height=400&width=400",
    count: 43,
  },
  {
    name: "Boom Bap",
    image: "/placeholder.svg?height=400&width=400",
    count: 38,
  },
  {
    name: "Ambient",
    image: "/placeholder.svg?height=400&width=400",
    count: 29,
  },
]

export default function PopularGenres() {
  return (
    <MobileScrollContainer>
      {genres.map((genre) => (
        <Link
          href={`/beats?genre=${genre.name.toLowerCase()}`}
          key={genre.name}
          className="group flex-shrink-0 w-32 md:w-auto"
        >
          <div className="relative rounded-xl overflow-hidden aspect-square">
            <Image
              src={genre.image || "/placeholder.svg"}
              alt={genre.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 12.5vw"
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-2 md:p-3">
              <div>
                <h3 className="font-bold text-sm md:text-base text-white">{genre.name}</h3>
                <p className="text-xs text-gray-300">{genre.count} beats</p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </MobileScrollContainer>
  )
}
