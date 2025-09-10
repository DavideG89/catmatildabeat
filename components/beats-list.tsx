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

  useEffect(() => {
    let filteredBeats = searchBeats(searchQuery, filters)

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
        </div>
      )}
    </div>
  )
}
