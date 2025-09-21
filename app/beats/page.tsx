"use client"

import type React from "react"

import { useState, useEffect, Suspense, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import BeatsList from "@/components/beats-list"
import BeatFilters from "@/components/beat-filters"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"
import { Search } from "lucide-react"

function BeatsPageContent() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({})
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const activeFiltersCount = Object.keys(filters || {}).length

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

        {/* Search + Mobile Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search beats, genres, moods..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 border-black"
            />
          </div>
          <div className="sm:hidden">
            <Button
              variant="outline"
              onClick={() => setMobileFiltersOpen(true)}
              className="relative gap-2 h-10 px-4 rounded-xl bg-zinc-900 text-white border border-zinc-800 shadow-sm hover:bg-zinc-800 focus-visible:ring-2 focus-visible:ring-brand-500"
              aria-label="Open filters"
            >
              <Filter className="h-4 w-4" /> Filters
              {activeFiltersCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-600 text-white text-[10px] leading-none px-1.5 py-0.5 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
        <div className="w-full lg:w-2/3 xl:w-3/4 order-1">
          <BeatsList searchQuery={searchQuery} filters={filters} />
        </div>

        {/* Sidebar Filters (desktop) */}
        <div className="hidden lg:block w-full lg:w-1/3 xl:w-1/4 order-2">
          <BeatFilters onFiltersChange={handleFiltersChange} />
        </div>
      </div>

      {/* Mobile Filters Sheet */}
      <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
        <SheetContent
          side="bottom"
          className="p-0 h-[85svh] sm:h-[80svh] rounded-t-2xl pb-[env(safe-area-inset-bottom)] bg-zinc-900 border-t border-zinc-800"
        >
          <div className="pt-3 pb-1 flex justify-center">
            <div className="h-1.5 w-12 bg-zinc-700 rounded-full" />
          </div>
          <SheetHeader className="px-4 pb-3 border-b border-zinc-800">
            <SheetTitle className="text-white">Filters</SheetTitle>
          </SheetHeader>
          <div className="p-4 overflow-y-auto overscroll-contain h-[calc(85svh-60px)] sm:h-[calc(80svh-60px)]">
            <BeatFilters onFiltersChange={handleFiltersChange} />
          </div>
        </SheetContent>
      </Sheet>
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
        <div className="w-full lg:w-2/3 xl:w-3/4 order-1">
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
        <div className="w-full lg:w-1/3 xl:w-1/4 order-2">
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    </div>
  )
}
