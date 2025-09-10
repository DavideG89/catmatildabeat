"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { Play, ChevronRight, Clock, Music, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TrendingBeats from "@/components/trending-beats"
import FeaturedBeats from "@/components/featured-beats"
import PopularGenres from "@/components/popular-genres"
import YouTubeSection from "@/components/youtube-section"
import TracklistSection from "@/components/tracklist-section"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

export default function Home() {
  const searchInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in")
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 },
    )

    const sections = document.querySelectorAll(".animate-on-scroll")
    sections.forEach((section) => {
      observer.observe(section)
    })

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section)
      })
    }
  }, [])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInputRef.current) {
      const query = searchInputRef.current.value.trim()
      if (query) {
        router.push(`/beats?search=${encodeURIComponent(query)}`)
      }
    }
  }

  const handleBrowseBeats = () => {
    window.open("https://beatstars.com/catmatildabeat", "_blank")
  }

  return (
    <div className="flex flex-col min-h-screen mb-24 overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] md:min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-gradient-to-br from-background via-background/90 to-card/80">
            {/* Fallback background in case video doesn't load */}
          </div>
          <video
            autoPlay
            muted
            loop
            playsInline
            className="object-cover w-full h-full opacity-40 absolute inset-0"
            poster="/placeholder.svg?height=1080&width=1920"
          >
            <source src="/placeholder.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background"></div>
        </div>

        <div className="container mx-auto px-4 z-10 relative">
          <motion.div
            className="max-w-4xl mx-auto text-center mb-8 md:mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 md:mb-6 leading-tight font-heading">
              Discover Premium Beats by <span className="gradient-text">Cat Matilda Beat</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-6 md:mb-8 text-muted-foreground max-w-2xl mx-auto">
              Elevate your sound with professionally crafted beats for your next project
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

          {/* Search Bar */}
          <motion.div
            className="max-w-2xl mx-auto relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 md:h-5 md:w-5" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search beats, genres, moods..."
                  className="w-full bg-card/80 backdrop-blur-sm border border-border rounded-full py-3 md:py-4 pl-10 md:pl-12 pr-6 text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-sm md:text-base"
                />
                <Button
                  type="submit"
                  className="absolute right-1.5 top-1.5 rounded-full bg-brand-600 hover:bg-brand-500 px-4 md:px-6 transition-colors text-sm py-1.5"
                >
                  Search
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Tracklist Section */}
      <TracklistSection />

      {/* Featured Content Tabs */}
      <section className="py-10 md:py-16 bg-gradient-to-b from-background to-card/50 animate-on-scroll">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="trending" className="w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
              <h2 className="text-2xl md:text-3xl font-bold font-heading">Discover Music</h2>
              <TabsList className="bg-card h-auto p-1">
                <TabsTrigger
                  value="trending"
                  className="data-[state=active]:bg-brand-500 data-[state=active]:text-white text-xs md:text-sm py-1.5 px-3"
                >
                  Trending
                </TabsTrigger>
                <TabsTrigger
                  value="featured"
                  className="data-[state=active]:bg-brand-500 data-[state=active]:text-white text-xs md:text-sm py-1.5 px-3"
                >
                  Featured
                </TabsTrigger>
                <TabsTrigger
                  value="new"
                  className="data-[state=active]:bg-brand-500 data-[state=active]:text-white text-xs md:text-sm py-1.5 px-3"
                >
                  New Releases
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="trending" className="mt-0">
              <TrendingBeats />
            </TabsContent>

            <TabsContent value="featured" className="mt-0">
              <FeaturedBeats />
            </TabsContent>

            <TabsContent value="new" className="mt-0">
              <TrendingBeats />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Popular Genres */}
      <section className="py-10 md:py-16 bg-background animate-on-scroll">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
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
      <YouTubeSection />

      {/* How It Works */}
      <section className="py-10 md:py-16 bg-background animate-on-scroll">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 md:mb-12 text-center font-heading">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: <Play className="h-6 w-6 md:h-8 md:w-8 text-brand-500" />,
                title: "Browse & Listen",
                description: "Explore our catalog of premium beats. Preview tracks before you buy.",
              },
              {
                icon: <Music className="h-6 w-6 md:h-8 md:w-8 text-brand-500" />,
                title: "Choose Your License",
                description: "Select the license that fits your needs, from basic to exclusive rights.",
              },
              {
                icon: <Clock className="h-6 w-6 md:h-8 md:w-8 text-brand-500" />,
                title: "Download & Create",
                description: "Purchase on BeatStars and start creating your next hit.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-card rounded-xl p-4 md:p-6 text-center card-hover-effect"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
              >
                <div className="bg-brand-500/20 rounded-full h-12 w-12 md:h-16 md:w-16 flex items-center justify-center mx-auto mb-4">
                  {item.icon}
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-sm md:text-base text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-10 md:py-16 bg-gradient-to-b from-background to-card/50 animate-on-scroll">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 md:mb-12 text-center font-heading">What Artists Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-card rounded-xl p-4 md:p-6 card-hover-effect"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-brand-500/20 rounded-full mr-4 flex items-center justify-center">
                    <span className="text-brand-500 font-bold text-sm md:text-base">{testimonial.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm md:text-base">{testimonial.name}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">{testimonial.title}</p>
                  </div>
                </div>
                <p className="text-sm md:text-base text-muted-foreground italic">{testimonial.quote}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 bg-gradient-to-r from-brand-600 to-accent2-600 animate-on-scroll">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6 font-heading">Ready to Elevate Your Sound?</h2>
            <p className="text-base md:text-xl mb-6 md:mb-8 max-w-2xl mx-auto">
              Join thousands of artists who trust Cat Matilda Beat for premium beats.
            </p>
            <Button
              size="lg"
              className="bg-white text-brand-900 hover:bg-gray-100 text-base md:text-lg px-6 md:px-8"
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

// Mock data for testimonials
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
