"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Play, ChevronRight, Clock, Music, Search, X, Pause, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TrendingBeats from "@/components/trending-beats"
import FeaturedBeats from "@/components/featured-beats"
import PopularGenres from "@/components/popular-genres"
import YouTubeSection from "@/components/youtube-section"
import TracklistSection from "@/components/tracklist-section"
import MobileScrollContainer from "@/components/mobile-scroll-container"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useBeats } from "@/components/beats-context"
import { useAudioPlayer } from "@/components/audio-player-context"

export default function Home() {
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchContainerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { beats, searchBeats, getBeatsByCategory } = useBeats()
  const { currentTrack, isPlaying, playTrack, togglePlayPause } = useAudioPlayer()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  // Enhanced search function
  const enhancedSearch = (query: string, allBeats: any[]) => {
    if (!query.trim() || !Array.isArray(allBeats)) return []

    const searchTerm = query.toLowerCase().trim()

    return allBeats.filter((beat) => {
      if (beat.title?.toLowerCase().includes(searchTerm)) return true
      if (beat.producer?.toLowerCase().includes(searchTerm)) return true
      if (beat.genre?.toLowerCase().includes(searchTerm)) return true
      if (beat.tags && beat.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm))) return true
      if (beat.key?.toLowerCase().includes(searchTerm)) return true
      if (beat.description?.toLowerCase().includes(searchTerm)) return true

      const bpmMatch = searchTerm.match(/(\d+)/)
      if (bpmMatch) {
        const searchBpm = Number.parseInt(bpmMatch[1])
        if (Math.abs(beat.bpm - searchBpm) <= 5) return true
      }

      return false
    })
  }

  // Dynamic search as user types
  useEffect(() => {
    const performSearch = async () => {
      if (searchQuery.trim()) {
        setIsSearching(true)
        try {
          const localResults = enhancedSearch(searchQuery, beats)
          if (localResults.length > 0) {
            setSearchResults(localResults.slice(0, 6))
          } else {
            const dbResults = await searchBeats(searchQuery)
            setSearchResults(dbResults.slice(0, 6))
          }
          setShowSearchResults(true)
        } catch (error) {
          console.error("Search error:", error)
          setSearchResults([])
        } finally {
          setIsSearching(false)
        }
      } else {
        setSearchResults([])
        setShowSearchResults(false)
      }
    }

    const debounceTimer = setTimeout(performSearch, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchQuery, beats, searchBeats])

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSearchResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/beats?search=${encodeURIComponent(searchQuery)}`)
      setShowSearchResults(false)
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const clearSearch = () => {
    setSearchQuery("")
    setShowSearchResults(false)
    searchInputRef.current?.focus()
  }

  const handleBeatClick = (beatId: string) => {
    router.push(`/beats/${beatId}`)
    setShowSearchResults(false)
  }

  const handleViewAllResults = () => {
    router.push(`/beats?search=${encodeURIComponent(searchQuery)}`)
    setShowSearchResults(false)
  }

  const handleBrowseBeats = () => {
    window.open("https://beatstars.com/catmatildabeat", "_blank")
  }

  const handlePlayTrack = (beat: any) => {
    if (currentTrack?.id === beat.id) {
      togglePlayPause()
    } else {
      playTrack({
        id: beat.id,
        title: beat.title,
        artist: beat.producer,
        audioSrc: beat.audio_file || "/demo-beat.mp3",
        coverImage: beat.cover_image,
        beatstarsLink: beat.beatstars_link,
        durationString: beat.duration,
      })
    }
  }

  return (
    <div className="flex flex-col min-h-screen mb-24 overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] md:min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full from-background via-background/90 to-card/80" />
          <video
            autoPlay
            muted
            loop
            playsInline
            className="object-cover w-full h-full opacity-40 absolute inset-0"
            poster="/img/CatMatildaStudio.png"
          >
            <source src="/placeholder.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 from-background/70 via-background/50 to-background" />
        </div>

        <div className="container mx-auto px-4 z-10 relative">
          <motion.div
            className="max-w-4xl mx-auto text-center mb-8 md:mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 md:mb-6 leading-tight font-heading">
            Feel the Beat and get Inspired.
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-6 md:mb-8 text-muted-foreground max-w-2xl mx-auto">
              No curse, just beat
              </p>
            <motion.div
              className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Button
                size="lg"
                className="bg-brand-600 hover:bg-brand-500 text-base md:text-lg px-6 md:px-8 transition-all"
                onClick={handleBrowseBeats}
              >
                Browse Beats on BeatStars
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-brand-600 text-brand-500 hover:bg-brand-500/10 text-base md:text-lg px-6 md:px-8 bg-transparent"
                asChild
              >
                <Link href="/beats">Preview Beats</Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Enhanced Search Bar */}
          <motion.div
            ref={searchContainerRef}
            className="max-w-2xl mx-auto relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <div className="absolute left-3 top-0 h-full flex items-center">
                  <Search className="text-brand-900/80 h-4 w-4 md:h-5 md:w-5" />
                </div>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search beats, genres, moods, BPM..."
                  className="w-full bg-white text-brand-500 placeholder:text-gray-400 border border-brand-300 rounded-full py-3 md:py-4 pl-10 md:pl-12 pr-20 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-sm md:text-base"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-12 md:right-16 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <Button
                  type="submit"
                  className="absolute right-1.5 top-1.5 rounded-full bg-brand-600 hover:bg-brand-500 px-4 md:px-6 transition-colors text-sm py-1.5"
                >
                  Search
                </Button>
              </div>
            </form>

            {/* Search Results Dropdown */}
            {showSearchResults && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card/95 backdrop-blur-sm border border-border rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto">
                {isSearching ? (
                  <div className="p-6 text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-500 mx-auto mb-2" />
                    <p className="text-muted-foreground text-sm">Searching...</p>
                  </div>
                ) : searchResults.length > 0 ? (
                  <>
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-muted-foreground mb-3">
                        Search Results for "{searchQuery}"
                      </h3>
                      <div className="space-y-2">
                        {searchResults.map((beat) => (
                          <div
                            key={beat.id}
                            onClick={() => handleBeatClick(beat.id)}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                          >
                            <img
                              src={beat.cover_image || beat.coverImage || "/placeholder.svg?height=48&width=48"}
                              alt={beat.title}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm truncate">{beat.title}</h4>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>{beat.genre}</span>
                                <span>•</span>
                                <span>{beat.bpm} BPM</span>
                                <span>•</span>
                                <span>{beat.key}</span>
                              </div>
                              {beat.tags && (
                                <div className="flex items-center gap-1 mt-1">
                                  {beat.tags.slice(0, 2).map((tag: string, index: number) => (
                                    <span
                                      key={index}
                                      className="px-2 py-0.5 bg-brand-500/20 text-brand-500 text-xs rounded-full"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium">${beat.price || "29"}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="border-t border-border p-3">
                      <button
                        onClick={handleViewAllResults}
                        className="w-full text-center text-sm text-brand-500 hover:text-brand-400 font-medium transition-colors py-2"
                      >
                        View all results for "{searchQuery}"
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="p-6 text-center">
                    <p className="text-muted-foreground text-sm mb-3">No beats found for "{searchQuery}"</p>
                    <div className="text-xs text-muted-foreground">
                      <p className="mb-2">Try searching by:</p>
                      <div className="flex flex-wrap justify-center gap-2">
                        <span className="px-2 py-1 bg-muted rounded text-xs">Genre (trap, hip hop)</span>
                        <span className="px-2 py-1 bg-muted rounded text-xs">Mood (dark, chill)</span>
                        <span className="px-2 py-1 bg-muted rounded text-xs">BPM (140, 95)</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Tracklist Section */}
      <section className="py-12 md:py-16">
        <TracklistSection />
      </section>

      {/* Featured Content Tabs - Horizontal Scrolling for All Devices */}
      <section className="py-12 md:py-16 from-background to-card/50">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="trending" className="w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <h2 className="text-2xl md:text-3xl font-bold font-heading">Discover Music</h2>
              <TabsList className="bg-brand-100 text-brand-900 rounded-md h-auto p-1">
                <TabsTrigger
                  value="trending"
                  className="text-brand-900 data-[state=active]:bg-brand-600 data-[state=active]:text-white text-xs md:text-sm py-2 px-4"
                >
                  Trending
                </TabsTrigger>
                <TabsTrigger
                  value="featured"
                  className="text-brand-900 data-[state=active]:bg-brand-600 data-[state=active]:text-white text-xs md:text-sm py-2 px-4"
                >
                  Featured
                </TabsTrigger>
                <TabsTrigger
                  value="new"
                  className="text-brand-900 data-[state=active]:bg-brand-600 data-[state=active]:text-white text-xs md:text-sm py-2 px-4"
                >
                  New Releases
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="trending" className="mt-0">
              <MobileScrollContainer>
                <TrendingBeats />
              </MobileScrollContainer>
            </TabsContent>

            <TabsContent value="featured" className="mt-0">
              <MobileScrollContainer>
                <FeaturedBeats />
              </MobileScrollContainer>
            </TabsContent>

            <TabsContent value="new" className="mt-0">
              <MobileScrollContainer>
                <NewReleaseBeats />
              </MobileScrollContainer>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Popular Genres */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h2 className="text-2xl md:text-3xl font-bold font-heading">Popular Genres</h2>
            <Button
              variant="ghost"
              className="text-brand-500 hover:text-brand-400 text-sm px-0 h-auto"
              onClick={handleBrowseBeats}
            >
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <PopularGenres />
        </div>
      </section>

      {/* YouTube Section */}
      <section className="py-12 md:py-16">
        <YouTubeSection />
      </section>

      {/* How It Works */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center font-heading">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Play className="h-8 w-8 text-brand-500" />,
                title: "Browse & Listen",
                description: "Explore our catalog of premium beats. Preview tracks before you buy.",
              },
              {
                icon: <Music className="h-8 w-8 text-brand-500" />,
                title: "Choose Your License",
                description: "Select the license that fits your needs, from basic to exclusive rights.",
              },
              {
                icon: <Clock className="h-8 w-8 text-brand-500" />,
                title: "Download & Create",
                description: "Purchase on BeatStars and start creating your next hit.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-card rounded-xl p-6 text-center card-hover-effect"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
              >
                <div className="bg-brand-500/20 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 md:py-16 from-background to-card/50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center font-heading">What Artists Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-card rounded-xl p-6 card-hover-effect"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-brand-500/20 rounded-full mr-4 flex items-center justify-center">
                    <span className="text-brand-500 font-bold">{testimonial.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h3 className="font-bold">{testimonial.name}</h3>
                    <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                  </div>
                </div>
                <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 from-brand-600 to-accent2-600">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-heading">Ready to Elevate Your Sound?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of artists who trust Cat Matilda Beat for premium beats.
            </p>
            <Button
              size="lg"
              className="bg-white text-brand-900 hover:bg-gray-100 text-lg px-8"
              onClick={handleBrowseBeats}
            >
              Start Browsing on BeatStars
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

// New Releases Component for consistency
function NewReleaseBeats() {
  const { getBeatsByCategory } = useBeats()
  const { currentTrack, isPlaying, playTrack, togglePlayPause } = useAudioPlayer()

  const handlePlayTrack = (beat: any) => {
    if (currentTrack?.id === beat.id) {
      togglePlayPause()
    } else {
      playTrack({
        id: beat.id,
        title: beat.title,
        artist: beat.producer,
        audioSrc: beat.audio_file || "/demo-beat.mp3",
        coverImage: beat.cover_image,
        beatstarsLink: beat.beatstars_link,
        durationString: beat.duration,
      })
    }
  }

  const newReleaseBeats = getBeatsByCategory("new_releases").slice(0, 6)

  return (
    <>
      {newReleaseBeats.map((beat, index) => (
        <motion.div
          key={beat.id}
          className="group bg-card rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 min-w-[240px] sm:min-w-[280px] md:min-w-[320px] flex-shrink-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
        >
          <div className="relative aspect-square overflow-hidden">
            <img
              src={beat.cover_image || "/placeholder.svg?height=300&width=300"}
              alt={beat.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <button
              onClick={() => handlePlayTrack(beat)}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-brand-600 hover:bg-brand-500 rounded-full p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
            >
              {currentTrack?.id === beat.id && isPlaying ? (
                <Pause className="h-6 w-6 text-white" />
              ) : (
                <Play className="h-6 w-6 text-white" />
              )}
            </button>
          </div>

          <div className="p-4">
            <h3 className="font-bold text-lg mb-1 truncate">{beat.title}</h3>
            <p className="text-muted-foreground text-sm mb-3 truncate">{beat.producer}</p>

            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
              <span>{beat.genre}</span>
              <span>•</span>
              <span>{beat.bpm} BPM</span>
              <span>•</span>
              <span>{beat.key}</span>
            </div>

            {beat.tags && (
              <div className="flex flex-wrap gap-1 mb-4">
                {beat.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
                  <span key={tagIndex} className="px-2 py-1 bg-brand-500/20 text-brand-500 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handlePlayTrack(beat)}
                className="text-brand-500 hover:text-brand-400 hover:bg-brand-500/10 px-3"
              >
                {currentTrack?.id === beat.id && isPlaying ? (
                  <Pause className="h-4 w-4 mr-1" />
                ) : (
                  <Play className="h-4 w-4 mr-1" />
                )}
                {currentTrack?.id === beat.id && isPlaying ? "Pause" : "Play"}
              </Button>

              <Button
                size="sm"
                className="bg-brand-600 hover:bg-brand-500"
                onClick={() => window.open(beat.beatstars_link, "_blank")}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Buy
              </Button>
            </div>
          </div>
        </motion.div>
      ))}
    </>
  )
}

const testimonials = [
  {
    name: "Alex Johnson",
    title: "Independent Artist",
    quote:
      "The beats I've purchased from Cat Matilda Beat have taken my music to the next level. Professional quality and unique sounds.",
  },
  {
    name: "Sarah Williams",
    title: "Music Producer",
    quote: "These beats are incredible. I use them in almost every production now. Worth every penny.",
  },
  {
    name: "Mike Rodriguez",
    title: "Songwriter",
    quote: "Cat Matilda Beat has become my go-to source for beats. The quality and variety are unmatched.",
  },
]
