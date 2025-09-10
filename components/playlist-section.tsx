"use client"

import { useState } from "react"
import Image from "next/image"
import { Play, Pause, Music, Clock, Shuffle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAudioPlayer } from "@/components/audio-player-context"
import { motion } from "framer-motion"

// Mock playlist data
const playlists = [
  {
    id: "1",
    title: "Trap Essentials",
    description: "Hard-hitting trap beats for your next project",
    coverImage: "/placeholder.svg?height=300&width=300",
    trackCount: 12,
    duration: "38:45",
    genre: "Trap",
    color: "from-purple-600 to-pink-600",
    tracks: [
      { id: "1", title: "Midnight Dreams", duration: "2:45" },
      { id: "3", title: "Urban Legend", duration: "2:58" },
      { id: "11", title: "Urban Jungle", duration: "3:10" },
    ],
  },
  {
    id: "2",
    title: "Chill Vibes",
    description: "Smooth and relaxing beats for laid-back sessions",
    coverImage: "/placeholder.svg?height=300&width=300",
    trackCount: 8,
    duration: "24:32",
    genre: "Lo-Fi",
    color: "from-blue-600 to-teal-600",
    tracks: [
      { id: "2", title: "Summer Vibes", duration: "3:12" },
      { id: "8", title: "Golden Hour", duration: "2:48" },
      { id: "10", title: "Rainy Days", duration: "2:55" },
    ],
  },
  {
    id: "3",
    title: "Hip Hop Classics",
    description: "Timeless hip hop beats with that classic sound",
    coverImage: "/placeholder.svg?height=300&width=300",
    trackCount: 10,
    duration: "32:18",
    genre: "Hip Hop",
    color: "from-orange-600 to-red-600",
    tracks: [
      { id: "6", title: "Street Dreams", duration: "3:05" },
      { id: "3", title: "Urban Legend", duration: "2:58" },
    ],
  },
]

export default function PlaylistSection() {
  const [playingPlaylist, setPlayingPlaylist] = useState<string | null>(null)
  const { setCurrentTrack } = useAudioPlayer()

  const handlePlayPlaylist = (playlist: any) => {
    if (playingPlaylist === playlist.id) {
      setPlayingPlaylist(null)
      setCurrentTrack(null)
    } else {
      setPlayingPlaylist(playlist.id)
      // Play first track of the playlist
      setCurrentTrack({
        id: playlist.tracks[0].id,
        title: playlist.tracks[0].title,
        artist: "Cat Matilda Beat",
        coverImage: playlist.coverImage,
        audioSrc: "/demo-beat.mp3",
        type: "beat",
      })
    }
  }

  return (
    <section className="py-10 md:py-16 bg-gradient-to-b from-card/30 to-background animate-on-scroll">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-8 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center mb-4">
            <Music className="h-6 w-6 md:h-8 md:w-8 text-brand-500 mr-3" />
            <h2 className="text-2xl md:text-3xl font-bold font-heading">Curated Playlists</h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Handpicked collections of beats organized by mood and genre
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {playlists.map((playlist, index) => (
            <motion.div
              key={playlist.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
            >
              <Card className="group overflow-hidden card-hover-effect cursor-pointer">
                <CardContent className="p-0">
                  <div className="relative">
                    <div className={`absolute inset-0 bg-gradient-to-br ${playlist.color} opacity-80`}></div>
                    <Image
                      src={playlist.coverImage || "/placeholder.svg"}
                      alt={playlist.title}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Play button overlay */}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Button
                        className="bg-white/90 hover:bg-white text-black rounded-full h-16 w-16 flex items-center justify-center shadow-lg transform transition-transform hover:scale-110"
                        onClick={() => handlePlayPlaylist(playlist)}
                      >
                        {playingPlaylist === playlist.id ? (
                          <Pause className="h-6 w-6" />
                        ) : (
                          <Play className="h-6 w-6 ml-1" />
                        )}
                      </Button>
                    </div>

                    {/* Playlist info overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                      <Badge className="bg-white/20 backdrop-blur-sm text-white text-xs border-0 mb-2">
                        {playlist.genre}
                      </Badge>
                      <h3 className="font-bold text-lg text-white mb-1">{playlist.title}</h3>
                      <p className="text-sm text-gray-300 line-clamp-2">{playlist.description}</p>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                      <div className="flex items-center">
                        <Music className="h-4 w-4 mr-1" />
                        <span>{playlist.trackCount} tracks</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{playlist.duration}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {playlist.tracks.slice(0, 3).map((track, trackIndex) => (
                        <div key={track.id} className="flex items-center justify-between text-sm">
                          <span className="text-foreground truncate flex-1">{track.title}</span>
                          <span className="text-muted-foreground ml-2">{track.duration}</span>
                        </div>
                      ))}
                      {playlist.tracks.length > 3 && (
                        <div className="text-xs text-muted-foreground">+{playlist.tracks.length - 3} more tracks</div>
                      )}
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        className="flex-1 bg-brand-600 hover:bg-brand-500"
                        onClick={() => handlePlayPlaylist(playlist)}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Play All
                      </Button>
                      <Button size="sm" variant="outline" className="bg-transparent">
                        <Shuffle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
