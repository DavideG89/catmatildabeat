"use client"

import { useState, useEffect } from "react"
import BeatCard from "@/components/beat-card"
import { useBeats } from "@/components/beats-context"

interface BeatsListProps {
  searchQuery?: string
  filters?: any
}

export default function BeatsList({ searchQuery = "", filters }: BeatsListProps) {
  const { searchBeats } = useBeats()
  const [beats, setBeats] = useState<any[]>([])
  const [sortBy, setSortBy] = useState("newest")

  // Enhanced search function
  const enhancedSearch = (query: string, allBeats: any[]) => {
    if (!query.trim()) return allBeats

    const searchTerm = query.toLowerCase().trim()

    return allBeats.filter((beat) => {
      // Search in title
      if (beat.title.toLowerCase().includes(searchTerm)) return true

      // Search in producer
      if (beat.producer.toLowerCase().includes(searchTerm)) return true

      // Search in genre
      if (beat.genre.toLowerCase().includes(searchTerm)) return true

      // Search in tags/moods
      if (beat.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm))) return true

      // Search in BPM (exact match or range)
      const bpmMatch = searchTerm.match(/(\d+)/)
      if (bpmMatch) {
        const searchBpm = Number.parseInt(bpmMatch[1])
        // Allow for ±5 BPM tolerance
        if (Math.abs(beat.bpm - searchBpm) <= 5) return true
      }

      // Search in key
      if (beat.key.toLowerCase().includes(searchTerm)) return true

      // Search in description
      if (beat.description && beat.description.toLowerCase().includes(searchTerm)) return true

      return false
    })
  }

  useEffect(() => {
    let filteredBeats = searchBeats("", filters) // Get all beats with filters first

    // Apply enhanced search
    if (searchQuery) {
      filteredBeats = enhancedSearch(searchQuery, filteredBeats)
    }

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        filteredBeats = filteredBeats.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filteredBeats = filteredBeats.sort((a, b) => b.price - a.price)
        break
      case "popular":
        filteredBeats = filteredBeats.sort((a, b) => (b.sales || 0) - (a.sales || 0))
        break
      case "bpm-low":
        filteredBeats = filteredBeats.sort((a, b) => a.bpm - b.bpm)
        break
      case "bpm-high":
        filteredBeats = filteredBeats.sort((a, b) => b.bpm - a.bpm)
        break
      case "newest":
      default:
        filteredBeats = filteredBeats.sort((a, b) => Number.parseInt(b.id) - Number.parseInt(a.id))
        break
    }

    setBeats(filteredBeats)
  }, [searchQuery, filters, sortBy, searchBeats])

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <p className="text-muted-foreground text-sm">
          Showing {beats.length} beat{beats.length !== 1 ? "s" : ""}
          {searchQuery && ` for "${searchQuery}"`}
        </p>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-secondary text-foreground px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm w-full sm:w-auto"
        >
          <option value="newest">Sort by: Newest</option>
          <option value="price-low">Sort by: Price (Low to High)</option>
          <option value="price-high">Sort by: Price (High to Low)</option>
          <option value="popular">Sort by: Most Popular</option>
          <option value="bpm-low">Sort by: BPM (Low to High)</option>
          <option value="bpm-high">Sort by: BPM (High to Low)</option>
        </select>
      </div>

      {beats.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {beats.map((beat) => (
            <BeatCard key={beat.id} beat={beat} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg mb-2">No beats found</p>
          <p className="text-muted-foreground text-sm">
            {searchQuery || filters ? "Try adjusting your search or filters" : "No beats available at the moment"}
          </p>
          {searchQuery && (
            <div className="mt-4 text-sm text-muted-foreground">
              <p>Search tips:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Try searching by genre (trap, hip hop, r&b)</li>
                <li>Search by mood (dark, chill, energetic)</li>
                <li>Search by BPM (140, 95, etc.)</li>
                <li>Search by key (C Minor, G Major)</li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
