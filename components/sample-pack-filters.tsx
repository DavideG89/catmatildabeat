"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Slider } from "@/components/ui/slider"
import { useState } from "react"

export default function SamplePackFilters() {
  const [priceRange, setPriceRange] = useState([0, 100])

  const genres = [
    "Alternative HipHop",
    "Alternative Rock",
    "Ambient",
    "Ambient Electronic",
    "Boom Bap / Old school",
    "Cinematic Emotional",
    "Electronic",
    "Funk",
    "FunkRock",
    "HipHop",
    "Indie",
    "Lo-Fi",
    "Rap",
    "Rock",
    "Synthwave",
    "Trip Hop",
  ]

  const types = [
    "Drum Kits",
    "Melody Loops",
    "One Shots",
    "Vocal Samples",
    "Sound Effects",
    "MIDI Files",
    "Full Compositions",
  ]

  return (
    <div className="bg-zinc-900 rounded-xl p-6">
      <h2 className="text-xl font-bold mb-6">Filters</h2>

      <Accordion type="multiple" defaultValue={["genres", "types", "price"]}>
        <AccordionItem value="genres">
          <AccordionTrigger className="text-left font-medium">Genres</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 mt-2">
              {genres.map((genre) => (
                <div key={genre} className="flex items-center space-x-2">
                  <Checkbox id={`genre-${genre}`} />
                  <Label htmlFor={`genre-${genre}`} className="text-sm cursor-pointer">
                    {genre}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="types">
          <AccordionTrigger className="text-left font-medium">Sample Types</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 mt-2">
              {types.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox id={`type-${type}`} />
                  <Label htmlFor={`type-${type}`} className="text-sm cursor-pointer">
                    {type}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger className="text-left font-medium">Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 mt-2">
              <Slider
                value={priceRange}
                min={0}
                max={200}
                step={5}
                onValueChange={(value) => setPriceRange(value as [number, number])}
              />
              <div className="flex justify-between text-sm">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="mt-6 space-y-2">
        <Button className="w-full bg-purple-600 hover:bg-purple-700">Apply Filters</Button>
        <Button variant="outline" className="w-full">
          Reset Filters
        </Button>
      </div>
    </div>
  )
}
