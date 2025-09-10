"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Upload, X, CheckCircle } from "lucide-react"
import { useBeats } from "@/components/beats-context"

export default function UploadBeatForm() {
  const { addBeat } = useBeats()
  const [formData, setFormData] = useState({
    title: "",
    genre: "",
    mood: "",
    customMood: "",
    key: "",
    customKey: "",
    description: "",
    basicPrice: "",
    premiumPrice: "",
    exclusivePrice: "",
    beatstarsLink: "",
    duration: "", // Add duration field
  })
  const [coverImage, setCoverImage] = useState<string | null>(null)
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [bpm, setBpm] = useState(140)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setCoverImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAudioFile(file)
    }
  }

  const removeCoverImage = () => {
    setCoverImage(null)
  }

  const removeAudioFile = () => {
    setAudioFile(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      // Create the new beat
      const newBeat = {
        id: Date.now().toString(),
        title: formData.title,
        producer: "Cat Matilda Beat",
        coverImage: coverImage || "/placeholder.svg?height=400&width=400",
        price: Number.parseFloat(formData.basicPrice) || 29.99,
        bpm,
        key: formData.key === "custom" ? formData.customKey : formData.key,
        genre: formData.genre,
        tags: [formData.genre, formData.mood === "custom" ? formData.customMood : formData.mood, `${bpm} BPM`].filter(
          Boolean,
        ),
        status: "Active",
        beatstarsLink: formData.beatstarsLink,
        sales: 0,
        description: formData.description,
        duration: formData.duration || "3:00", // Add duration
      }

      // Add beat to context
      addBeat(newBeat)

      setIsSubmitting(false)
      setIsSubmitted(true)

      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false)
        setFormData({
          title: "",
          genre: "",
          mood: "",
          customMood: "",
          key: "",
          customKey: "",
          description: "",
          basicPrice: "",
          premiumPrice: "",
          exclusivePrice: "",
          beatstarsLink: "",
          duration: "", // Add duration field
        })
        setCoverImage(null)
        setAudioFile(null)
        setBpm(140)
      }, 3000)
    }, 2000)
  }

  if (isSubmitted) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-2">Beat Uploaded Successfully!</h3>
        <p className="text-muted-foreground">
          Your beat has been added to your collection and is now live on the website.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Beat Title *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter beat title"
              required
            />
          </div>

          <div>
            <Label htmlFor="genre">Genre *</Label>
            <Select value={formData.genre} onValueChange={(value) => handleSelectChange("genre", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Trap">Trap</SelectItem>
                <SelectItem value="Hip Hop">Hip Hop</SelectItem>
                <SelectItem value="R&B">R&B</SelectItem>
                <SelectItem value="Pop">Pop</SelectItem>
                <SelectItem value="Drill">Drill</SelectItem>
                <SelectItem value="Boom Bap">Boom Bap</SelectItem>
                <SelectItem value="Lo-Fi">Lo-Fi</SelectItem>
                <SelectItem value="Ambient">Ambient</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="mood">Mood</Label>
            <Select value={formData.mood} onValueChange={(value) => handleSelectChange("mood", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select mood" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Dark">Dark</SelectItem>
                <SelectItem value="Chill">Chill</SelectItem>
                <SelectItem value="Energetic">Energetic</SelectItem>
                <SelectItem value="Emotional">Emotional</SelectItem>
                <SelectItem value="Happy">Happy</SelectItem>
                <SelectItem value="Sad">Sad</SelectItem>
                <SelectItem value="Aggressive">Aggressive</SelectItem>
                <SelectItem value="Melodic">Melodic</SelectItem>
                <SelectItem value="custom">Other (specify)</SelectItem>
              </SelectContent>
            </Select>
            {formData.mood === "custom" && (
              <Input
                name="customMood"
                value={formData.customMood}
                onChange={handleInputChange}
                placeholder="Enter custom mood"
                className="mt-2"
              />
            )}
          </div>

          <div>
            <Label htmlFor="key">Key</Label>
            <Select value={formData.key} onValueChange={(value) => handleSelectChange("key", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select key" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="C Major">C Major</SelectItem>
                <SelectItem value="C Minor">C Minor</SelectItem>
                <SelectItem value="D Major">D Major</SelectItem>
                <SelectItem value="D Minor">D Minor</SelectItem>
                <SelectItem value="E Major">E Major</SelectItem>
                <SelectItem value="E Minor">E Minor</SelectItem>
                <SelectItem value="F Major">F Major</SelectItem>
                <SelectItem value="F Minor">F Minor</SelectItem>
                <SelectItem value="G Major">G Major</SelectItem>
                <SelectItem value="G Minor">G Minor</SelectItem>
                <SelectItem value="A Major">A Major</SelectItem>
                <SelectItem value="A Minor">A Minor</SelectItem>
                <SelectItem value="custom">Other (specify)</SelectItem>
              </SelectContent>
            </Select>
            {formData.key === "custom" && (
              <Input
                name="customKey"
                value={formData.customKey}
                onChange={handleInputChange}
                placeholder="Enter custom key"
                className="mt-2"
              />
            )}
          </div>

          <div>
            <Label>BPM: {bpm}</Label>
            <Slider
              value={[bpm]}
              min={60}
              max={200}
              step={1}
              onValueChange={(value) => setBpm(value[0])}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="beatstarsLink">BeatStars Link *</Label>
            <Input
              id="beatstarsLink"
              name="beatstarsLink"
              value={formData.beatstarsLink}
              onChange={handleInputChange}
              placeholder="https://beatstars.com/beat/your-beat"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">This link will be used for the "Buy Now" button</p>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your beat..."
              className="h-32"
            />
          </div>

          <div>
            <Label htmlFor="duration">Duration</Label>
            <Input
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              placeholder="3:00"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <Label>Cover Image</Label>
            {coverImage ? (
              <div className="relative mt-2">
                <img
                  src={coverImage || "/placeholder.svg"}
                  alt="Cover preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeCoverImage}
                  className="absolute top-2 right-2 bg-black/70 p-1 rounded-full"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-zinc-700 rounded-lg p-6 mt-2 text-center">
                <Upload className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-400 mb-2">Drag and drop or click to upload</p>
                <p className="text-xs text-gray-500">PNG, JPG or WEBP (1:1 ratio recommended)</p>
                <Input
                  id="coverImage"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleCoverImageChange}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="mt-4 bg-transparent"
                  onClick={() => document.getElementById("coverImage")?.click()}
                >
                  Select File
                </Button>
              </div>
            )}
          </div>

          <div>
            <Label>Audio File</Label>
            {audioFile ? (
              <div className="flex items-center justify-between bg-zinc-800 p-3 rounded-lg mt-2">
                <div className="truncate">
                  <p className="font-medium truncate">{audioFile.name}</p>
                  <p className="text-xs text-gray-400">{(audioFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
                <button type="button" onClick={removeAudioFile} className="bg-zinc-700 p-1 rounded-full">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-zinc-700 rounded-lg p-6 mt-2 text-center">
                <Upload className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-400 mb-2">Drag and drop or click to upload</p>
                <p className="text-xs text-gray-500">MP3 or WAV files only</p>
                <Input
                  id="audioFile"
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  onChange={handleAudioFileChange}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="mt-4 bg-transparent"
                  onClick={() => document.getElementById("audioFile")?.click()}
                >
                  Select File
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="basicPrice">Basic License Price ($)</Label>
              <Input
                id="basicPrice"
                name="basicPrice"
                type="number"
                step="0.01"
                value={formData.basicPrice}
                onChange={handleInputChange}
                placeholder="29.99"
              />
            </div>

            <div>
              <Label htmlFor="premiumPrice">Premium License Price ($)</Label>
              <Input
                id="premiumPrice"
                name="premiumPrice"
                type="number"
                step="0.01"
                value={formData.premiumPrice}
                onChange={handleInputChange}
                placeholder="79.99"
              />
            </div>

            <div>
              <Label htmlFor="exclusivePrice">Exclusive License Price ($)</Label>
              <Input
                id="exclusivePrice"
                name="exclusivePrice"
                type="number"
                step="0.01"
                value={formData.exclusivePrice}
                onChange={handleInputChange}
                placeholder="299.99"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
        <Button type="button" variant="outline" className="w-full sm:w-auto bg-transparent">
          Save as Draft
        </Button>
        <Button type="submit" className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto" disabled={isSubmitting}>
          {isSubmitting ? "Publishing..." : "Publish Beat"}
        </Button>
      </div>
    </form>
  )
}
