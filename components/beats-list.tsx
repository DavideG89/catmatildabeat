"use client"

import { useState, useEffect, useMemo } from "react"
import BeatCard from "@/components/beat-card"
import { beatOperations } from "@/lib/supabase"
import { Loader2 } from "lucide-react"
import type { Beat } from "@/lib/supabase"

interface BeatsListProps {
  searchQuery?: string
  filters?: any
}

export default function BeatsList({ searchQuery = "", filters }: BeatsListProps) {
  const [beats, setBeats] = useState<Beat[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState("newest")

  // Memoize filters to prevent unnecessary re-renders
  const memoizedFilters = useMemo(() => filters, [JSON.stringify(filters)])

  useEffect(() => {
    const loadBeats = async () => {
      setLoading(true)
      try {
        let searchResults: Beat[] = []

        if (searchQuery || (memoizedFilters && Object.keys(memoizedFilters).length > 0)) {
          // Use search with filters
          searchResults = await beatOperations.search(searchQuery, memoizedFilters)
        } else {
          // Get all active beats
          searchResults = await beatOperations.getActive()
        }

        // Apply sorting
        switch (sortBy) {
          case "price-low":
            searchResults = searchResults.sort((a, b) => (a.price || 0) - (b.price || 0))
            break
          case "price-high":
            searchResults = searchResults.sort((a, b) => (b.price || 0) - (a.price || 0))
            break
          case "popular":
            searchResults = searchResults.sort((a, b) => (b.sales || 0) - (a.sales || 0))
            break
          case "bpm-low":
            searchResults = searchResults.sort((a, b) => a.bpm - b.bpm)
            break
          case "bpm-high":
            searchResults = searchResults.sort((a, b) => b.bpm - a.bpm)
            break
          case "newest":
          default:
            searchResults = searchResults.sort(
              (a, b) => new Date(b.created_at || "").getTime() - new Date(a.created_at || "").getTime(),
            )
            break
        }

        setBeats(searchResults)
      } catch (error) {
        console.error("Error loading beats:", error)
        setBeats([])
      } finally {
        setLoading(false)
      }
    }

    loadBeats()
  }, [searchQuery, memoizedFilters, sortBy])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
        <span className="ml-2 text-muted-foreground">Loading beats...</span>
      </div>
    )
  }

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
            <BeatCard
              key={beat.id}
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
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg mb-2">No beats found</p>
          <p className="text-muted-foreground text-sm">
            {searchQuery || (memoizedFilters && Object.keys(memoizedFilters).length > 0)
              ? "Try adjusting your search or filters"
              : "No beats available at the moment"}
          </p>
          {searchQuery && (
            <div className="mt-4 text-sm text-muted-foreground">
              <p>Search tips:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Try searching by genre (trap, hip hop, r&b)</li>
                <li>Search by producer name</li>
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
