"use client"

import { useState, useEffect } from "react"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface BeatFiltersProps {
  onFiltersChange: (filters: any) => void
}

export default function BeatFilters({ onFiltersChange }: BeatFiltersProps) {
  const [bpmRange, setBpmRange] = useState([80, 160])
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [selectedMoods, setSelectedMoods] = useState<string[]>([])
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])

  const genres = ["Trap", "Hip Hop", "R&B", "Pop", "Drill", "Boom Bap", "Lo-Fi", "Ambient"]
  const moods = ["Dark", "Chill", "Energetic", "Emotional", "Happy", "Sad", "Aggressive", "Melodic"]
  const keys = [
    "C Major",
    "C Minor",
    "D Major",
    "D Minor",
    "E Major",
    "E Minor",
    "F Major",
    "F Minor",
    "G Major",
    "G Minor",
    "A Major",
    "A Minor",
  ]

  const handleGenreChange = (genre: string, checked: boolean) => {
    if (checked) {
      setSelectedGenres([...selectedGenres, genre.toLowerCase()])
    } else {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre.toLowerCase()))
    }
  }

  const handleMoodChange = (mood: string, checked: boolean) => {
    if (checked) {
      setSelectedMoods([...selectedMoods, mood.toLowerCase()])
    } else {
      setSelectedMoods(selectedMoods.filter((m) => m !== mood.toLowerCase()))
    }
  }

  const handleKeyChange = (key: string, checked: boolean) => {
    if (checked) {
      setSelectedKeys([...selectedKeys, key.toLowerCase()])
    } else {
      setSelectedKeys(selectedKeys.filter((k) => k !== key.toLowerCase()))
    }
  }

  const applyFilters = () => {
    const filters = {
      genres: selectedGenres,
      moods: selectedMoods,
      keys: selectedKeys,
      bpmRange,
    }
    onFiltersChange(filters)
  }

  const resetFilters = () => {
    setBpmRange([80, 160])
    setSelectedGenres([])
    setSelectedMoods([])
    setSelectedKeys([])
    onFiltersChange({})
  }

  // Auto-apply filters when they change
  useEffect(() => {
    applyFilters()
  }, [selectedGenres, selectedMoods, selectedKeys, bpmRange])

  return (
    <div className="bg-zinc-900 rounded-xl p-4 md:p-6">
      <h2 className="text-xl font-bold mb-6">Filters</h2>

      <Accordion type="multiple" defaultValue={["genres", "bpm", "moods"]} className="space-y-2">
        <AccordionItem value="genres" className="border-zinc-700">
          <AccordionTrigger className="text-left font-medium hover:no-underline py-3">Genres</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 mt-2">
              {genres.map((genre) => (
                <div key={genre} className="flex items-center space-x-2">
                  <Checkbox
                    id={`genre-${genre}`}
                    checked={selectedGenres.includes(genre.toLowerCase())}
                    onCheckedChange={(checked) => handleGenreChange(genre, checked as boolean)}
                  />
                  <Label htmlFor={`genre-${genre}`} className="text-sm cursor-pointer">
                    {genre}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="bpm" className="border-zinc-700">
          <AccordionTrigger className="text-left font-medium hover:no-underline py-3">BPM Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 mt-2">
              <Slider
                value={bpmRange}
                min={60}
                max={200}
                step={1}
                onValueChange={(value) => setBpmRange(value as [number, number])}
              />
              <div className="flex justify-between text-sm">
                <span>{bpmRange[0]} BPM</span>
                <span>{bpmRange[1]} BPM</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="moods" className="border-zinc-700">
          <AccordionTrigger className="text-left font-medium hover:no-underline py-3">Moods</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 mt-2">
              {moods.map((mood) => (
                <div key={mood} className="flex items-center space-x-2">
                  <Checkbox
                    id={`mood-${mood}`}
                    checked={selectedMoods.includes(mood.toLowerCase())}
                    onCheckedChange={(checked) => handleMoodChange(mood, checked as boolean)}
                  />
                  <Label htmlFor={`mood-${mood}`} className="text-sm cursor-pointer">
                    {mood}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="keys" className="border-zinc-700">
          <AccordionTrigger className="text-left font-medium hover:no-underline py-3">Keys</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {keys.map((key) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={`key-${key}`}
                    checked={selectedKeys.includes(key.toLowerCase())}
                    onCheckedChange={(checked) => handleKeyChange(key, checked as boolean)}
                  />
                  <Label htmlFor={`key-${key}`} className="text-sm cursor-pointer">
                    {key}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="mt-6 space-y-2">
        <Button onClick={resetFilters} variant="outline" className="w-full bg-transparent">
          Reset Filters
        </Button>
      </div>
    </div>
  )
}
