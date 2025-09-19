"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Play, ChevronRight, Clock, Music, Search, X, Pause, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TrendingBeats from "@/components/trending-beats"
import FeaturedBeats from "@/components/featured-beats"
import BeatCard from "@/components/beat-card"
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
      <section className="relative h-[90vh] min-h-[90vh] flex items-center justify-center overflow-visible">
        <div className="container mx-auto px-4 z-10 relative">
          <div className="grid md:grid-cols-2 items-center gap-6 md:gap-12">
            {/* Left: Heading, CTAs, Search */}
            <div className="order-2 md:order-1 space-y-4 md:space-y-6 max-w-xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold mb-3 md:mb-5 leading-tight font-heading text-left">
                  Feel the Beat and get Inspired.
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl mb-4 md:mb-6 text-foreground">
                  No curse, just beat
                </p>
                <div className="flex flex-col sm:flex-row gap-2 md:gap-3 justify-start">
                  <Button
                    size="lg"
                    className="bg-brand-600 hover:bg-brand-500 text-base md:text-lg px-5 md:px-7 transition-all"
                  >
                    <Link href="/beats">Browse Beats marketplace</Link>
                  </Button>
                  <Button size="lg" variant="outline" className="text-base md:text-lg px-5 md:px-7" asChild>
                    <Link href="https://www.beatstars.com/catmatildabeat">Brows on Beatstar</Link>
                  </Button>
                </div>
              </motion.div>

              {/* Enhanced Search Bar */}
              <motion.div
                ref={searchContainerRef}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
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
                      className="w-full bg-white text-brand-500 placeholder:text-gray-400 border border-black rounded-full py-3 md:py-4 pl-10 md:pl-12 pr-28 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-base"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={clearSearch}
                        className="absolute right-16 md:right-20 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                    <Button
                      type="submit"
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-brand-600 hover:bg-brand-500 h-9 md:h-10 px-4 md:px-6 transition-colors text-sm"
                    >
                      Search
                    </Button>
                  </div>
                </form>

                {/* Quick chips */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {["Trap", "Hip Hop", "R&B", "Drill"].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setSearchQuery(chip)}
                      className="px-3 py-1 rounded-full border border-black/10 text-sm hover:bg-black/5"
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                {/* Search Results Dropdown */}
                {showSearchResults && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-border/60 rounded-xl shadow-2xl ring-1 ring-black/10 dark:ring-white/10 z-50 max-h-96 overflow-y-auto">
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
                          <div className="space-y-1">
                            {searchResults.map((beat) => (
                              <div
                                key={beat.id}
                                onClick={() => handleBeatClick(beat.id)}
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-colors"
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
                                {/* Price removed in search dropdown */}
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

            {/* Right: Visual panel */}
            <div className="order-1 md:order-2 w-full">
              <div className="relative">
                <img
                  src="/img/loop_cat.gif"
                  alt="Studio preview"
                  className="w-full h-full object-cover aspect-video md:aspect-[4/3]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tracklist Section */}
      <section className="py-12 md:py-16">
        <TracklistSection />
      </section>

      {/* Featured Content Tabs - Horizontal Scrolling for All Devices */}
      <section className="py-12 md:py-16 bg-transparent">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="trending" className="w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <h2 className="text-2xl md:text-3xl font-bold font-heading">Discover Music</h2>
              <TabsList className="bg-gradient-to-r from-brand-50/80 via-white/80 to-white/80 text-brand-900 rounded-md h-auto p-1 border border-black/10 shadow-sm">
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
      <section className="py-12 md:py-16 bg-transparent">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h2 className="text-2xl md:text-3xl font-bold font-heading">Popular Genres</h2>
          
          </div>
          <PopularGenres />
        </div>
      </section>

      {/* YouTube Section */}
      <section className="py-12 md:py-16">
        <YouTubeSection />
      </section>

      {/* How It Works */}
      <section
        className="py-12 md:py-16"
        style={{
          "--card": "0 0% 100%",
          "--card-foreground": "0 0% 10%",
          "--muted-foreground": "0 0% 35%",
        } as React.CSSProperties}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center font-heading">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Play className="h-8 w-8 text-brand-600" />,
                title: "Browse & Listen",
                description: "Explore our catalog of cat beats and audition tracks before making your choice.",
              },
              {
                icon: <Music className="h-8 w-8 text-brand-600" />,
                title: "Choose Your License",
                description: "On BeatStars, select the licensing option that aligns with your creative or commercial needs.",
              },
              {
                icon: <Clock className="h-8 w-8 text-brand-600" />,
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
                <div className="bg-brand-600/10 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-card-foreground">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials (hidden) */}
      <section className="hidden">
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
      <section className="py-16 md:py-20 bg-transparent text-foreground">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-heading">Ready to Elevate Your Sound?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-black/70">
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
  const newReleaseBeats = getBeatsByCategory("new_releases").slice(0, 6)

  return (
    <>
      {newReleaseBeats.map((beat) => (
        <div key={beat.id} className="w-[85vw] sm:w-[75vw] md:w-auto flex-shrink-0 snap-start">
          <BeatCard
            beat={{
              id: beat.id,
              title: beat.title,
              producer: beat.producer,
              coverImage: beat.cover_image,
              price: beat.price || 0,
              bpm: beat.bpm,
              key: beat.key,
              genre: beat.genre,
              tags: beat.tags,
              beatstarsLink: beat.beatstars_link,
              audioFile: beat.audio_file,
              duration: beat.duration,
            }}
          />
        </div>
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
