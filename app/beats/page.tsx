"use client"

import type React from "react"

import { useState, useEffect, Suspense, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import BeatsList from "@/components/beats-list"
import BeatFilters from "@/components/beat-filters"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

function BeatsPageContent() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({})

  useEffect(() => {
    const query = searchParams.get("search") || ""
    setSearchQuery(query)
  }, [searchParams])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }, [])

  const handleFiltersChange = useCallback((newFilters: any) => {
    setFilters(newFilters)
  }, [])

  return (
    <div className="container mx-auto px-4 py-6 md:py-12 mb-24">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6 font-heading">Beats Marketplace</h1>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search beats, genres, moods..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
        <div className="w-full lg:w-1/4 order-2 lg:order-1">
          <BeatFilters onFiltersChange={handleFiltersChange} />
        </div>

        <div className="w-full lg:w-3/4 order-1 lg:order-2">
          <BeatsList searchQuery={searchQuery} filters={filters} />
        </div>
      </div>
    </div>
  )
}

export default function BeatsPage() {
  return (
    <Suspense fallback={<BeatsLoadingSkeleton />}>
      <BeatsPageContent />
    </Suspense>
  )
}

function BeatsLoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-6 md:py-12 mb-24">
      <Skeleton className="h-10 w-64 mb-6" />
      <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
        <div className="w-full lg:w-1/4">
          <Skeleton className="h-96 w-full" />
        </div>
        <div className="w-full lg:w-3/4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="bg-card rounded-xl p-4">
                  <Skeleton className="h-48 w-full rounded-lg mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <div className="flex gap-2 mb-4">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-24" />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
