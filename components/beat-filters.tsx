"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { beatOperations } from "@/lib/supabase"

interface BeatFiltersProps {
  onFiltersChange: (filters: any) => void
}

export default function BeatFilters({ onFiltersChange }: BeatFiltersProps) {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const [bpmRange, setBpmRange] = useState<[number, number]>([60, 200])
  const [availableGenres, setAvailableGenres] = useState<string[]>([])
  const [availableKeys, setAvailableKeys] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  // Default genres and keys as fallback
  const defaultGenres = [
    "Hip Hop",
    "Trap",
    "R&B",
    "Pop",
    "Drill",
    "Afrobeat",
    "Reggaeton",
    "House",
    "Electronic",
    "Rock",
    "Jazz",
    "Blues",
  ]

  const defaultKeys = [
    "C Major",
    "C Minor",
    "C# Major",
    "C# Minor",
    "D Major",
    "D Minor",
    "D# Major",
    "D# Minor",
    "E Major",
    "E Minor",
    "F Major",
    "F Minor",
    "F# Major",
    "F# Minor",
    "G Major",
    "G Minor",
    "G# Major",
    "G# Minor",
    "A Major",
    "A Minor",
    "A# Major",
    "A# Minor",
    "B Major",
    "B Minor",
  ]

  // Load available filter options from database
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const [genres, keys] = await Promise.all([beatOperations.getUniqueGenres(), beatOperations.getUniqueKeys()])

        setAvailableGenres(genres.length > 0 ? genres : defaultGenres)
        setAvailableKeys(keys.length > 0 ? keys : defaultKeys)
      } catch (error) {
        console.error("Error loading filter options:", error)
        // Use defaults on error
        setAvailableGenres(defaultGenres)
        setAvailableKeys(defaultKeys)
      } finally {
        setLoading(false)
      }
    }

    loadFilterOptions()
  }, [])

  // Update filters when selections change
  useEffect(() => {
    const filters: any = {}

    if (selectedGenres.length > 0) {
      filters.genres = selectedGenres
    }

    if (selectedKeys.length > 0) {
      filters.keys = selectedKeys
    }

    if (bpmRange[0] !== 60 || bpmRange[1] !== 200) {
      filters.bpmRange = bpmRange
    }

    onFiltersChange(filters)
  }, [selectedGenres, selectedKeys, bpmRange, onFiltersChange])

  const handleGenreChange = useCallback((genre: string) => {
    setSelectedGenres((prev) => (prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]))
  }, [])

  const handleKeyChange = useCallback((key: string) => {
    setSelectedKeys((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]))
  }, [])

  const handleBpmChange = useCallback((value: number[]) => {
    setBpmRange([value[0], value[1]])
  }, [])

  const clearAllFilters = useCallback(() => {
    setSelectedGenres([])
    setSelectedKeys([])
    setBpmRange([60, 200])
  }, [])

  const hasActiveFilters =
    selectedGenres.length > 0 || selectedKeys.length > 0 || bpmRange[0] !== 60 || bpmRange[1] !== 200

  if (loading) {
    return (
      <div className="bg-zinc-900 rounded-xl p-4">
        <div className="animate-pulse">
          <div className="h-6 bg-zinc-800 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-zinc-800 rounded"></div>
            <div className="h-4 bg-zinc-800 rounded"></div>
            <div className="h-4 bg-zinc-800 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-zinc-900 rounded-xl p-4 lg:sticky lg:top-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-brand-400 hover:text-brand-300 text-xs"
          >
            Clear All
          </Button>
        )}
      </div>

      <Accordion type="multiple" defaultValue={["genres", "keys", "bpm"]} className="w-full">
        {/* Genres */}
        <AccordionItem value="genres" className="border-zinc-800">
          <AccordionTrigger className="text-white hover:text-brand-400 py-2 sm:py-3">
            <span className="flex items-center gap-2">
              Genres
              {selectedGenres.length > 0 && (
                <span className="bg-brand-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {selectedGenres.length}
                </span>
              )}
            </span>
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {availableGenres.map((genre) => (
                <Button
                  key={genre}
                  variant={selectedGenres.includes(genre) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleGenreChange(genre)}
                  className={`text-xs justify-start ${
                    selectedGenres.includes(genre)
                      ? "bg-brand-600 hover:bg-brand-500 text-white border-brand-600"
                      : "bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                  }`}
                >
                  {genre}
                </Button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Keys */}
        <AccordionItem value="keys" className="border-zinc-800">
          <AccordionTrigger className="text-white hover:text-brand-400 py-2 sm:py-3">
            <span className="flex items-center gap-2">
              Keys
              {selectedKeys.length > 0 && (
                <span className="bg-brand-500 text-white text-xs px-2 py-0.5 rounded-full">{selectedKeys.length}</span>
              )}
            </span>
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {availableKeys.map((key) => (
                <Button
                  key={key}
                  variant={selectedKeys.includes(key) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleKeyChange(key)}
                  className={`text-xs justify-start ${
                    selectedKeys.includes(key)
                      ? "bg-brand-600 hover:bg-brand-500 text-white border-brand-600"
                      : "bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                  }`}
                >
                  {key}
                </Button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* BPM Range */}
        <AccordionItem value="bpm" className="border-zinc-800">
          <AccordionTrigger className="text-white hover:text-brand-400 py-2 sm:py-3">
            <span className="flex items-center gap-2">
              BPM Range
              {(bpmRange[0] !== 60 || bpmRange[1] !== 200) && (
                <span className="bg-brand-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {bpmRange[0]}-{bpmRange[1]}
                </span>
              )}
            </span>
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-zinc-400">
                <span>{bpmRange[0]} BPM</span>
                <span>{bpmRange[1]} BPM</span>
              </div>
              <Slider
                value={bpmRange}
                onValueChange={handleBpmChange}
                min={60}
                max={200}
                step={1}
                className="w-full"
                aria-label="BPM Range"
              />
              <div className="flex justify-between text-xs text-zinc-500">
                <span>60</span>
                <span>200</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
